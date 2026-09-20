from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models import User
from app.schemas.collection import (
    CollectionCreate,
    CollectionGameRequest,
    CollectionResponse,
    CollectionUpdate,
)
from app.services.collection_service import (
    add_game_to_collection,
    create_collection,
    remove_game_from_collection,
    update_collection,
)


router = APIRouter(
    prefix="/collections",
    tags=["Collections"],
)


@router.post(
    "",
    response_model=CollectionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: CollectionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return create_collection(
            db,
            current_user.id,
            data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        )


@router.patch(
    "/{collection_id}",
    response_model=CollectionResponse,
)
def update(
    collection_id: UUID,
    data: CollectionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return update_collection(
            db,
            current_user.id,
            collection_id,
            data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.post(
    "/{collection_id}/games",
    status_code=status.HTTP_204_NO_CONTENT,
)
def add_game(
    collection_id: UUID,
    data: CollectionGameRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        add_game_to_collection(
            db,
            current_user.id,
            collection_id,
            data,
        )
    except ValueError as error:
        message = str(error)

        if message == "Game not found":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=message,
        )


@router.delete(
    "/{collection_id}/games/{game_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_game(
    collection_id: UUID,
    game_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        remove_game_from_collection(
            db,
            current_user.id,
            collection_id,
            game_id,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )
