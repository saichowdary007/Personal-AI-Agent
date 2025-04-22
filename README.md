# LLM Assistant

![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-async-green?logo=fastapi)
![Google Gemini](https://img.shields.io/badge/Gemini-API-yellow?logo=google)

A modern, full-stack AI-powered personal assistant built with **FastAPI** (Python backend) and **Next.js** (React frontend). This assistant leverages Google Gemini for natural language processing and provides productivity tools in a beautiful web UI.

---

## ✨ Features
- **Conversational Chat**: Natural, context-aware chat with AI
- **Summarization**: Summarize long texts and documents
- **Email Drafting**: Generate professional emails from prompts
- **Todo Management**: Manage tasks and to-do lists
- **Code Assistance**: Explain, debug, and generate code
- **Translation**: Translate text between languages

## 🛠️ Tech Stack
- **Backend**: Python, FastAPI, Google Gemini API
- **Frontend**: Next.js (React), modern CSS

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Backend Setup
Install dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file with your Google Gemini API key:
```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

Run the backend:
```bash
uvicorn main:app --reload
```

### 3. Frontend Setup
If you have a Next.js frontend, install dependencies and run:
```bash
npm install
npm run dev
```

## 🔑 Environment Variables
- `GOOGLE_GEMINI_API_KEY` – Your Google Gemini API key (required for backend)

## 📚 Usage
1. Open the frontend in your browser (usually [http://localhost:3000](http://localhost:3000)).
2. Sign in with your credentials.
3. Use the sidebar to access Chat, Summarize, Email, Todo, Code, or Translate features.

## 🧩 API Endpoints
- `POST /assist`: Main endpoint for all assistant features. Supports types: `summarize`, `email`, `todo`, `code`, `translate`, `chat`.
- `POST /token`: Obtain an authentication token.
- `GET /health`: Health check endpoint.

## 📁 Project Structure
```
llm_assistant/
├── main.py               # FastAPI app
├── services/             # Core service modules
├── components/           # React components (frontend)
├── pages/                # Next.js pages (frontend)
├── utils/                # Utility modules
├── data/                 # Data storage
├── requirements.txt      # Python dependencies
├── package.json          # Frontend dependencies
├── .env                  # Environment variables
└── README.md             # Documentation
```

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
MIT

---
**Built with ❤️ using FastAPI, Next.js, and Google Gemini.**

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