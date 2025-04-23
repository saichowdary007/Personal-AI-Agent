from typing import Optional, Dict, Any
from utils.file_handler import FileHandler
from utils.logger import logger
from utils.gemini_client import GeminiClient
import os

class SummarizeService:
    def __init__(self, gemini_client: GeminiClient, file_handler: FileHandler = FileHandler()):
        self.gemini_client = gemini_client
        self.file_handler = file_handler
        # System prompt for basic summarization
        self.system_prompt_base = """You are a text summarization expert. Please provide a clear and concise summary of the following text:"""

    async def process(self, content: Optional[str] = None, parameters: Optional[dict] = None) -> dict:
        """Process summarization requests using LLMClient"""
        text_to_summarize = None
        source_type = "text"
        filename = None
        metadata = {}

        if parameters and "filename" in parameters:
            filename = parameters["filename"]
            source_type = "file"
            metadata["filename"] = filename
            logger.info(f"Attempting to read file for summarization: {filename}")
            text_to_summarize = await self.file_handler.read_pdf(filename) or await self.file_handler.read_file(filename)
            
            if text_to_summarize is None:
                logger.error(f"Failed to read file: {filename}")
                return {
                    "content": f"Error: Could not read file '{filename}'. Ensure it exists in the data directory and is a supported format (text or PDF).",
                    "metadata": {"error": "File read error", **metadata}
                }
            logger.info(f"Successfully read file: {filename}, length: {len(text_to_summarize)}")
        elif content:
            text_to_summarize = content
        else:
            return {
                "content": "Please provide text or upload a file to summarize.",
                "metadata": {"error": "Missing input"}
            }

        # Input validation
        if not text_to_summarize or not text_to_summarize.strip():
            return {
                "content": "Cannot summarize empty content. Please enter or upload text.",
                "metadata": {"error": "Empty content"}
            }
        if len(text_to_summarize) < 20:
            return {
                "content": "Input is too short to summarize. Please provide more text.",
                "metadata": {"error": "Input too short"}
            }
        if len(text_to_summarize) > 10000:
            return {
                "content": "Input is too long. Please provide less than 10,000 characters.",
                "metadata": {"error": "Input too long"}
            }

        try:
            # Get parameters or use defaults
            max_length = parameters.get("max_length", 500) if parameters else 500
            format_type = parameters.get("format", "paragraph") if parameters else "paragraph"
            # model = parameters.get("model", self.llm_client.model) if parameters else self.llm_client.model

            # Adjust system prompt based on format
            format_instruction = f"\nAim for a summary length of approximately {max_length} characters."
            if format_type == "bullets":
                format_instruction += "\nFormat the summary as bullet points. Highlight key points using bold text."
            elif format_type == "outline":
                format_instruction += "\nFormat the summary as a hierarchical outline. Use indentation for subpoints."
            else:
                format_instruction += "\nFormat the summary as a concise paragraph."
            
            system_prompt = f"{self.system_prompt_base}{format_instruction}"

            # Generate summary using LLMClient
            response = await self.gemini_client.generate_response(
                prompt=text_to_summarize,
                system_prompt=system_prompt,
                temperature=0.3, 
                max_tokens=1000,
                model=model
            )
            
            logger.info("Summary generated via LLMClient.")

            metadata.update({
                "source_type": source_type,
                "original_length": len(text_to_summarize),
                "summary_length": len(response["content"]),
                "format": format_type,
                "model": response.get("model", model),
                "usage": response.get("usage")
            })
            
            # Remove None values from metadata
            metadata = {k: v for k, v in metadata.items() if v is not None}
            
            return {
                "content": response["content"],
                "metadata": metadata
            }
        except Exception as e:
            logger.error(f"Error during LLMClient summarization: {e}", exc_info=True)
            return {
                "content": f"I apologize, but I encountered an error while summarizing: {str(e)}",
                "metadata": {"error": str(e), **metadata}
            } 