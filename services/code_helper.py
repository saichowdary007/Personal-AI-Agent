from typing import Optional, Dict, Any
from utils.gemini_client import GeminiClient
import logging
import time
import functools
try:
    import black
except ImportError:
    black = None

logger = logging.getLogger(__name__)

class CodeHelperService:
    def __init__(self, gemini_client: GeminiClient):
        self.gemini_client = gemini_client
        # Base prompt for the LLM; keep it concise to avoid overloading context
        # Instruct the model to wrap code examples in markdown fences with a language tag for syntax highlighting
        self.system_prompt = (
            "You are an expert programming assistant; answer concisely and clearly. "
            "When providing code examples, wrap them in markdown triple backticks with the appropriate language tag "
            "so they render with syntax highlighting. Prefix explanations with plain text before the code block. "
            "Do not omit the language tag (like 'python' or 'js')."
        )

    def build_action_prompt(self, action: str, language: str, parameters: Optional[dict]) -> str:
        mapping = {
            "debug": "\nAnalyze this code for bugs and provide fixes.",
            "improve": "\nSuggest improvements for this code, focusing on efficiency and best practices.",
            "document": "\nAdd comprehensive documentation and comments to this code."
        }
        if action == "convert":
            target_lang = parameters.get("target_language", language) if parameters else language
            return f"\nConvert this code from {language} to {target_lang}."
        return mapping.get(action, "")

    async def process(self, content: str, parameters: Optional[dict] = None) -> Dict[str, Any]:
        """Process code-related requests"""
        try:
            # Input validation
            if not content or not content.strip():
                return {
                    "content": "Please paste code or describe your coding problem.",
                    "metadata": {"error": "Empty input"}
                }
            if len(content.strip()) < 5:
                return {
                    "content": "Please provide a more detailed code snippet or question.",
                    "metadata": {"error": "Input too short"}
                }
            # Quick greeting check: if the user says hello, respond with a friendly overview
            greeting = content.strip().lower()
            if greeting in {"hello", "hi", "hey", "good morning", "good afternoon", "good evening"}:
                return {
                    "content": "Hello! 👋 I'm CodeHelperService. I can explain code, debug issues, suggest improvements, add documentation, or convert between languages. What would you like to do today?",
                    "metadata": {"action": "greeting"}
                }
            # Get parameters or use defaults
            action = parameters.get("action", "explain") if parameters else "explain"
            language = parameters.get("language", "python") if parameters else "python"
            
            logger.info("Processing request with action=%s, language=%s", action, language)

            # Build action-specific prompt segment
            action_prompt = self.build_action_prompt(action, language, parameters)

            # Track LLM response time
            start_time = time.time()
            
            # Generate response
            response = await self.gemini_client.generate_response(
                prompt=content,
                system_prompt=f"{self.system_prompt}{action_prompt}\nLanguage: {language}",
                temperature=0.3
            )
            elapsed = time.time() - start_time
            logger.info("LLM response time: %.2fs", elapsed)

            # Optionally auto-format Python code with Black
            if language == "python" and black and action in {"improve", "document"} and response.get("content"):
                response["content"] = self._format_python_code(response["content"])

            if not response or not response.get("content"):
                logger.warning("LLM response was empty or malformed.")
                return {
                    "content": "Sorry, I couldn't process your code. Please try again.",
                    "metadata": {"error": "Empty LLM response"}
                }

            return {
                "content": response["content"],
                "metadata": {
                    "action": action,
                    "language": language,
                    "model": response.get("model"),
                    "elapsed": elapsed
                }
            }
        except Exception as e:
            logger.error("CodeHelperService error: %s", str(e))
            return {
                "content": "Sorry, something went wrong while processing your code. Please try again or rephrase your question.",
                "metadata": {"error": str(e)}
            }

    @staticmethod
    def _format_python_code(code: str) -> str:
        """Format Python code with proper indentation and style"""
        # Use Black formatter for Python if available
        if language.lower() == "python" and black:
            try:
                return black.format_str(code, mode=black.FileMode())
            except Exception as e:
                logger.warning("Black formatting failed: %s. Falling back to basic formatter.", e)

        # Fallback to basic placeholder formatter - replace with proper parser if needed
        lines = code.split("\n")
        formatted_lines = []
        indent = 0
        
        for line in lines:
            # Simple indentation rules - should be replaced with proper parser
            stripped = line.strip()
            if stripped.endswith(":"):
                formatted_lines.append("    " * indent + stripped)
                indent += 1
            elif stripped.startswith(("return", "break", "continue")):
                indent = max(0, indent - 1)
                formatted_lines.append("    " * indent + stripped)
            else:
                formatted_lines.append("    " * indent + stripped)
        
        return "\n".join(formatted_lines)

    @staticmethod
    @functools.lru_cache(maxsize=128)
    def extract_imports(code: str) -> list:
        """Extract import statements from code"""
        imports = []
        for line in code.split("\n"):
            line = line.strip()
            if line.startswith(("import ", "from ")):
                imports.append(line)
        return imports