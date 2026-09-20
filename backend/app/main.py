from fastapi import FastAPI

from app.api.auth.routes import router as auth_router


app = FastAPI(
    title="Arcadia API",
    description="Backend API for the Arcadia gaming management platform.",
    version="0.1.0",
)


app.include_router(
    auth_router,
    prefix="/api/v1",
)


@app.get("/")
def root():
    return {
        "message": "Welcome to Arcadia API",
        "version": "0.1.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }
