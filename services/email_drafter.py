from typing import Optional, Dict, Any
from utils.gemini_client import GeminiClient

class EmailDraftService:
    def __init__(self, gemini_client: GeminiClient):
        self.gemini_client = gemini_client
        self.system_prompt = """You are an expert email writer. Your task is to:
1. Draft clear, professional emails
2. Maintain appropriate tone and formality
3. Include all necessary components (greeting, body, closing)
4. Follow email etiquette and best practices
5. Adapt style based on the context and recipient

Format the email properly with line breaks and standard email structure."""

    async def process(self, content: str, parameters: Optional[dict] = None) -> dict:
        """Process email drafting requests"""
        import logging
        logger = logging.getLogger("EmailDraftService")
        # Input validation
        if not content or not content.strip():
            return {
                "content": "Please describe the email you want to draft.",
                "metadata": {"error": "Empty prompt"}
            }
        if len(content.strip()) < 10:
            return {
                "content": "Please provide a more detailed description for the email.",
                "metadata": {"error": "Prompt too short"}
            }
        try:
            # Get parameters or use defaults
            tone = parameters.get("tone", "professional") if parameters else "professional"
            format_type = parameters.get("format", "full") if parameters else "full"
            
            # Adjust system prompt based on parameters
            style_instruction = f"\nUse a {tone} tone."
            if format_type == "reply":
                style_instruction += "\nFormat this as a reply to a previous email."
            elif format_type == "forward":
                style_instruction += "\nFormat this as a forwarded email with appropriate context."
            
            # Generate email
            response = await self.gemini_client.generate_response(
                prompt=content.strip(),
                system_prompt=f"{self.system_prompt}{style_instruction}",
                temperature=0.7  # Balanced temperature for creativity and professionalism
            )
            if not response or not response.get("content"):
                logger.warning("Gemini response was empty or malformed.")
                return {
                    "content": "Sorry, I couldn't generate the email draft. Please try again.",
                    "metadata": {"error": "Empty LLM response"}
                }
            return {
                "content": response["content"],
                "metadata": {
                    "tone": tone,
                    "format": format_type,
                    "model": response["model"]
                }
            }
        except Exception as e:
            logger.error(f"EmailDraftService error: {e}")
            return {
                "content": "Sorry, something went wrong while drafting your email. Please try again or rephrase your request.",
                "metadata": {"error": str(e)}
            }

    @staticmethod
    def _extract_email_parts(email_text: str) -> Dict[str, str]:
        """Helper method to extract different parts of an email"""
        parts = {
            "subject": "",
            "greeting": "",
            "body": "",
            "closing": "",
            "signature": ""
        }
        
        # Simple parsing logic - could be enhanced with regex
        lines = email_text.split("\n")
        current_part = "body"
        
        for line in lines:
            line = line.strip()
            if line.lower().startswith("subject:"):
                parts["subject"] = line[8:].strip()
            elif line.lower().startswith(("dear ", "hi ", "hello ")):
                parts["greeting"] = line
            elif line.lower().startswith(("best", "regards", "sincerely", "thanks")):
                parts["closing"] = line
                current_part = "signature"
            elif current_part == "signature":
                parts["signature"] += line + "\n"
            else:
                parts["body"] += line + "\n"
        
        return parts 