import os
import json
import faiss
import numpy as np


def build_faiss_index(
    embeddings: np.ndarray,
    session_path: str
) -> None:
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    index_path = os.path.join(session_path, "faiss.index")
    faiss.write_index(index, index_path)


def load_faiss_index(session_path: str) -> faiss.Index:
    index_path = os.path.join(session_path, "faiss.index")
    if not os.path.exists(index_path):
        raise FileNotFoundError("FAISS index not found")

    return faiss.read_index(index_path)


def load_chunks(session_path: str) -> list[dict]:
    chunks_path = os.path.join(session_path, "chunks.json")
    with open(chunks_path, "r", encoding="utf-8") as f:
        return json.load(f)
