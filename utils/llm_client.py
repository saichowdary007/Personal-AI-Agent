import os
import asyncio
from typing import Optional, Dict, Any
import httpx
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_random_exponential

load_dotenv()

class LLMClient:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.base_url = "https://openrouter.ai/api/v1"
        self.site_url = os.getenv("OPENROUTER_SITE_URL", "http://localhost:8000") # Replace with your site URL/app name
        self.app_name = os.getenv("OPENROUTER_APP_NAME", "LLM Assistant") # Replace with your app name

        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY not found in environment variables")
        
        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "HTTP-Referer": self.site_url, # Required for free models
                "X-Title": self.app_name,      # Optional, for identifying your app
            },
            timeout=httpx.Timeout(30.0)  # Optional: set request timeout
        )

    @retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(5))
    async def generate_response(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        model: str = "deepseek-coder"
    ) -> Dict[str, Any]:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        try:
            response = await self.client.post(
                "/chat/completions",
                json={
                    "model": model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                }
            )
            response.raise_for_status()
            data = response.json()
            return {
                "content": data["choices"][0]["message"]["content"],
                "usage": data.get("usage", {"total_tokens": 0}),
                "model": data["model"]
            }

        except Exception as e:
            print(f"OpenRouter error: {str(e)}")
            print("Falling back to local Ollama model...")

            try:
                async with httpx.AsyncClient() as local_client:
                    local_response = await local_client.post(
                        "http://localhost:11434/api/generate",
                        json={
                            "model": model,
                            "prompt": prompt,
                            "stream": False
                        }
                    )
                    local_response.raise_for_status()
                    result = local_response.json()
                    return {
                        "content": result.get("response", "No response"),
                        "usage": {},
                        "model": model + " (local)"
                    }
            except Exception as local_e:
                print(f"Local fallback error: {str(local_e)}")
                raise Exception("Both OpenRouter and local fallback failed.")

    async def summarize(self, text: str, max_length: int = 500) -> str:
        """
        Summarize text using the LLM via OpenRouter
        """
        system_prompt = f"Please summarize the following text concisely, aiming for approximately {max_length} characters:"
        response = await self.generate_response(text, system_prompt=system_prompt, temperature=0.3)
        return response["content"]

    async def translate(self, text: str, target_language: str) -> str:
        """
        Translate text to target language via OpenRouter
        """
        system_prompt = f"Translate the following text to {target_language}:"
        response = await self.generate_response(text, system_prompt=system_prompt, temperature=0.3)
        return response["content"]

    async def close(self):
        await self.client.aclose()

def run_async(func, *args, **kwargs):
    return asyncio.get_event_loop().run_until_complete(func(*args, **kwargs))

# Ensure client is closed properly (e.g., in FastAPI shutdown event)
# Example:
# @app.on_event("shutdown")
# async def shutdown_event():
#     await llm_client.close()
# ... existing code ...