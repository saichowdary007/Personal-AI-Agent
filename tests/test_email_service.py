import pytest
from unittest.mock import AsyncMock, patch

from services.email_drafter import EmailDraftService
from utils.llm_client import LLMClient

# Use the mock LLM client from conftest.py
@pytest.fixture
def email_service(mock_llm_client):
    return EmailDraftService(llm_client=mock_llm_client)

@pytest.mark.asyncio
async def test_email_draft_success_default(email_service, mock_llm_client):
    """Test successful email drafting with default parameters"""
    prompt = "Ask for a meeting next week"
    expected_email = "Subject: Meeting Request\n\nDear Team,..."
    mock_llm_client.generate_response.return_value = {
        "content": expected_email,
        "usage": {"total_tokens": 150},
        "model": "mock-email-model"
    }
    
    response = await email_service.process(prompt)
    
    assert response["content"] == expected_email
    assert response["metadata"]["tone"] == "professional"
    assert response["metadata"]["format"] == "full"
    mock_llm_client.generate_response.assert_called_once_with(
        prompt=prompt,
        system_prompt=f"{email_service.system_prompt}\nUse a professional tone.",
        temperature=0.7
    )

@pytest.mark.asyncio
async def test_email_draft_custom_params(email_service, mock_llm_client):
    """Test email drafting with custom tone and format"""
    prompt = "Quick thank you note"
    tone = "casual"
    format_type = "reply"
    expected_email = "Hey,\n\nJust wanted to say thanks!..."
    mock_llm_client.generate_response.return_value = {
        "content": expected_email,
        "usage": {"total_tokens": 80},
        "model": "mock-email-model"
    }
    
    response = await email_service.process(prompt, parameters={"tone": tone, "format": format_type})
    
    assert response["content"] == expected_email
    assert response["metadata"]["tone"] == tone
    assert response["metadata"]["format"] == format_type
    mock_llm_client.generate_response.assert_called_once_with(
        prompt=prompt,
        system_prompt=f"{email_service.system_prompt}\nUse a {tone} tone.\nFormat this as a reply to a previous email.",
        temperature=0.7
    )

@pytest.mark.asyncio
async def test_email_draft_llm_error(email_service, mock_llm_client):
    """Test handling of LLM error during email drafting"""
    prompt = "Error prompt"
    error_message = "Email LLM failed"
    mock_llm_client.generate_response.side_effect = Exception(error_message)
    
    response = await email_service.process(prompt)
    
    assert "I apologize, but I encountered an error" in response["content"]
    assert error_message in response["content"]
    assert response["metadata"]["error"] == error_message 