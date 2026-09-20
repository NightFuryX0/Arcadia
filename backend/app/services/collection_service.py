from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models import Collection, Game
from app.models.collection import collection_games
from app.schemas.collection import (
    CollectionCreate,
    CollectionGameRequest,
    CollectionUpdate,
)


def create_collection(
    db: Session,
    user_id,
    data: CollectionCreate,
) -> Collection:
    existing_collection = db.scalar(
        select(Collection).where(
            Collection.user_id == user_id,
            Collection.name == data.name,
        )
    )

    if existing_collection:
        raise ValueError("A collection with this name already exists")

    collection = Collection(
        user_id=user_id,
        name=data.name,
        description=data.description,
        is_public=data.is_public,
    )

    db.add(collection)
    db.commit()
    db.refresh(collection)

    return collection


def update_collection(
    db: Session,
    user_id,
    collection_id,
    data: CollectionUpdate,
) -> Collection:
    collection = db.scalar(
        select(Collection).where(
            Collection.id == collection_id,
            Collection.user_id == user_id,
        )
    )

    if not collection:
        raise ValueError("Collection not found")

    update_data = data.model_dump(exclude_unset=True)

    if "name" in update_data:
        existing_collection = db.scalar(
            select(Collection).where(
                Collection.user_id == user_id,
                Collection.name == update_data["name"],
                Collection.id != collection_id,
            )
        )

        if existing_collection:
            raise ValueError("A collection with this name already exists")

    for field, value in update_data.items():
        setattr(collection, field, value)

    db.commit()
    db.refresh(collection)

    return collection


def add_game_to_collection(
    db: Session,
    user_id,
    collection_id,
    data: CollectionGameRequest,
) -> None:
    collection = db.scalar(
        select(Collection).where(
            Collection.id == collection_id,
            Collection.user_id == user_id,
        )
    )

    if not collection:
        raise ValueError("Collection not found")

    game = db.scalar(
        select(Game).where(Game.id == data.game_id)
    )

    if not game:
        raise ValueError("Game not found")

    existing_game = db.execute(
        select(collection_games).where(
            collection_games.c.collection_id == collection_id,
            collection_games.c.game_id == data.game_id,
        )
    ).first()

    if existing_game:
        raise ValueError("Game is already in this collection")

    db.execute(
        collection_games.insert().values(
            collection_id=collection_id,
            game_id=data.game_id,
        )
    )

    db.commit()


def remove_game_from_collection(
    db: Session,
    user_id,
    collection_id,
    game_id,
) -> None:
    collection = db.scalar(
        select(Collection).where(
            Collection.id == collection_id,
            Collection.user_id == user_id,
        )
    )

    if not collection:
        raise ValueError("Collection not found")

    result = db.execute(
        delete(collection_games).where(
            collection_games.c.collection_id == collection_id,
            collection_games.c.game_id == game_id,
        )
    )

    if result.rowcount == 0:
        raise ValueError("Game is not in this collection")

    db.commit()
