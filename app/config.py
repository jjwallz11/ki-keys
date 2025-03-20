from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ALGORITHM: str = "HS256"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"  # Add this default value

    model_config = ConfigDict(extra="allow")  # Allow extra fields

settings = Settings()