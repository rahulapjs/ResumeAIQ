from typing import Dict, List
from app.services.embeddings import embed_texts
from app.services.rag import load_faiss_index, load_chunks
from app.core.gemini_client import GeminiClient


def match_resume_to_jd(
    jd_text: str,
    session_path: str,
    api_key: str,
    top_k: int = 6
) -> Dict:
    # Load resume artifacts
    index = load_faiss_index(session_path)
    chunks = load_chunks(session_path)

    # Embed JD
    jd_embedding = embed_texts([jd_text], api_key)

    # Retrieve most relevant resume chunks
    distances, indices = index.search(jd_embedding, top_k)
    relevant_chunks = [
        chunks[i] for i in indices[0] if i < len(chunks)
    ]

    # Build context
    resume_context = "\n\n".join(
        f"[{c['section'].upper()}]\n{c['content']}"
        for c in relevant_chunks
    )

    system_prompt = """
You are an ATS and HR matching assistant.

Tasks:
1. Evaluate how well the resume matches the job description.
2. Produce a match score between 0 and 100.
3. List strengths (skills/experience present).
4. List missing or weak skills.
5. Provide clear improvement recommendations.

Rules:
- Use ONLY the provided resume context.
- Do NOT assume experience.
- Be factual and concise.
"""

    user_prompt = f"""
Job Description:
{jd_text}

Resume Context:
{resume_context}

Respond in the following JSON format:
{
  "match_score": number,
  "strengths": [string],
  "missing_skills": [string],
  "recommendations": [string]
}
"""

    client = GeminiClient(api_key)
    response = client.generate(system_prompt, user_prompt)

    return response
