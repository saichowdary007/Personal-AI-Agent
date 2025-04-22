import typer
import asyncio
from typing import Optional, List
import json
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
import sys

# Import services (adjust paths if needed)
from services.chat import ChatService
from services.summarize import SummarizeService
from services.email_drafter import EmailDraftService
from services.todo_manager import TodoManager
from services.translator import TranslatorService
from services.code_helper import CodeHelperService

# Import utilities
from utils.llm_client import LLMClient
from utils.file_handler import FileHandler
from utils.logger import logger # Use the same logger

# Initialize services (similar to main.py, but without FastAPI context)
# Note: Ensure env variables (OPENROUTER_API_KEY, etc.) are loaded
llm_client = LLMClient() 
file_handler = FileHandler()

# Pass LLMClient back to ChatService
chat_service = ChatService(llm_client) 
# Inject LLMClient into SummarizeService
summarize_service = SummarizeService(llm_client, file_handler)
email_service = EmailDraftService(llm_client)
todo_service = TodoManager()
translator_service = TranslatorService(llm_client)
code_service = CodeHelperService(llm_client)

# Initialize Rich Console for better output
console = Console()

app = typer.Typer(help="LLM Assistant CLI - Interact with AI services.")

async def run_service(service, content, parameters, is_chat: bool = False):
    service_name = service.__class__.__name__
    logger.info(f"CLI Request - Service: {service_name}, Params: {parameters}")
    response = None
    try:
        if not is_chat:
            with console.status("[bold green]Processing request...[/]"): 
                response = await service.process(content, parameters)
        else:
             # For chat, show prompt immediately, then response
             response = await service.process(content, parameters)

        if response:
            console.print(Panel(Markdown(response.get("content", "*No content returned.*")),
                            title="[bold blue]Assistant Response[/]", 
                            border_style="blue"))
            
            metadata = response.get("metadata", {})
            if metadata:
                 # Don't print metadata if it just contains an error already shown
                if not (len(metadata) == 1 and 'error' in metadata):
                    console.print(Panel(json.dumps(metadata, indent=2), 
                                        title="[bold yellow]Metadata[/]", 
                                        border_style="yellow"))
        else:
             console.print("[bold red]No response received.[/]")

    except Exception as e:
        logger.error(f"CLI Error in {service_name}: {e}", exc_info=True)
        console.print(Panel(f"An error occurred: {e}", 
                            title="[bold red]Error[/]", 
                            border_style="red"))
    # Note: LLM client closing handled globally now for interactive chat

async def chat_interactive():
    """Run interactive chat session."""
    console.print("[bold green]Starting interactive chat session... (Type 'quit' or 'exit' to end)[/]")
    while True:
        try:
            prompt = console.input("[cyan]You:[/cyan] ")
            if prompt.lower() in ["quit", "exit"]:
                break
            if not prompt:
                continue
            
            with console.status("[bold green]Thinking...[/]"): 
                await run_service(chat_service, prompt, {}, is_chat=True)

        except KeyboardInterrupt:
            break # Allow Ctrl+C to exit
        except Exception as e:
            logger.error(f"Interactive chat error: {e}", exc_info=True)
            console.print(f"[bold red]An error occurred:[/bold red] {e}")
    console.print("[bold green]Exiting chat session.[/]")

@app.command()
def chat(
    prompt: Optional[str] = typer.Argument(None, help="Your message to the chat assistant. If omitted, starts interactive mode."),
    interactive: bool = typer.Option(False, "--interactive", "-i", help="Start an interactive chat session.")
):
    """Engage in a conversation with the AI chat assistant. Can be interactive."""
    if interactive or not prompt:
        asyncio.run(chat_interactive())
    else:
        asyncio.run(run_service(chat_service, prompt, {}, is_chat=True))

@app.command()
def summarize(
    text: Optional[str] = typer.Option(None, "--text", "-t", help="Direct text to summarize."),
    filename: Optional[str] = typer.Option(None, "--file", "-f", help="Filename (in data dir) to summarize (txt or pdf)."),
    max_length: int = typer.Option(500, help="Approximate max length for summary."),
    format_type: str = typer.Option("paragraph", help="Summary format (paragraph, bullets, outline).")
):
    """Summarize text content from input or a file."""
    if not text and not filename:
        console.print("[bold red]Error:[/bold red] Please provide either --text or --file.")
        raise typer.Exit(code=1)
    if text and filename:
        console.print("[bold red]Error:[/bold red] Please provide either --text or --file, not both.")
        raise typer.Exit(code=1)
        
    params = {"max_length": max_length, "format": format_type}
    if filename:
        params["filename"] = filename
        
    asyncio.run(run_service(summarize_service, text, params))

@app.command()
def todo(action: str = typer.Argument(..., help="Action: add, list, complete, delete"),
         value: Optional[str] = typer.Argument(None, help="Task title for 'add', Task ID for 'complete'/'delete'")):
    """Manage your To-Do list."""
    if action not in ["add", "list", "complete", "delete"]:
        print(f"Error: Invalid action '{action}'. Choose from add, list, complete, delete.")
        raise typer.Exit(code=1)
    if action != "list" and not value:
         print(f"Error: Value required for action '{action}'.")
         raise typer.Exit(code=1)
         
    command = f"{action} {value if value else ''}".strip()
    asyncio.run(run_service(todo_service, command, {}))

@app.command()
def translate(
    text: str = typer.Argument(..., help="Text to translate."),
    target_language: str = typer.Option(..., "--to", "-t", help="Target language (e.g., Spanish, French).")
):
    """Translate text to another language."""
    params = {"target_language": target_language}
    asyncio.run(run_service(translator_service, text, params))

@app.command()
def code(
    snippet: str = typer.Argument(..., help="Code snippet to process."),
    action: str = typer.Option("explain", help="Action: explain, debug, improve, document, convert"),
    language: str = typer.Option("python", help="Programming language of the snippet."),
    target_language: Optional[str] = typer.Option(None, help="Target language for 'convert' action.")
):
    """Get help with code: explain, debug, improve, document, convert."""
    params = {"action": action, "language": language}
    if action == "convert":
        if not target_language:
            print("Error: --target-language is required for convert action.")
            raise typer.Exit(code=1)
        params["target_language"] = target_language
    asyncio.run(run_service(code_service, snippet, params))


@app.command()
def email(
    prompt: str = typer.Argument(..., help="Prompt describing the email needed."),
    tone: str = typer.Option("professional", help="Email tone (e.g., professional, casual, formal)."),
    format_type: str = typer.Option("full", help="Email format (e.g., full, reply, forward).")
):
    """Draft an email based on a prompt."""
    params = {"tone": tone, "format": format_type}
    asyncio.run(run_service(email_service, prompt, params))


if __name__ == "__main__":
    app() 