import re
from typing import Dict, List
from app.core.gemini_client import GeminiClient


REQUIRED_SECTIONS = {"experience", "skills", "education"}


def score_structure(sections: List[str]) -> int:
    present = REQUIRED_SECTIONS.intersection(set(sections))
    return int((len(present) / len(REQUIRED_SECTIONS)) * 30)


def score_keywords(text: str) -> int:
    # Simple, explainable heuristic
    words = re.findall(r"\b\w+\b", text.lower())
    unique_ratio = len(set(words)) / max(len(words), 1)
    return min(30, int(unique_ratio * 60))  # capped at 30


def score_readability(text: str) -> int:
    lines = [l for l in text.split("\n") if l.strip()]
    avg_len = sum(len(l) for l in lines) / max(len(lines), 1)
    # shorter bullets = more ATS-friendly
    if avg_len < 120:
        return 20
    if avg_len < 180:
        return 14
    return 8


def score_experience_with_ai(
    client: GeminiClient, context: str
) -> int:
    system_prompt = """
You are an ATS evaluator.
Score ONLY experience clarity and impact on a scale of 0–20.
Criteria:
- Clear role descriptions
- Action verbs
- Quantified impact
Return ONLY a number.
"""
    score_text = client.generate(system_prompt, context)
    try:
        return max(0, min(20, int(re.findall(r"\d+", score_text)[0])))
    except Exception:
        return 10  # safe default


def compute_ats_score(
    chunks: List[Dict],
    full_text: str,
    client: GeminiClient
) -> Dict:
    sections = [c["section"] for c in chunks]

    structure_score = score_structure(sections)
    keyword_score = score_keywords(full_text)
    readability_score = score_readability(full_text)

    experience_text = "\n".join(
        c["content"] for c in chunks if c["section"] == "experience"
    )
    experience_score = score_experience_with_ai(client, experience_text)

    total = (
        structure_score
        + keyword_score
        + readability_score
        + experience_score
    )

    return {
        "score": total,
        "breakdown": {
            "structure": structure_score,
            "keywords": keyword_score,
            "experience": experience_score,
            "readability": readability_score,
        }
    }
