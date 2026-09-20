from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models import User
from app.schemas.library import (
    LibraryAddRequest,
    LibraryResponse,
    LibraryUpdateRequest,
)
from app.services.library_service import (
    add_game_to_library,
    update_library_entry,
)
from app.services.library_service import (
    add_external_game_to_library,
    add_game_to_library,
    update_library_entry,
)

router = APIRouter(
    prefix="/library",
    tags=["Library"],
)


@router.post(
    "",
    response_model=LibraryResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_to_library(
    data: LibraryAddRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return add_game_to_library(
            db,
            current_user.id,
            data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND
            if str(error) == "Game not found"
            else status.HTTP_409_CONFLICT,
            detail=str(error),
        )


@router.patch(
    "/{game_id}",
    response_model=LibraryResponse,
)
def update_library(
    game_id: UUID,
    data: LibraryUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return update_library_entry(
            db,
            current_user.id,
            game_id,
            data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.post(
    "/external/{external_id}",
    response_model=LibraryResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_external_game(
    external_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return add_external_game_to_library(
            db,
            current_user.id,
            external_id,
        )
    except ValueError as error:
        message = str(error)

        if message == "Game is already in your library":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=message,
        )
