import pytest
from unittest.mock import AsyncMock, patch

from services.chat import ChatService
from utils.llm_client import LLMClient

# Use the mock LLM client from conftest.py
@pytest.fixture
def chat_service(mock_llm_client):
    return ChatService(llm_client=mock_llm_client)

@pytest.mark.asyncio
async def test_chat_process_success(chat_service, mock_llm_client):
    """Test successful chat processing"""
    prompt = "Hello, world!"
    expected_content = "Mocked response"
    mock_llm_client.generate_response.return_value = {
        "content": expected_content,
        "usage": {"total_tokens": 50},
        "model": "mock-model"
    }
    
    response = await chat_service.process(prompt)
    
    assert response["content"] == expected_content
    assert response["metadata"]["model"] == "mock-model"
    mock_llm_client.generate_response.assert_called_once_with(
        prompt=prompt,
        system_prompt=chat_service.system_prompt, # Verify system prompt is used
        temperature=0.7 # Verify default temp
    )

@pytest.mark.asyncio
async def test_chat_process_with_parameters(chat_service, mock_llm_client):
    """Test chat processing with custom parameters (temperature)"""
    prompt = "Another test"
    custom_temp = 0.9
    expected_content = "Different mocked response"
    mock_llm_client.generate_response.return_value = {
        "content": expected_content,
        "usage": {"total_tokens": 60},
        "model": "mock-model-2"
    }
    
    response = await chat_service.process(prompt, parameters={"temperature": custom_temp})
    
    assert response["content"] == expected_content
    mock_llm_client.generate_response.assert_called_once_with(
        prompt=prompt,
        system_prompt=chat_service.system_prompt,
        temperature=custom_temp # Verify custom temp is used
    )

@pytest.mark.asyncio
async def test_chat_process_llm_error(chat_service, mock_llm_client):
    """Test handling of an error during LLM call"""
    prompt = "Trigger error"
    error_message = "LLM failed"
    mock_llm_client.generate_response.side_effect = Exception(error_message)
    
    response = await chat_service.process(prompt)
    
    assert "I apologize, but I encountered an error" in response["content"]
    assert error_message in response["content"]
    assert response["metadata"]["error"] == error_message 