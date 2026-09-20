from fastapi import FastAPI
from app.api.users.routes import router as users_router
from app.api.auth.routes import router as auth_router
from app.api.reviews.routes import router as reviews_router
from app.api.library.routes import router as library_router
from app.api.collections.routes import router as collections_router
from app.api.games.routes import router as games_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="Arcadia API",
    description="Backend API for the Arcadia gaming management platform.",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(
    users_router,
    prefix="/api/v1",
)

app.include_router(
    auth_router,
    prefix="/api/v1",
)
app.include_router(
    library_router,
    prefix="/api/v1",
)
app.include_router(
    reviews_router,
    prefix="/api/v1",
)
app.include_router(
    collections_router,
    prefix="/api/v1",
)
app.include_router(
    games_router,
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
