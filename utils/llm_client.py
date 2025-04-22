import os
import asyncio
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