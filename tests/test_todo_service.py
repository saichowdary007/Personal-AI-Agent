import pytest
from services.todo_manager import TodoManager, Task
from datetime import datetime
import json
from pathlib import Path

@pytest.fixture
def todo_manager(tmp_path):
    """Create a TodoManager instance with a temporary storage file"""
    storage_file = tmp_path / "test_todos.json"
    return TodoManager(str(storage_file))

@pytest.mark.asyncio
async def test_add_task(todo_manager):
    """Test adding a task"""
    response = await todo_manager.process("add Buy groceries")
    assert "Added task" in response["content"]
    assert response["metadata"]["task_id"] == 1
    
    # Verify task was saved
    with open(todo_manager.storage_file, 'r') as f:
        data = json.load(f)
        assert "1" in data
        assert data["1"]["title"] == "Buy groceries"

@pytest.mark.asyncio
async def test_list_tasks(todo_manager):
    """Test listing tasks"""
    # Add some tasks
    await todo_manager.process("add Task 1")
    await todo_manager.process("add Task 2")
    
    # List tasks
    response = await todo_manager.process("list")
    assert "Task 1" in response["content"]
    assert "Task 2" in response["content"]
    assert response["metadata"]["task_count"] == 2

@pytest.mark.asyncio
async def test_complete_task(todo_manager):
    """Test completing a task"""
    # Add a task
    await todo_manager.process("add Test task")
    
    # Complete it
    response = await todo_manager.process("complete 1")
    assert "Marked task 1 as completed" in response["content"]
    
    # Verify it's marked as completed
    with open(todo_manager.storage_file, 'r') as f:
        data = json.load(f)
        assert data["1"]["completed"] is True

@pytest.mark.asyncio
async def test_delete_task(todo_manager):
    """Test deleting a task"""
    # Add a task
    await todo_manager.process("add Test task")
    
    # Delete it
    response = await todo_manager.process("delete 1")
    assert "Deleted task 1" in response["content"]
    
    # Verify it's gone
    with open(todo_manager.storage_file, 'r') as f:
        data = json.load(f)
        assert "1" not in data

@pytest.mark.asyncio
async def test_invalid_command(todo_manager):
    """Test handling of invalid commands"""
    response = await todo_manager.process("invalid command")
    assert "Unknown command" in response["content"]

@pytest.mark.asyncio
async def test_complete_nonexistent_task(todo_manager):
    """Test completing a task that doesn't exist"""
    response = await todo_manager.process("complete 999")
    assert "not found" in response["content"]

@pytest.mark.asyncio
async def test_task_persistence(todo_manager):
    """Test that tasks persist between TodoManager instances"""
    # Add a task
    await todo_manager.process("add Persistent task")
    
    # Create new instance with same storage file
    new_manager = TodoManager(str(todo_manager.storage_file))
    
    # Verify task exists in new instance
    response = await new_manager.process("list")
    assert "Persistent task" in response["content"] 