import logging
import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional

class CustomJSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }
        
        # Add extra fields if available
        if hasattr(record, "extra"):
            log_data.update(record.extra)
        
        # Add exception info if available
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_data)

def setup_logger(
    name: str,
    level: int = logging.INFO,
    log_file: Optional[str] = None,
    console: bool = True
) -> logging.Logger:
    """
    Setup a logger with JSON formatting and optional file output
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Create JSON formatter
    json_formatter = CustomJSONFormatter()
    
    # Add console handler if requested
    if console:
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(json_formatter)
        logger.addHandler(console_handler)
    
    # Add file handler if log file specified
    if log_file:
        # Create log directory if it doesn't exist
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(json_formatter)
        logger.addHandler(file_handler)
    
    return logger

# Create default logger
logger = setup_logger(
    "llm_assistant",
    log_file="logs/app.log"
)

def log_request(
    service: str,
    action: str,
    content: str,
    parameters: Optional[Dict[str, Any]] = None
) -> None:
    """Log an incoming request"""
    logger.info(
        "Request received",
        extra={
            "service": service,
            "action": action,
            "content_length": len(content),
            "parameters": parameters
        }
    )

def log_response(
    service: str,
    action: str,
    status: str,
    metadata: Optional[Dict[str, Any]] = None
) -> None:
    """Log a service response"""
    logger.info(
        "Response sent",
        extra={
            "service": service,
            "action": action,
            "status": status,
            "metadata": metadata
        }
    )

def log_error(
    service: str,
    action: str,
    error: Exception,
    context: Optional[Dict[str, Any]] = None
) -> None:
    """Log an error"""
    logger.error(
        f"Error in {service}",
        extra={
            "service": service,
            "action": action,
            "error_type": type(error).__name__,
            "error_message": str(error),
            "context": context
        },
        exc_info=True
    ) 