from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.schemas.game import GameCreate, GameResponse
from app.services.game_service import create_game
from typing import List

from app.services.igdb_service import get_game, search_games
router = APIRouter(
    prefix="/games",
    tags=["Games"],
)


@router.get("/search")
def search(
    q: str,
    limit: int = 10,
):
    return search_games(q, limit)


@router.get("/{external_id}")
def get_game_details(external_id: str):
    try:
        return get_game(external_id)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.post(
    "",
    response_model=GameResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: GameCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_game(db, data)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        )
