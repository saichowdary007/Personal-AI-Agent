from typing import Optional, Dict, Any
from utils.llm_client import LLMClient

class TranslatorService:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client
        self.system_prompt = """You are an expert language translator. Your task is to:
1. Accurately translate the given text
2. Maintain the original meaning and context
3. Consider cultural nuances and idioms
4. Preserve formatting and tone
5. Provide natural, fluent translations

If specific terms should not be translated (like names or technical terms), preserve them as is."""

    async def process(self, content: str, parameters: Optional[dict] = None) -> dict:
        """Process translation requests"""
        try:
            if not parameters or "target_language" not in parameters:
                return {
                    "content": "Please specify a target language for translation.",
                    "metadata": {"error": "Missing target language"}
                }
            
            target_language = parameters["target_language"]
            preserve_format = parameters.get("preserve_format", True)
            
            # Adjust system prompt based on parameters
            format_instruction = ""
            if preserve_format:
                format_instruction = "\nMaintain the original text's formatting, including line breaks and special characters."
            
            # Generate translation
            response = await self.llm_client.generate_response(
                prompt=content,
                system_prompt=f"{self.system_prompt}{format_instruction}\nTranslate to {target_language}.",
                temperature=0.3  # Lower temperature for more accurate translations
            )
            
            return {
                "content": response["content"],
                "metadata": {
                    "source_length": len(content),
                    "target_length": len(response["content"]),
                    "target_language": target_language,
                    "model": response["model"]
                }
            }
        except Exception as e:
            return {
                "content": f"I apologize, but I encountered an error while translating: {str(e)}",
                "metadata": {"error": str(e)}
            }

    @staticmethod
    def detect_language(text: str) -> str:
        """
        Simple language detection based on common patterns
        For production, use a proper language detection library like langdetect
        """
        # This is a placeholder - in production, use a proper language detection library
        common_words = {
            "the": "English",
            "le": "French",
            "el": "Spanish",
            "der": "German",
            "il": "Italian"
        }
        
        text_lower = text.lower()
        for word, language in common_words.items():
            if f" {word} " in f" {text_lower} ":
                return language
        
        return "Unknown" 