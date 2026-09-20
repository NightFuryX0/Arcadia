from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Game
from app.schemas.game import GameCreate
from datetime import datetime, timezone
from app.services.igdb_service import get_game


def create_game(db: Session, data: GameCreate) -> Game:
    existing_slug = db.scalar(
        select(Game).where(Game.slug == data.slug)
    )

    if existing_slug:
        raise ValueError("Game with this slug already exists")

    if data.external_id:
        existing_external_id = db.scalar(
            select(Game).where(Game.external_id == data.external_id)
        )

        if existing_external_id:
            raise ValueError("Game with this external ID already exists")

    game = Game(
        external_id=data.external_id,
        title=data.title,
        slug=data.slug,
        description=data.description,
        cover_url=data.cover_url,
        release_date=data.release_date,
        developer=data.developer,
        publisher=data.publisher,
    )

    db.add(game)
    db.commit()
    db.refresh(game)

    return game


def get_or_import_game(
    db: Session,
    external_id: str,
) -> Game:
    existing_game = db.scalar(
        select(Game).where(
            Game.external_id == external_id
        )
    )

    if existing_game:
        return existing_game

    game_data = get_game(external_id)

    release_date = None

    if game_data.get("release_date"):
        release_date = datetime.fromtimestamp(
            game_data["release_date"],
            tz=timezone.utc,
        ).date()

    slug = game_data["title"].lower().replace(" ", "-")

    game = Game(
        external_id=game_data["external_id"],
        title=game_data["title"],
        slug=slug,
        description=game_data.get("summary"),
        cover_url=game_data.get("cover_url"),
        release_date=release_date,
    )

    db.add(game)
    db.commit()
    db.refresh(game)

    return game
