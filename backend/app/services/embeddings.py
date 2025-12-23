import numpy as np
import google.generativeai as genai
from app.core.config import settings


def embed_texts(texts: list[str], api_key: str) -> np.ndarray:
    if not texts:
        raise ValueError("No texts provided for embedding")

    genai.configure(api_key=api_key)

    embeddings = []
    for text in texts:
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document"
        )
        embeddings.append(result["embedding"])

    return np.array(embeddings).astype("float32")
