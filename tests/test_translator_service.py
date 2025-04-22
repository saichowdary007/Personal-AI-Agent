import pytest
from unittest.mock import AsyncMock, patch

from services.translator import TranslatorService
from utils.llm_client import LLMClient

# Use the mock LLM client from conftest.py
@pytest.fixture
def translator_service(mock_llm_client):
    return TranslatorService(llm_client=mock_llm_client)

@pytest.mark.asyncio
async def test_translate_success(translator_service, mock_llm_client):
    """Test successful translation"""
    text = "Hello"
    target_language = "Spanish"
    expected_translation = "Hola"
    mock_llm_client.generate_response.return_value = {
        "content": expected_translation,
        "usage": {"total_tokens": 10},
        "model": "mock-translate-model"
    }
    
    response = await translator_service.process(text, parameters={"target_language": target_language})
    
    assert response["content"] == expected_translation
    assert response["metadata"]["target_language"] == target_language
    mock_llm_client.generate_response.assert_called_once_with(
        prompt=text,
        system_prompt=f"{translator_service.system_prompt}\nMaintain the original text's formatting, including line breaks and special characters.\nTranslate to {target_language}.",
        temperature=0.3
    )

@pytest.mark.asyncio
async def test_translate_missing_target_language(translator_service):
    """Test translation request without specifying target language"""
    text = "Hello"
    response = await translator_service.process(text)
    assert "Please specify a target language" in response["content"]
    assert response["metadata"]["error"] == "Missing target language"

@pytest.mark.asyncio
async def test_translate_llm_error(translator_service, mock_llm_client):
    """Test handling of an error during LLM call for translation"""
    text = "Bonjour"
    target_language = "English"
    error_message = "Translation LLM failed"
    mock_llm_client.generate_response.side_effect = Exception(error_message)
    
    response = await translator_service.process(text, parameters={"target_language": target_language})
    
    assert "I apologize, but I encountered an error" in response["content"]
    assert error_message in response["content"]
    assert response["metadata"]["error"] == error_message

# Test the static language detection method (basic)
def test_detect_language():
    assert TranslatorService.detect_language("This is the house") == "English"
    assert TranslatorService.detect_language("Ceci est le texte") == "French"
    assert TranslatorService.detect_language("Este es el texto") == "Spanish"
    assert TranslatorService.detect_language("Das ist der Text") == "German"
    assert TranslatorService.detect_language("Questo e il testo") == "Italian"
    assert TranslatorService.detect_language("こんにちは") == "Unknown" 