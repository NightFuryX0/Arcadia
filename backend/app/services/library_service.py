from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Game, UserGame
from app.schemas.library import LibraryAddRequest, LibraryUpdateRequest
from app.services.game_service import get_or_import_game


def add_game_to_library(
    db: Session,
    user_id,
    data: LibraryAddRequest,
) -> UserGame:
    game = db.scalar(
        select(Game).where(Game.id == data.game_id)
    )

    if not game:
        raise ValueError("Game not found")

    existing_entry = db.scalar(
        select(UserGame).where(
            UserGame.user_id == user_id,
            UserGame.game_id == data.game_id,
        )
    )

    if existing_entry:
        raise ValueError("Game is already in your library")

    user_game = UserGame(
        user_id=user_id,
        game_id=data.game_id,
    )

    db.add(user_game)
    db.commit()
    db.refresh(user_game)

    return user_game


def update_library_entry(
    db: Session,
    user_id,
    game_id,
    data: LibraryUpdateRequest,
) -> UserGame:
    user_game = db.scalar(
        select(UserGame).where(
            UserGame.user_id == user_id,
            UserGame.game_id == game_id,
        )
    )

    if not user_game:
        raise ValueError("Game is not in your library")

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(user_game, field, value)

    db.commit()
    db.refresh(user_game)

    return user_game


def add_external_game_to_library(
    db: Session,
    user_id,
    external_id: str,
) -> UserGame:
    game = get_or_import_game(
        db,
        external_id,
    )

    existing_entry = db.scalar(
        select(UserGame).where(
            UserGame.user_id == user_id,
            UserGame.game_id == game.id,
        )
    )

    if existing_entry:
        raise ValueError(
            "Game is already in your library"
        )

    user_game = UserGame(
        user_id=user_id,
        game_id=game.id,
    )

    db.add(user_game)
    db.commit()
    db.refresh(user_game)

    return user_game
