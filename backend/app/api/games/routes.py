import logging
import time

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.schemas.game import GameCreate, GameResponse
from app.services.game_service import create_game
from app.services.igdb_service import get_game, search_games

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/games",
    tags=["Games"],
)


@router.get("/search")
def search(
    q: str,
    limit: int = Query(10, ge=1, le=50),
):
    # Sync def on purpose: FastAPI runs it in a threadpool, so the blocking
    # urllib calls don't stall the event loop.
    started = time.perf_counter()
    try:
        return search_games(q, limit)
    finally:
        logger.info(
            "GET /games/search total %.3fs",
            time.perf_counter() - started,
        )


@router.get("/{external_id}")
def get_game_details(external_id: str):
    try:
        return get_game(external_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found",
        )
# get_game_details and create stay exactly as they were.
