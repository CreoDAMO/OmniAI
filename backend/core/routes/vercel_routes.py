
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import httpx
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/vercel", tags=["vercel"])

class ProjectCreate(BaseModel):
    name: str
    framework: str = "nextjs"
    gitRepo: Optional[str] = None
    environmentVars: List[Dict[str, str]] = []

class ProjectResponse(BaseModel):
    id: str
    name: str
    framework: Optional[str]
    url: Optional[str]
    status: Optional[str]
    updatedAt: Optional[str]

@router.get("/status")
async def get_vercel_status():
    """Check Vercel connection status"""
    vercel_token = os.getenv("VERCEL_TOKEN")
    if not vercel_token:
        return {"connected": False, "error": "Vercel token not configured"}
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.vercel.com/v2/user",
                headers={"Authorization": f"Bearer {vercel_token}"}
            )
            if response.status_code == 200:
                user_data = response.json()
                return {
                    "connected": True,
                    "user": {
                        "id": user_data.get("uid"),
                        "name": user_data.get("name"),
                        "username": user_data.get("username"),
                        "email": user_data.get("email")
                    }
                }
            else:
                return {"connected": False, "error": "Invalid Vercel token"}
    except Exception as e:
        logger.error(f"Vercel connection error: {e}")
        return {"connected": False, "error": str(e)}

@router.get("/projects")
async def get_projects():
    """Get user projects"""
    vercel_token = os.getenv("VERCEL_TOKEN")
    if not vercel_token:
        raise HTTPException(status_code=401, detail="Vercel token not configured")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.vercel.com/v9/projects",
                headers={"Authorization": f"Bearer {vercel_token}"}
            )
            
            if response.status_code == 200:
                data = response.json()
                projects = [
                    ProjectResponse(
                        id=project["id"],
                        name=project["name"],
                        framework=project.get("framework"),
                        url=f"https://{project['name']}.vercel.app" if project.get("alias") else None,
                        status="ready" if project.get("latestDeployments") else "inactive",
                        updatedAt=project.get("updatedAt")
                    )
                    for project in data.get("projects", [])
                ]
                return {"projects": projects}
            else:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch projects")
    except Exception as e:
        logger.error(f"Failed to fetch projects: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/projects")
async def create_project(project_data: ProjectCreate):
    """Create a new Vercel project"""
    vercel_token = os.getenv("VERCEL_TOKEN")
    if not vercel_token:
        raise HTTPException(status_code=401, detail="Vercel token not configured")
    
    try:
        async with httpx.AsyncClient() as client:
            # Create project
            project_payload = {
                "name": project_data.name,
                "framework": project_data.framework
            }
            
            if project_data.gitRepo:
                project_payload["gitRepository"] = {
                    "repo": project_data.gitRepo,
                    "type": "github"
                }
            
            response = await client.post(
                "https://api.vercel.com/v10/projects",
                headers={"Authorization": f"Bearer {vercel_token}"},
                json=project_payload
            )
            
            if response.status_code in [200, 201]:
                project = response.json()
                
                # Set environment variables if provided
                if project_data.environmentVars:
                    await set_environment_variables(
                        client, vercel_token, project["id"], project_data.environmentVars
                    )
                
                return {
                    "project": ProjectResponse(
                        id=project["id"],
                        name=project["name"],
                        framework=project.get("framework"),
                        url=f"https://{project['name']}.vercel.app",
                        status="created",
                        updatedAt=project.get("updatedAt")
                    )
                }
            else:
                raise HTTPException(status_code=response.status_code, detail="Failed to create project")
    except Exception as e:
        logger.error(f"Failed to create project: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/projects/{project_id}/deploy")
async def deploy_project(project_id: str):
    """Deploy a project"""
    vercel_token = os.getenv("VERCEL_TOKEN")
    if not vercel_token:
        raise HTTPException(status_code=401, detail="Vercel token not configured")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api.vercel.com/v13/deployments",
                headers={"Authorization": f"Bearer {vercel_token}"},
                json={"projectId": project_id}
            )
            
            if response.status_code in [200, 201]:
                deployment = response.json()
                return {
                    "deployment": {
                        "id": deployment["id"],
                        "url": deployment["url"],
                        "status": deployment["readyState"]
                    }
                }
            else:
                raise HTTPException(status_code=response.status_code, detail="Failed to deploy project")
    except Exception as e:
        logger.error(f"Failed to deploy project: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def set_environment_variables(client: httpx.AsyncClient, token: str, project_id: str, env_vars: List[Dict[str, str]]):
    """Set environment variables for a project"""
    for env_var in env_vars:
        if env_var.get("key") and env_var.get("value"):
            try:
                await client.post(
                    f"https://api.vercel.com/v10/projects/{project_id}/env",
                    headers={"Authorization": f"Bearer {token}"},
                    json={
                        "key": env_var["key"],
                        "value": env_var["value"],
                        "target": ["production", "preview", "development"]
                    }
                )
            except Exception as e:
                logger.warning(f"Failed to set env var {env_var['key']}: {e}")
