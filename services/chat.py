from fastapi import Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from utils.gemini_client import GeminiClient

# Configure CORS to allow Next.js frontend
# Removed

class UserLogin(BaseModel):
    username: str
    password: str

class ChatService:
    """
    Service to handle conversational chat requests via LLMClient.
    """
    def __init__(self, gemini_client: GeminiClient):
        self.gemini_client = gemini_client
        self.system_prompt = (
            "You are a helpful conversational AI assistant. Engage in dialogue and answer questions concisely."
        )

    async def process(
        self, content: str, parameters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        import logging
        logger = logging.getLogger("ChatService")
        if not content or not content.strip():
            return {
                "content": "Please enter a message to start the conversation.",
                "metadata": {"error": "Empty message"}
            }
        try:
            response = await self.gemini_client.generate_response(
                prompt=content.strip(),
                system_prompt=self.system_prompt,
                temperature=0.7
            )
            if not response or not response.get("content"):
                logger.warning("Gemini response was empty or malformed.")
                return {
                    "content": "Sorry, I couldn't generate a response. Please try again.",
                    "metadata": {"error": "Empty LLM response"}
                }
            return {
                "content": response.get("content", ""),
                "metadata": {
                    "model": response.get("model"),
                    "usage": response.get("usage")
                }
            }
        except Exception as e:
            logger.error(f"ChatService error: {e}")
            return {
                "content": "Sorry, something went wrong while processing your message. Please try again or rephrase your question.",
                "metadata": {"error": str(e)}
            }

if __name__ == "__main__":
    import uvicorn
    # Removed
