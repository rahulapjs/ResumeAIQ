import google.generativeai as genai
from app.core.config import settings


class GeminiClient:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("Gemini API key is required")

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        prompt = f"""
{system_prompt}

User Input:
{user_prompt}
"""
        response = self.model.generate_content(prompt)

        if not response or not response.text:
            raise RuntimeError("Empty response from Gemini")

        return response.text.strip()
