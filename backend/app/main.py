from fastapi import FastAPI

app = FastAPI(
    title="Arcadia API",
    description="Backend API for the Arcadia gaming management platform.",
    version="0.1.0",
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
