import os
import httpx

class GeminiClient:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_GEMINI_API_KEY")
        self.base_url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent"
        if not self.api_key:
            raise ValueError("GOOGLE_GEMINI_API_KEY not found in environment variables")
        self.client = httpx.AsyncClient(timeout=httpx.Timeout(10.0))

    async def generate_response(self, prompt: str, system_prompt: str = None, temperature: float = 0.7, max_tokens: int = 1024) -> dict:
        # Gemini API expects a 'contents' array, with user and system messages
        if system_prompt:
            prompt = f"{system_prompt}\n{prompt}"
        contents = [{"role": "user", "parts": [{"text": prompt}]}]
        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens
            }
        }
        url = f"{self.base_url}?key={self.api_key}"
        try:
            resp = await self.client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            # Gemini returns candidates[0].content.parts[0].text
            return {
                "content": data["candidates"][0]["content"]["parts"][0]["text"],
                "model": "gemini-pro"
            }
        except Exception as e:
            import traceback
            print(f"GeminiClient error: {e}\n{traceback.format_exc()}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    err_data = e.response.json()
                except Exception:
                    err_data = e.response.text
                raise Exception(f"GeminiClient error: {e} | Response: {err_data}") from e
            raise

    async def close(self):
        await self.client.aclose()
