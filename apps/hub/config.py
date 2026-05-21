import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Monorepo configuration
    workspace_dir: str = "/Volumes/Blue/TinyTask"
    
    # Database configuration
    database_url: str = "sqlite:////Volumes/Blue/TinyTask/tinytask.db"
    
    # LLM configuration (Ollama local endpoint)
    ollama_api_url: str = "http://localhost:11434"
    ollama_model: str = "llama3"
    
    # Optional Gemini configuration
    gemini_api_key: str = ""

    model_config = SettingsConfigDict(
        env_file=os.path.join("/Volumes/Blue/TinyTask", ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
