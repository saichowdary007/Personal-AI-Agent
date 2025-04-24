from fastapi import Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import logging
from utils.gemini_client import GeminiClient

# Configure CORS to allow Next.js frontend
# Removed

logger = logging.getLogger("ChatService")

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    conversation_history: List[Dict[str, str]] = Field(default_factory=list)
    temperature: float = Field(0.7, ge=0.0, le=1.0)

class ChatResponse(BaseModel):
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ChatService:
    """
    Service to handle conversational chat requests via LLMClient.
    """
    def __init__(self, gemini_client: GeminiClient):
        self.gemini_client = gemini_client
        self.system_prompt = (
            "You are a helpful conversational AI assistant. Engage in dialogue and answer questions concisely."
        )

    async def process(self, request: ChatRequest) -> ChatResponse:
        """Process a chat request with conversation history"""
        try:
            # Build context from conversation history
            context = "\n".join(
                [f"{msg['role']}: {msg['content']}" 
                 for msg in request.conversation_history]
            )
            
            full_prompt = f"{context}\nuser: {request.message}"
            
            response = await self.gemini_client.generate_response(
                prompt=full_prompt,
                temperature=request.temperature
            )
            logger.info(f"Raw Gemini response: {response}")
            
            content = response.get("content") if response else None
            if not content or not isinstance(content, str) or not content.strip():
                logger.warning("Empty or missing response from Gemini")
                return ChatResponse(
                    content="[Gemini] No meaningful content returned.",
                    metadata={"error": "empty_content"}
                )
                
            return ChatResponse(
                content=response["content"],
                metadata={
                    "usage": response.get("usage"),
                    "conversation_id": response.get("conversation_id")
                }
            )
            
        except Exception as e:
            logger.error(f"Chat processing failed: {str(e)}", exc_info=True)
            return ChatResponse(
                message="Sorry, an error occurred processing your request.",
                metadata={"error": str(e)}
            )

if __name__ == "__main__":
    import uvicorn
    # Removed
