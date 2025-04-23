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
        completed: bool = False,
        tags: Optional[list] = None,
        priority: Optional[str] = None
    ):
        self.id = None  # Will be set when added to TodoManager
        self.title = title
        self.description = description
        self.created_at = datetime.now()
        self.due_date = due_date
        self.completed = completed
        self.tags = tags or []
        self.priority = priority
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "created_at": self.created_at.isoformat(),
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "completed": self.completed,
            "tags": self.tags,
            "priority": self.priority
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Task':
        task = cls(
            title=data["title"],
            description=data.get("description"),
            due_date=datetime.fromisoformat(data["due_date"]) if data.get("due_date") else None,
            completed=data.get("completed", False),
            tags=data.get("tags", []),
            priority=data.get("priority")
        )
        task.id = data["id"]
        task.created_at = datetime.fromisoformat(data["created_at"])
        return task

    # Utility methods for smart parsing
    def _parse_tags(self, text: str) -> list:
        # Extract hashtags as tags
        return [part[1:] for part in text.split() if part.startswith('#')]

    def _parse_priority(self, text: str) -> Optional[str]:
        # Simple priority parsing (e.g., !high, !medium, !low)
        for word in text.split():
            if word.lower() in ['!high', '!medium', '!low']:
                return word[1:].lower()
        return None

    def _parse_due_date(self, text: str) -> Optional[datetime]:
        # Very basic due date parsing (e.g., 'tomorrow', 'today')
        from datetime import timedelta
        lower = text.lower()
        if 'tomorrow' in lower:
            return datetime.now() + timedelta(days=1)
        if 'today' in lower:
            return datetime.now()
        return None

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

    async def add_task(self, username: str, title: str, description: Optional[str] = None, due_date: Optional[datetime] = None, tags: Optional[list] = None, priority: Optional[str] = None) -> dict:
        import logging
        logger = logging.getLogger("TodoManager")
        tasks = self._load_tasks(username)
        # Input validation
        if not title or not title.strip():
            return {"success": False, "error": "Task title cannot be empty."}
        if any(task.title.strip().lower() == title.strip().lower() for task in tasks.values()):
            return {"success": False, "error": "Duplicate task title."}
        # Smart parsing for tags and priority
        tags = tags or Task._parse_tags(title)
        priority = priority or Task._parse_priority(title)
        due_date = due_date or Task._parse_due_date(title)
        # Assign next available ID
        next_id = max(tasks.keys(), default=0) + 1
        task = Task(title=title, description=description, due_date=due_date, tags=tags, priority=priority)
        task.id = next_id
        tasks[next_id] = task
        self._save_tasks(username, tasks)
        logger.info(f"Added task: {title} for user {username}")
        return {"success": True, "task": task.to_dict()}

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

    def get_tasks(self, username: str) -> List[dict]:
        tasks = self._load_tasks(username)
        now = datetime.now()
        result = []
        for task in tasks.values():
            meta = task.to_dict()
            # Add status: overdue, due_soon, completed
            if task.completed:
                meta["status"] = "completed"
            elif task.due_date:
                if task.due_date < now:
                    meta["status"] = "overdue"
                elif (task.due_date - now).days < 2:
                    meta["status"] = "due_soon"
                else:
                    meta["status"] = "pending"
            else:
                meta["status"] = "pending"
            result.append(meta)
        return result

    async def complete_task(self, username: str, task_id: int) -> dict:
        tasks = self._load_tasks(username)
        if task_id not in tasks:
            return {"content": f"Task {task_id} not found"}
        tasks[task_id].completed = True
        self._save_tasks(username, tasks)
        return {"content": f"Marked task {task_id} as completed"}

    async def delete_task(self, username: str, task_id: int) -> dict:
        import logging
        logger = logging.getLogger("TodoManager")
        tasks = self._load_tasks(username)
        if task_id not in tasks:
            return {"success": False, "error": "Task not found."}
        del tasks[task_id]
        self._save_tasks(username, tasks)
        logger.info(f"Deleted task {task_id} for user {username}")
        return {"success": True}