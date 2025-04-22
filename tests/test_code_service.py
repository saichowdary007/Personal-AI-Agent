import pytest
from unittest.mock import AsyncMock, patch

from services.code_helper import CodeHelperService
from utils.llm_client import LLMClient

# Use the mock LLM client from conftest.py
@pytest.fixture
def code_service(mock_llm_client):
    return CodeHelperService(llm_client=mock_llm_client)

@pytest.mark.asyncio
async def test_code_explain_success(code_service, mock_llm_client):
    """Test successful code explanation"""
    snippet = "def hello():\n  print('world')"
    language = "python"
    expected_explanation = "This function prints 'world'..."
    mock_llm_client.generate_response.return_value = {
        "content": expected_explanation,
        "usage": {"total_tokens": 75},
        "model": "mock-code-model"
    }
    
    response = await code_service.process(snippet, parameters={"language": language, "action": "explain"})
    
    assert response["content"] == expected_explanation
    assert response["metadata"]["action"] == "explain"
    assert response["metadata"]["language"] == language
    mock_llm_client.generate_response.assert_called_once_with(
        prompt=snippet,
        system_prompt=f"{code_service.system_prompt}\nLanguage: {language}",
        temperature=0.3
    )

@pytest.mark.asyncio
async def test_code_debug_action(code_service, mock_llm_client):
    """Test code debugging action"""
    snippet = "x = 1 / 0"
    language = "python"
    action = "debug"
    expected_debug = "This code will raise a ZeroDivisionError..."
    mock_llm_client.generate_response.return_value = {"content": expected_debug, "model": "m", "usage": {}}

    response = await code_service.process(snippet, parameters={"language": language, "action": action})
    
    assert response["content"] == expected_debug
    assert response["metadata"]["action"] == action
    mock_llm_client.generate_response.assert_called_once_with(
        prompt=snippet,
        system_prompt=f"{code_service.system_prompt}\nAnalyze this code for bugs and provide fixes.\nLanguage: {language}",
        temperature=0.3
    )

@pytest.mark.asyncio
async def test_code_convert_action(code_service, mock_llm_client):
    """Test code conversion action"""
    snippet = "console.log('hi')"
    language = "javascript"
    target_language = "python"
    action = "convert"
    expected_conversion = "print('hi')"
    mock_llm_client.generate_response.return_value = {"content": expected_conversion, "model": "m", "usage": {}}

    response = await code_service.process(snippet, parameters={
        "language": language, 
        "action": action, 
        "target_language": target_language
    })
    
    assert response["content"] == expected_conversion
    assert response["metadata"]["action"] == action
    mock_llm_client.generate_response.assert_called_once_with(
        prompt=snippet,
        system_prompt=f"{code_service.system_prompt}\nConvert this code from {language} to {target_language}.\nLanguage: {language}",
        temperature=0.3
    )

@pytest.mark.asyncio
async def test_code_llm_error(code_service, mock_llm_client):
    """Test handling of LLM error during code processing"""
    snippet = "some code"
    error_message = "Code LLM failed"
    mock_llm_client.generate_response.side_effect = Exception(error_message)
    
    response = await code_service.process(snippet)
    
    assert "I apologize, but I encountered an error" in response["content"]
    assert error_message in response["content"]
    assert response["metadata"]["error"] == error_message 