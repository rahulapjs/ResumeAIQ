import os
from fastapi import UploadFile, HTTPException

ALLOWED_EXTENSIONS = {".pdf", ".docx"}


def validate_resume_file(file: UploadFile):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported"
        )
    return ext
