from google import genai
from app.core.config import settings


class GeminiClient:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("Gemini API key is required")

        self.client = genai.Client(api_key=api_key)
        self.model_name = settings.GEMINI_MODEL

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        prompt = f"""
{system_prompt}

User Input:
{user_prompt}
"""
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )

        if not response or not response.text:
            raise RuntimeError("Empty response from Gemini")

        return response.text.strip()
