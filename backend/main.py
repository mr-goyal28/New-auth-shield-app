import sys
import os

# Ensure root directory and backend directory are in python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(backend_dir)

if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

try:
    from backend.database import engine, Base
    from backend.routers import auth
except ImportError:
    from database import engine, Base
    from routers import auth

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Authentication API",
    description="Full-stack FastAPI & Vanilla HTML/CSS/JS authentication system with JWT and HttpOnly Cookies",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration allowing any local or deployed origin
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

# Mount frontend static directory
frontend_dir = os.path.join(root_dir, "frontend")
if os.path.exists(frontend_dir) and os.path.exists(os.path.join(frontend_dir, "index.html")):
    app.mount("/static", StaticFiles(directory=frontend_dir, html=True), name="static")

@app.get("/")
def root():
    return {
        "message": "Auth API is running smoothly",
        "docs": "/docs",
        "redoc": "/redoc",
        "static_frontend": "/static/index.html"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
