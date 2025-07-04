
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv
from backend.core.routes.nvidia_routes import router as nvidia_router
from backend.core.routes.github_routes import router as github_router
from backend.core.routes.vercel_routes import router as vercel_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="OmniAI",
    description="AI-Powered XR and Cloud Gaming Platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(nvidia_router)
app.include_router(github_router)
app.include_router(vercel_router)

# Serve frontend static files
if os.path.exists("frontend/dist"):
    app.mount("/static", StaticFiles(directory="frontend/dist"), name="static")
    
    @app.get("/")
    async def serve_frontend():
        return FileResponse("frontend/dist/index.html")
else:
    @app.get("/")
    async def root():
        return {"message": "OmniAI Platform - AI-Powered XR and Cloud Gaming"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "backend": "running",
            "nvidia_sdks": "checking",
            "ai_services": "checking"
        }
    }

@app.get("/api/status")
async def api_status():
    return {
        "nvidia_integration": {
            "geforce_now": "available" if os.getenv("GEFORCE_NOW_API_KEY") else "not_configured",
            "cloudxr": "available" if os.getenv("CLOUDXR_LICENSE_KEY") else "not_configured",
            "dlss": "available" if os.getenv("NVIDIA_DEVELOPER_API_KEY") else "not_configured"
        },
        "ai_services": {
            "openai": "available" if os.getenv("OPENAI_API_KEY") else "not_configured",
            "pinecone": "available" if os.getenv("PINECONE_API_KEY") else "not_configured"
        },
        "deployment": {
            "github": "available" if os.getenv("GITHUB_TOKEN") else "not_configured",
            "vercel": "available" if os.getenv("VERCEL_TOKEN") else "not_configured"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
