import os
import httpx

class GeminiClient:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_GEMINI_API_KEY")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        if not self.api_key:
            raise ValueError("GOOGLE_GEMINI_API_KEY not found in environment variables")
        self.client = httpx.AsyncClient(timeout=httpx.Timeout(10.0))
        import logging
        masked = self.api_key[:4] + "..." + self.api_key[-4:] if self.api_key and len(self.api_key) > 8 else "NOT SET"
        logging.info(f"[GeminiClient] Initialized with API key: {masked}")

    async def generate_response(self, prompt: str, system_prompt: str = None, temperature: float = 0.7, max_tokens: int = 1024) -> dict:
        # Gemini API expects a 'contents' array, with user and system messages
        combined_text = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
        contents = [{
            "role": "user",
            "parts": [{"text": combined_text}]
        }]
        
        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens
            }
        }
        url = f"{self.base_url}?key={self.api_key}"
        import logging
        masked = self.api_key[:4] + "..." + self.api_key[-4:] if self.api_key and len(self.api_key) > 8 else "NOT SET"
        logging.info(f"[GeminiClient] Sending prompt: {prompt}, system_prompt: {system_prompt}, API key: {masked}, payload: {payload}")
        try:
            resp = await self.client.post(url, json=payload)
            logging.info(f"[GeminiClient] Raw response status: {resp.status_code}, body: {resp.text}")
            resp.raise_for_status()
            data = resp.json()
            print("[GeminiClient] Full parsed response:", data)
            logging.info(f"[GeminiClient] Parsed response JSON: {data}")
            candidates = data.get("candidates", [])
            if not candidates or "content" not in candidates[0]:
                logging.warning("[GeminiClient] No valid candidates or content returned.")
                return {
                    "content": "[No content returned from Gemini]",
                    "model": "gemini-2.0-flash"
                }

            candidate = candidates[0]["content"]
            parts = candidate.get("parts", [])
            if parts and isinstance(parts[0], dict) and "text" in parts[0]:
                content_text = parts[0]["text"]
            else:
                content_text = candidate.get("text", "[No content returned from Gemini]")
            if not content_text.strip():
                logging.warning("[GeminiClient] Extracted content_text is empty.")
            logging.info(f"[GeminiClient] Parsed content: {content_text}")
            return {
                "content": content_text if content_text.strip() else "[No meaningful content returned]",
                "model": "gemini-2.0-flash"
            }
        except Exception as e:
            import traceback
            logging.error(f"GeminiClient error: {e}\n{traceback.format_exc()}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    err_data = e.response.json()
                except Exception:
                    err_data = e.response.text
                logging.error(f"GeminiClient error: {e} | Response: {err_data}")
                raise Exception(f"GeminiClient error: {e} | Response: {err_data}") from e
            raise

    async def close(self):
        await self.client.aclose()
