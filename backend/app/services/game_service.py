import re
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Game
from app.schemas.game import GameCreate
from app.services.igdb_service import get_game

SLUG_ALREADY_EXISTS = "Game with this slug already exists"
EXTERNAL_ID_ALREADY_EXISTS = "Game with this external ID already exists"


def _slugify(title: Optional[str], external_id: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", (title or "").lower()).strip("-")
    return slug or "game-{}".format(external_id)


def _raise_if_conflict(
    db: Session,
    slug: str,
    external_id: Optional[str],
) -> None:
    """One lightweight query instead of two full-entity loads."""
    conditions = [Game.slug == slug]
    if external_id:
        conditions.append(Game.external_id == external_id)

    rows = db.execute(
        select(Game.slug, Game.external_id)
        .where(or_(*conditions))
        .limit(2)
    ).all()

    # Slug is checked first, matching the original order.
    if any(row.slug == slug for row in rows):
        raise ValueError(SLUG_ALREADY_EXISTS)
    if rows:
        raise ValueError(EXTERNAL_ID_ALREADY_EXISTS)


def create_game(db: Session, data: GameCreate) -> Game:
    _raise_if_conflict(db, data.slug, data.external_id)

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
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # Lost a race with a concurrent request: report it the same way
        # as the pre-check would have. Otherwise it's a different error.
        _raise_if_conflict(db, data.slug, data.external_id)
        raise

    db.refresh(game)
    return game


def get_or_import_game(
    db: Session,
    external_id: str,
) -> Game:
    existing_game = db.scalar(
        select(Game).where(Game.external_id == external_id)
    )

    if existing_game:
        return existing_game

    # Release the DB connection held by the SELECT above before the slow
    # external IGDB call. Nothing is pending, so this is a no-op otherwise.
    db.rollback()

    # Raises ValueError("Game not found") exactly as before.
    game_data = get_game(external_id)

    release_date = None
    if game_data.get("release_date"):
        release_date = datetime.fromtimestamp(
            game_data["release_date"],
            tz=timezone.utc,
        ).date()

    slug = _slugify(game_data.get("title"), game_data["external_id"])

    # Different games can share a title; keep slugs unique by suffixing
    # the IGDB id when the plain slug is already taken.
    if db.scalar(select(Game.id).where(Game.slug == slug).limit(1)) is not None:
        slug = "{}-{}".format(slug, game_data["external_id"])

    game = Game(
        external_id=game_data["external_id"],
        title=game_data["title"],
        slug=slug,
        description=game_data.get("summary"),
        cover_url=game_data.get("cover_url"),
        release_date=release_date,
    )

    db.add(game)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # A concurrent request imported the same game first; return it.
        existing_game = db.scalar(
            select(Game).where(Game.external_id == game_data["external_id"])
        )
        if existing_game:
            return existing_game
        raise

    db.refresh(game)
    return game
