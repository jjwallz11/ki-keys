# app/config.py

from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# Detect environment
ENV = os.getenv("ENVIRONMENT", "development")
ENV_FILE = BASE_DIR / f".env.{ENV}" if ENV != "development" else BASE_DIR / ".env"

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 720
    ALGORITHM: str = "HS256"
    DEBUG: bool = ENV == "development"
    ENVIRONMENT: str = ENV
    SCHEMA: str = "public"

    model_config = ConfigDict(
        ENV_FILE=ENV_FILE,
        ENV_FILE_encoding="utf-8",
        extra="allow"
    )

settings = Settings()