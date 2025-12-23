from fastapi import APIRouter, Header, HTTPException
from app.core.session import get_session_path
from app.services.rag import load_chunks
from app.core.gemini_client import GeminiClient
from app.services.ats_engine import compute_ats_score

router = APIRouter(prefix="/resume", tags=["ATS"])


@router.post("/ats-score")
def ats_score(
    x_session_id: str = Header(..., alias="X-Session-ID"),
    authorization: str = Header(..., description="Bearer <Gemini API Key>")
):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    api_key = authorization.replace("Bearer ", "").strip()
    if not api_key:
        raise HTTPException(status_code=401, detail="Gemini API key missing")

    session_path = get_session_path(x_session_id)

    try:
        chunks = load_chunks(session_path)
        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="Resume not processed yet. Upload resume first."
            )

        full_text = "\n".join(c["content"] for c in chunks)
        client = GeminiClient(api_key)

        result = compute_ats_score(chunks, full_text, client)

        return {
            "ats_score": result["score"],
            "breakdown": result["breakdown"]
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=400,
            detail="Resume not processed yet. Upload resume first."
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"ATS scoring failed: {str(e)}"
        )
