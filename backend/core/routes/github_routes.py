
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
import httpx
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/github", tags=["github"])

class RepositoryCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    private: bool = False
    framework: str = "nextjs"

class RepositoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    html_url: str
    private: bool
    default_branch: str
    stargazers_count: int

@router.get("/status")
async def get_github_status():
    """Check GitHub connection status"""
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        return {"connected": False, "error": "GitHub token not configured"}
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {github_token}"}
            )
            if response.status_code == 200:
                user_data = response.json()
                return {
                    "connected": True,
                    "user": {
                        "login": user_data.get("login"),
                        "name": user_data.get("name"),
                        "avatar_url": user_data.get("avatar_url")
                    }
                }
            else:
                return {"connected": False, "error": "Invalid GitHub token"}
    except Exception as e:
        logger.error(f"GitHub connection error: {e}")
        return {"connected": False, "error": str(e)}

@router.get("/repositories")
async def get_repositories():
    """Get user repositories"""
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        raise HTTPException(status_code=401, detail="GitHub token not configured")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.github.com/user/repos",
                headers={"Authorization": f"Bearer {github_token}"},
                params={"sort": "updated", "per_page": 50}
            )
            
            if response.status_code == 200:
                repos_data = response.json()
                repositories = [
                    RepositoryResponse(
                        id=repo["id"],
                        name=repo["name"],
                        description=repo.get("description"),
                        html_url=repo["html_url"],
                        private=repo["private"],
                        default_branch=repo.get("default_branch", "main"),
                        stargazers_count=repo["stargazers_count"]
                    )
                    for repo in repos_data
                ]
                return {"repositories": repositories}
            else:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch repositories")
    except Exception as e:
        logger.error(f"Failed to fetch repositories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/repositories")
async def create_repository(repo_data: RepositoryCreate):
    """Create a new repository"""
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        raise HTTPException(status_code=401, detail="GitHub token not configured")
    
    try:
        # Create repository
        async with httpx.AsyncClient() as client:
            repo_payload = {
                "name": repo_data.name,
                "description": repo_data.description,
                "private": repo_data.private,
                "auto_init": True
            }
            
            response = await client.post(
                "https://api.github.com/user/repos",
                headers={"Authorization": f"Bearer {github_token}"},
                json=repo_payload
            )
            
            if response.status_code == 201:
                repo = response.json()
                
                # Add framework-specific files
                await add_framework_files(client, github_token, repo["owner"]["login"], repo["name"], repo_data.framework)
                
                return {
                    "repository": RepositoryResponse(
                        id=repo["id"],
                        name=repo["name"],
                        description=repo.get("description"),
                        html_url=repo["html_url"],
                        private=repo["private"],
                        default_branch=repo.get("default_branch", "main"),
                        stargazers_count=repo["stargazers_count"]
                    )
                }
            else:
                raise HTTPException(status_code=response.status_code, detail="Failed to create repository")
    except Exception as e:
        logger.error(f"Failed to create repository: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def add_framework_files(client: httpx.AsyncClient, token: str, owner: str, repo: str, framework: str):
    """Add framework-specific files to repository"""
    files = get_framework_files(framework)
    
    for file_path, content in files.items():
        try:
            await client.put(
                f"https://api.github.com/repos/{owner}/{repo}/contents/{file_path}",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "message": f"Add {file_path}",
                    "content": content.encode().hex()
                }
            )
        except Exception as e:
            logger.warning(f"Failed to add {file_path}: {e}")

def get_framework_files(framework: str) -> dict:
    """Get template files for framework"""
    if framework == "nextjs":
        return {
            "package.json": """{
  "name": "nextjs-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  }
}""",
            "vercel.json": """{
  "framework": "nextjs"
}"""
        }
    elif framework == "react":
        return {
            "package.json": """{
  "name": "react-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest"
  }
}"""
        }
    return {}
