from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models import User
from app.schemas.admin import (
    AdminActivityResponse,
    AdminLibraryStatusResponse,
    AdminStatsResponse,
)
from app.services.admin_service import (
    get_admin_activity,
    get_admin_stats,
    get_library_statuses,
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


def require_admin(
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user


@router.get(
    "/stats",
    response_model=AdminStatsResponse,
)
def admin_stats(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return get_admin_stats(db)


@router.get(
    "/activity",
    response_model=list[AdminActivityResponse],
)
def admin_activity(
    limit: int = Query(default=20, ge=1, le=100),
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return get_admin_activity(
        db,
        limit,
    )


@router.get(
    "/library-status",
    response_model=list[AdminLibraryStatusResponse],
)
def admin_library_status(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return get_library_statuses(db)
