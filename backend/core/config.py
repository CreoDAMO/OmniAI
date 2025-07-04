
import os
from dataclasses import dataclass
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

@dataclass
class Settings:
    # Database
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    postgres_url: str = os.getenv("POSTGRES_URL", "")
    
    # Security
    jwt_secret: str = os.getenv("JWT_SECRET", "your-jwt-secret-here")
    encryption_key: str = os.getenv("ENCRYPTION_KEY", "your-encryption-key-here")
    
    # NVIDIA
    nvidia_developer_api_key: Optional[str] = os.getenv("NVIDIA_DEVELOPER_API_KEY")
    geforce_now_api_key: Optional[str] = os.getenv("GEFORCE_NOW_API_KEY")
    cloudxr_license_key: Optional[str] = os.getenv("CLOUDXR_LICENSE_KEY")
    
    # AI Services
    pinecone_api_key: Optional[str] = os.getenv("PINECONE_API_KEY")
    pinecone_environment: str = os.getenv("PINECONE_ENVIRONMENT", "us-west1-gcp")
    openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
    
    # Deployment
    github_token: Optional[str] = os.getenv("GITHUB_TOKEN")
    vercel_token: Optional[str] = os.getenv("VERCEL_TOKEN")
    vercel_org_id: Optional[str] = os.getenv("VERCEL_ORG_ID")
    vercel_project_id: Optional[str] = os.getenv("VERCEL_PROJECT_ID")
    
    # File Storage
    upload_directory: str = os.getenv("UPLOAD_DIRECTORY", "/tmp/uploads")
    max_file_size: int = int(os.getenv("MAX_FILE_SIZE", "104857600"))

def get_settings() -> Settings:
    return Settings()
