import os
import httpx
import logging

# Minimal Gemini API key test script
GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

logging.basicConfig(level=logging.INFO)

if not GEMINI_API_KEY:
    print("GOOGLE_GEMINI_API_KEY not set in environment.")
    exit(1)

url = f"{BASE_URL}?key={GEMINI_API_KEY}"
payload = {
    "contents": [{"role": "user", "parts": [{"text": "Say hello!"}]}],
    "generationConfig": {"temperature": 0.2, "maxOutputTokens": 20}
}

try:
    resp = httpx.post(url, json=payload, timeout=10)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")
    resp.raise_for_status()
    data = resp.json()
    candidate = data["candidates"][0]["content"]
    content_text = candidate["parts"][0]["text"] if "parts" in candidate else candidate.get("text", "")
    print(f"Gemini API test succeeded! Content: {content_text}")
except Exception as e:
    print(f"Gemini API test failed: {e}")
