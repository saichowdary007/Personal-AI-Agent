from typing import Optional, Dict, Any
from utils.logger import logger
from utils.llm_client import LLMClient
import os

class ChatService:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client
        self.model_name = os.getenv("OPENROUTER_DEFAULT_MODEL", "mistralai/mistral-7b-instruct:free")
        # System prompt for basic chat
        self.system_prompt_content = """You are a helpful AI assistant. Respond clearly and concisely."""

    async def process(self, content: str, parameters: Optional[dict] = None) -> dict:
        """Process chat messages using LLMClient (stateless)"""
        logger.info(f"Processing chat with input: {content}")
        
        # Get custom temperature if provided
        temperature = parameters.get("temperature", 0.7) if parameters else 0.7
        # Get custom model if provided
        model = parameters.get("model", self.model_name) if parameters else self.model_name

        try:
            # Call LLMClient directly
            response = await self.llm_client.generate_response(
                prompt=content,
                system_prompt=self.system_prompt_content, 
                temperature=temperature,
                model=model
                # max_tokens could be added as a parameter if needed
            )
            
            logger.info("Chat response generated via LLMClient.")

            # Extract metadata
            metadata = {
                "model": response.get("model", model),
                "usage": response.get("usage"),
                "memory_backend": "None (Stateless)",
            }
            # Remove None values from metadata
            metadata = {k: v for k, v in metadata.items() if v is not None}

            return {
                "content": response["content"],
                "metadata": metadata
            }
        except Exception as e:
            logger.error(f"Error during LLMClient chat processing: {e}", exc_info=True)
            return {
                "content": f"I apologize, but I encountered an error processing the chat: {str(e)}",
                "metadata": {"error": str(e)}
            } 