from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "ResumeIQ"
    APP_VERSION: str = "0.1.0"

    SESSION_ROOT: str = "sessions"
    GEMINI_MODEL: str = "gemini-2.0-flash-exp"

    class Config:
        env_file = ".env"


settings = Settings()
