# New file for memory storage using SQLite
import sqlite3
from pathlib import Path
from typing import List, Dict, Any

# Define the path for the SQLite database in the data directory
db_path = Path(__file__).parent.parent / 'data' / 'memory.db'

# Ensure data directory exists
(db_path.parent).mkdir(parents=True, exist_ok=True)

# Initialize the database and create tables
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    service TEXT NOT NULL,
    sender TEXT NOT NULL,
    content TEXT,
    timestamp TEXT NOT NULL
)
''')
conn.commit()


def save_message(username: str, service: str, sender: str, content: str, timestamp: str) -> None:
    """
    Save a message to the memory store.
    """
    with sqlite3.connect(db_path) as conn_local:
        cursor_local = conn_local.cursor()
        cursor_local.execute(
            'INSERT INTO messages (username, service, sender, content, timestamp) VALUES (?, ?, ?, ?, ?)',
            (username, service, sender, content, timestamp)
        )
        conn_local.commit()


def get_conversation(username: str, service: str, limit: int = 20) -> List[Dict[str, Any]]:
    """
    Retrieve the most recent messages for a user and service.
    Returns a list of messages sorted by timestamp ascending.
    """
    with sqlite3.connect(db_path) as conn_local:
        cursor_local = conn_local.cursor()
        cursor_local.execute(
            'SELECT sender, content, timestamp FROM messages WHERE username = ? AND service = ? ORDER BY id DESC LIMIT ?',
            (username, service, limit)
        )
        rows = cursor_local.fetchall()
    # Reverse to get ascending order
    rows.reverse()
    return [{'sender': r[0], 'content': r[1], 'timestamp': r[2]} for r in rows] 