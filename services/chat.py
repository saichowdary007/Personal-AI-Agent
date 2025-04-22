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
        try:
            response = await self.gemini_client.generate_response(
                prompt=content,
                system_prompt=self.system_prompt,
                temperature=0.7
            )
            return {
                "content": response.get("content", ""),
                "metadata": {
                    "model": response.get("model"),
                    "usage": response.get("usage")
                }
            }
        except Exception as e:
            return {
                "content": f"I apologize, but I encountered an error during chat: {e}",
                "metadata": {"error": str(e)}
            }

if __name__ == "__main__":
    import uvicorn
    # Removed
