import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock
import os
import json
from pathlib import Path

from main import app
from utils.llm_client import LLMClient
from utils.file_handler import FileHandler

@pytest.fixture
def test_client():
    return TestClient(app)

@pytest.fixture
def mock_llm_client():
    client = Mock(spec=LLMClient)
    # Setup common mock responses
    async def mock_generate_response(*args, **kwargs):
        return {
            "content": "Mocked response",
            "usage": {"total_tokens": 100},
            "model": "gpt-3.5-turbo"
        }
    client.generate_response.side_effect = mock_generate_response
    return client

@pytest.fixture
def test_file_handler():
    # Use a temporary test directory
    test_data_dir = Path("tests/test_data")
    test_data_dir.mkdir(exist_ok=True)
    handler = FileHandler(str(test_data_dir))
    yield handler
    # Cleanup after tests
    for file in test_data_dir.glob("*"):
        file.unlink()
    test_data_dir.rmdir() 