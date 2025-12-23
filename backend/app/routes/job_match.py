from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from app.core.session import get_session_path
from app.services.jd_match import match_resume_to_jd

router = APIRouter(prefix="/resume", tags=["Job Match"])


class JDRequest(BaseModel):
    job_description: str


@router.post("/job-match")
def job_match(
    payload: JDRequest,
    x_session_id: str = Header(..., alias="X-Session-ID"),
    authorization: str = Header(..., description="Bearer <Gemini API Key>")
):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    api_key = authorization.replace("Bearer ", "").strip()
    if not api_key:
        raise HTTPException(status_code=401, detail="Gemini API key missing")

    if not payload.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is required")

    session_path = get_session_path(x_session_id)

    try:
        result = match_resume_to_jd(
            jd_text=payload.job_description,
            session_path=session_path,
            api_key=api_key
        )

        return {
            "result": result
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=400,
            detail="Resume not processed yet. Upload resume first."
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Job match failed: {str(e)}"
        )
