import os
from pathlib import Path
from typing import Optional, BinaryIO
import json
from datetime import datetime
import fitz # PyMuPDF

class FileHandler:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)

    async def save_json(self, data: dict, filename: str) -> None:
        """
        Save data to a JSON file
        """
        filepath = self.data_dir / filename
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, default=str)

    async def load_json(self, filename: str) -> dict:
        """
        Load data from a JSON file
        """
        filepath = self.data_dir / filename
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}

    async def save_file(self, file: BinaryIO, filename: str) -> str:
        """
        Save an uploaded file
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"{timestamp}_{filename}"
        filepath = self.data_dir / safe_filename
        
        # Read the file content once
        content = await file.read()
        
        with open(filepath, 'wb') as f:
            f.write(content)
        
        return str(filepath)

    async def read_file(self, filename: str) -> Optional[str]:
        """
        Read contents of a text file
        """
        filepath = self.data_dir / filename
        if not filepath.is_file():
             return None
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            return None
        except Exception as e:
            # Log error
            print(f"Error reading file {filename}: {e}")
            return None

    async def read_pdf(self, filename: str) -> Optional[str]:
        """
        Read text content from a PDF file
        """
        filepath = self.data_dir / filename
        if not filepath.is_file() or filepath.suffix.lower() != '.pdf':
            return None
        try:
            doc = fitz.open(filepath)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
        except FileNotFoundError:
            return None
        except Exception as e:
            # Log error
            print(f"Error reading PDF {filename}: {e}") # Replace with proper logging
            return None

    async def delete_file(self, filename: str) -> bool:
        """
        Delete a file
        """
        filepath = self.data_dir / filename
        try:
            if filepath.is_file():
                os.remove(filepath)
                return True
            return False
        except FileNotFoundError:
            return False
        except Exception as e:
            # Log error
            print(f"Error deleting file {filename}: {e}")
            return False 