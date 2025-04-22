from typing import List, Optional, Dict
from datetime import datetime
import json
from pathlib import Path

class Task:
    def __init__(
        self,
        title: str,
        description: Optional[str] = None,
        due_date: Optional[datetime] = None,
        completed: bool = False
    ):
        self.id = None  # Will be set when added to TodoManager
        self.title = title
        self.description = description
        self.created_at = datetime.now()
        self.due_date = due_date
        self.completed = completed

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "created_at": self.created_at.isoformat(),
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "completed": self.completed
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Task':
        task = cls(
            title=data["title"],
            description=data.get("description"),
            due_date=datetime.fromisoformat(data["due_date"]) if data.get("due_date") else None,
            completed=data.get("completed", False)
        )
        task.id = data["id"]
        task.created_at = datetime.fromisoformat(data["created_at"])
        return task

class TodoManager:
    def __init__(self, storage_file: str = "data/todos.json"):
        self.storage_file = Path(storage_file)
        self.storage_file.parent.mkdir(exist_ok=True)
        self.tasks: Dict[int, Task] = {}
        self._load_tasks()

    def _load_tasks(self) -> None:
        """Load tasks from storage file"""
        try:
            with open(self.storage_file, 'r') as f:
                data = json.load(f)
                self.tasks = {
                    int(task_id): Task.from_dict(task_data)
                    for task_id, task_data in data.items()
                }
        except FileNotFoundError:
            self.tasks = {}

    def _save_tasks(self) -> None:
        """Save tasks to storage file"""
        with open(self.storage_file, 'w') as f:
            data = {
                str(task_id): task.to_dict()
                for task_id, task in self.tasks.items()
            }
            json.dump(data, f, indent=2)

    async def process(self, content: str, parameters: Optional[dict] = None) -> dict:
        """Process todo-related commands"""
        command = content.lower().strip()
        
        if command.startswith("add"):
            title = content[3:].strip()
            return await self.add_task(title)
        elif command.startswith("list"):
            return await self.list_tasks()
        elif command.startswith("complete"):
            try:
                task_id = int(command.split()[1])
                return await self.complete_task(task_id)
            except (IndexError, ValueError):
                return {"content": "Please specify a valid task ID to complete"}
        elif command.startswith("delete"):
            try:
                task_id = int(command.split()[1])
                return await self.delete_task(task_id)
            except (IndexError, ValueError):
                return {"content": "Please specify a valid task ID to delete"}
        else:
            return {"content": "Unknown command. Available commands: add, list, complete, delete"}

    async def add_task(self, title: str) -> dict:
        """Add a new task"""
        task = Task(title=title)
        task.id = max(self.tasks.keys(), default=0) + 1
        self.tasks[task.id] = task
        self._save_tasks()
        return {
            "content": f"Added task {task.id}: {task.title}",
            "metadata": {"task_id": task.id}
        }

    async def list_tasks(self) -> dict:
        """List all tasks"""
        if not self.tasks:
            return {"content": "No tasks found"}
        
        task_list = []
        for task in self.tasks.values():
            status = "✓" if task.completed else "○"
            task_list.append(f"{status} {task.id}. {task.title}")
        
        return {
            "content": "\n".join(task_list),
            "metadata": {"task_count": len(self.tasks)}
        }

    async def complete_task(self, task_id: int) -> dict:
        """Mark a task as completed"""
        if task_id not in self.tasks:
            return {"content": f"Task {task_id} not found"}
        
        self.tasks[task_id].completed = True
        self._save_tasks()
        return {"content": f"Marked task {task_id} as completed"}

    async def delete_task(self, task_id: int) -> dict:
        """Delete a task"""
        if task_id not in self.tasks:
            return {"content": f"Task {task_id} not found"}
        
        del self.tasks[task_id]
        self._save_tasks()
        return {"content": f"Deleted task {task_id}"} 