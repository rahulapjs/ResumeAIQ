from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

from app.routes import auth, resume, qa, summary, ats, job_match

app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(qa.router)
app.include_router(summary.router)
app.include_router(ats.router)
app.include_router(job_match.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
