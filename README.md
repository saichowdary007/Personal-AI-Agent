# LLM Assistant

A powerful AI-powered personal assistant built with Python and FastAPI. This assistant helps users with various tasks using natural language processing.

## Features

- **Chat**: Natural conversation with AI using LLM
- **Summarization**: Summarize long texts and documents
- **Email Drafting**: Generate professional emails from prompts
- **Todo Management**: Manage tasks and to-do lists
- **Code Assistance**: Explain, debug, and generate code
- **Translation**: Translate text between languages

## Setup

1. Clone the repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Run the application:
```bash
uvicorn main:app --reload
```

## Project Structure

```
llm_assistant/
├── main.py                # FastAPI app
├── services/             # Core service modules
├── utils/               # Utility functions
├── data/               # Data storage
├── requirements.txt    # Dependencies
└── README.md          # Documentation
```

## API Endpoints

- `POST /assist`: Main endpoint for all assistant features
- Supports multiple types: summarize, email, todo, code, translate, chat

## Configuration

Create a `.env` file with your API keys:
```
OPENAI_API_KEY=your_key_here
``` 