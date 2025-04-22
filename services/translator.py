from typing import Optional, Dict, Any
# from utils.gemini_client import GeminiClient

class TranslatorService:
    def __init__(self, gemini_client):
        self.gemini_client = gemini_client
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
            translation_prompt = f"Translate the following text to {target_language} (preserve formatting and context):\n{content}"
            response = await self.gemini_client.generate_response(
                prompt=translation_prompt,
                system_prompt=None,
                temperature=0.3
            )
            return {
                "content": response.get("content", ""),
                "metadata": {
                    "source_length": len(content),
                    "target_length": len(response.get("content", "")),
                    "target_language": target_language,
                    "model": response.get("model", "gemini-pro")
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