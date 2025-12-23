from fastapi import APIRouter, Header, HTTPException
from app.core.gemini_client import GeminiClient

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/validate")
def validate_api_key(
    authorization: str = Header(..., description="Bearer <Gemini API Key>")
):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid Authorization header")

        api_key = authorization.replace("Bearer ", "").strip()

        # Minimal Gemini call
        client = GeminiClient(api_key=api_key)
        response = client.generate(
            system_prompt="You are a system health checker.",
            user_prompt="Reply with OK."
        )

        if "OK" not in response.upper():
            raise HTTPException(status_code=401, detail="Invalid Gemini API key")

        return {"valid": True}

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Gemini API key")
