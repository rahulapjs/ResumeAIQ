import os
import shutil
from app.core.config import settings


def get_session_path(session_id: str) -> str:
    path = os.path.join(settings.SESSION_ROOT, session_id)
    os.makedirs(path, exist_ok=True)
    return path


def clear_session(session_id: str) -> None:
    path = os.path.join(settings.SESSION_ROOT, session_id)
    if os.path.exists(path):
        shutil.rmtree(path)
