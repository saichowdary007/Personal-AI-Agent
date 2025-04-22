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
    def __init__(self, base_dir: str = "data/todos"):
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def _get_user_file(self, username: str) -> Path:
        return self.base_dir / f"{username}.json"

    def _load_tasks(self, username: str) -> Dict[int, Task]:
        """Load tasks for a user from their storage file"""
        user_file = self._get_user_file(username)
        if not user_file.exists():
            return {}
        with open(user_file, 'r') as f:
            data = json.load(f)
            return {int(task_id): Task.from_dict(task_data) for task_id, task_data in data.items()}

    def _save_tasks(self, username: str, tasks: Dict[int, Task]) -> None:
        """Save a user's tasks to storage file"""
        user_file = self._get_user_file(username)
        with open(user_file, 'w') as f:
            data = {str(task_id): task.to_dict() for task_id, task in tasks.items()}
            json.dump(data, f, indent=2)

    def _save_tasks(self) -> None:
        """Save tasks to storage file"""
        with open(self.storage_file, 'w') as f:
            data = {
                str(task_id): task.to_dict()
                for task_id, task in self.tasks.items()
            }
            json.dump(data, f, indent=2)

    async def process(self, username: str, content: str, parameters: Optional[dict] = None) -> dict:
        """Process todo-related commands for a user"""
        command = content.lower().strip()
        if command.startswith("add"):
            title = content[3:].strip()
            return await self.add_task(username, title)
        elif command.startswith("list"):
            return await self.list_tasks(username)
        elif command.startswith("complete"):
            try:
                task_id = int(command.split()[1])
                return await self.complete_task(username, task_id)
            except (IndexError, ValueError):
                return {"content": "Please specify a valid task ID to complete"}
        elif command.startswith("delete"):
            try:
                task_id = int(command.split()[1])
                return await self.delete_task(username, task_id)
            except (IndexError, ValueError):
                return {"content": "Please specify a valid task ID to delete"}
        else:
            return {"content": "Unknown command. Available commands: add, list, complete, delete"}

    async def add_task(self, username: str, title: str) -> dict:
        """Add a new task for a user"""
        tasks = self._load_tasks(username)
        task = Task(title=title)
        task.id = max(tasks.keys(), default=0) + 1
        tasks[task.id] = task
        self._save_tasks(username, tasks)
        return {
            "content": f"Added task {task.id}: {task.title}",
            "metadata": {"task_id": task.id}
        }

    async def list_tasks(self, username: str) -> dict:
        """List all tasks for a user"""
        tasks = self._load_tasks(username)
        if not tasks:
            return {"content": "No tasks found"}
        task_list = []
        for task in tasks.values():
            status = "✓" if task.completed else "○"
            task_list.append(f"{status} {task.id}. {task.title}")
        return {
            "content": "\n".join(task_list),
            "metadata": {"task_count": len(tasks)}
        }

    async def complete_task(self, username: str, task_id: int) -> dict:
        """Mark a user's task as completed"""
        tasks = self._load_tasks(username)
        if task_id not in tasks:
            return {"content": f"Task {task_id} not found"}
        tasks[task_id].completed = True
        self._save_tasks(username, tasks)
        return {"content": f"Marked task {task_id} as completed"}

    async def delete_task(self, username: str, task_id: int) -> dict:
        """Delete a user's task"""
        tasks = self._load_tasks(username)
        if task_id not in tasks:
            return {"content": f"Task {task_id} not found"}
        del tasks[task_id]
        self._save_tasks(username, tasks)
        return {"content": f"Deleted task {task_id}"}