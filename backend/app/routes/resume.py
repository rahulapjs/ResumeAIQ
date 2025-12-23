import os
import json
from fastapi import APIRouter, UploadFile, File, Header, HTTPException

from app.core.session import get_session_path
from app.utils.file_utils import validate_resume_file
from app.services.parser import parse_resume
from app.services.chunker import create_chunks
from app.services.embeddings import embed_texts
from app.services.rag import build_faiss_index

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    x_session_id: str = Header(..., alias="X-Session-ID"),
    authorization: str = Header(..., description="Bearer <Gemini API Key>")
):
    # --- Validate headers ---
    if not x_session_id:
        raise HTTPException(status_code=400, detail="X-Session-ID header is required")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    api_key = authorization.replace("Bearer ", "").strip()
    if not api_key:
        raise HTTPException(status_code=401, detail="Gemini API key missing")

    # --- File validation ---
    ext = validate_resume_file(file)
    session_path = get_session_path(x_session_id)

    file_path = os.path.join(session_path, f"resume{ext}")
    text_path = os.path.join(session_path, "resume.txt")
    chunks_path = os.path.join(session_path, "chunks.json")

    try:
        # 1. Save uploaded file
        with open(file_path, "wb") as f:
            f.write(file.file.read())

        # 2. Parse resume text
        text = parse_resume(file_path, ext)
        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Failed to extract text from resume"
            )

        # 3. Save parsed text
        with open(text_path, "w", encoding="utf-8") as f:
            f.write(text)

        # 4. Create section-aware chunks
        chunks = create_chunks(text)
        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="Failed to create resume chunks"
            )

        # 5. Save chunks
        with open(chunks_path, "w", encoding="utf-8") as f:
            json.dump(chunks, f, ensure_ascii=False, indent=2)

        # 6. Create embeddings from chunks
        texts = [chunk["content"] for chunk in chunks]
        embeddings = embed_texts(texts, api_key)

        # 7. Build FAISS index (session-scoped)
        build_faiss_index(embeddings, session_path)

        return {
            "message": "Resume uploaded, parsed, embedded, and indexed successfully",
            "characters": len(text),
            "chunks": len(chunks)
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume processing failed: {str(e)}"
        )
