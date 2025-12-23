from fastapi import APIRouter, Header, HTTPException
from app.core.session import get_session_path
from app.services.rag import load_chunks
from app.core.gemini_client import GeminiClient

router = APIRouter(prefix="/resume", tags=["Resume Summary"])


@router.post("/summary")
def resume_summary(
    x_session_id: str = Header(..., alias="X-Session-ID"),
    authorization: str = Header(..., description="Bearer <Gemini API Key>")
):
    # --- Validate headers ---
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    api_key = authorization.replace("Bearer ", "").strip()
    if not api_key:
        raise HTTPException(status_code=401, detail="Gemini API key missing")

    session_path = get_session_path(x_session_id)

    try:
        # Load resume chunks
        chunks = load_chunks(session_path)
        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="Resume not processed yet. Upload resume first."
            )

        # Build full resume context (ordered)
        context = "\n\n".join(
            f"[{c['section'].upper()}]\n{c['content']}"
            for c in sorted(chunks, key=lambda x: x["order"])
        )

        system_prompt = """
You are an HR assistant.
Create a concise, recruiter-friendly resume summary.
Use ONLY the provided resume content.
Do NOT assume or add information.
If something is unclear or missing, omit it.
Tone: factual, neutral, professional.
Output 4–6 bullet points.
"""

        user_prompt = f"""
Resume Content:
{context}

Task:
Generate an HR-focused summary of this candidate.
"""

        client = GeminiClient(api_key)
        summary = client.generate(system_prompt, user_prompt)

        return {
            "summary": summary
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=400,
            detail="Resume not processed yet. Upload resume first."
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Summary generation failed: {str(e)}"
        )
