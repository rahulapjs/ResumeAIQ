from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from app.core.session import get_session_path
from app.services.embeddings import embed_texts
from app.services.rag import load_faiss_index, load_chunks
from app.core.gemini_client import GeminiClient

router = APIRouter(prefix="/resume", tags=["Resume Q&A"])


class QuestionRequest(BaseModel):
    question: str
    top_k: int = 4


@router.post("/qa")
def resume_qa(
    payload: QuestionRequest,
    x_session_id: str = Header(..., alias="X-Session-ID"),
    authorization: str = Header(..., description="Bearer <Gemini API Key>")
):
    # --- Validate headers ---
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    api_key = authorization.replace("Bearer ", "").strip()
    if not api_key:
        raise HTTPException(status_code=401, detail="Gemini API key missing")

    if not payload.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    session_path = get_session_path(x_session_id)

    try:
        # 1. Load FAISS index & chunks
        index = load_faiss_index(session_path)
        chunks = load_chunks(session_path)

        # 2. Embed the question
        question_embedding = embed_texts([payload.question], api_key)

        # 3. Retrieve top-K relevant chunks
        distances, indices = index.search(question_embedding, payload.top_k)

        retrieved_chunks = []
        for idx in indices[0]:
            if idx < len(chunks):
                retrieved_chunks.append(chunks[idx])

        if not retrieved_chunks:
            return {"answer": "No relevant information found in resume."}

        # 4. Build context
        context = "\n\n".join(
            f"[{c['section'].upper()}]\n{c['content']}"
            for c in retrieved_chunks
        )

        # 5. Ask Gemini (STRICT grounding)
        system_prompt = """
You are an HR assistant.
Answer ONLY using the provided resume context.
If the answer is not present, reply: "Not found in resume."
Be concise and factual.
"""

        user_prompt = f"""
Resume Context:
{context}

Question:
{payload.question}
"""

        client = GeminiClient(api_key)
        answer = client.generate(system_prompt, user_prompt)

        return {
            "question": payload.question,
            "answer": answer,
            "sources": [
                {
                    "section": c["section"],
                    "order": c["order"]
                } for c in retrieved_chunks
            ]
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=400,
            detail="Resume not processed yet. Upload resume first."
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Q&A failed: {str(e)}"
        )
