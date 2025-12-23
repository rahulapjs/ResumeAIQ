import numpy as np
from google import genai
from app.core.config import settings


def embed_texts(texts: list[str], api_key: str) -> np.ndarray:
    if not texts:
        raise ValueError("No texts provided for embedding")

    client = genai.Client(api_key=api_key)

    embeddings = []
    for text in texts:
        result = client.models.embed_content(
            model="text-embedding-004",
            contents=text
        )
        
        embeddings.append(result.embeddings[0].values)

    return np.array(embeddings).astype("float32")
