import asyncio
from services.summarize import SummarizeService
from utils.gemini_client import GeminiClient

async def test_summarize():
    # Instantiate GeminiClient (ensure GOOGLE_GEMINI_API_KEY is set in your environment)
    gemini_client = GeminiClient()
    summarize_service = SummarizeService(gemini_client)

    # Test with valid content
    content = """Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of "intelligent agents": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals."""
    result = await summarize_service.process(content=content)
    print("Result:", result)

if __name__ == "__main__":
    asyncio.run(test_summarize())
