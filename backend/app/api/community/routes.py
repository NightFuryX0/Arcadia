from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models import User
from app.schemas.community import (
    CommunityReviewResponse,
    SuggestedUserResponse,
)
from app.services.community_service import (
    get_community_feed,
    get_recent_reviews,
    get_suggested_users,
)


router = APIRouter(
    prefix="/community",
    tags=["Community"],
)


@router.get(
    "/feed",
    response_model=list[CommunityReviewResponse],
)
def community_feed(
    limit: int = Query(default=20, ge=1, le=50),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    reviews = get_community_feed(
        db,
        current_user.id,
        limit,
        offset,
    )

    # If the user doesn't follow anyone yet,
    # give them something useful to discover.
    if not reviews and offset == 0:
        reviews = get_recent_reviews(
            db,
            current_user.id,
            limit,
            offset,
        )

    return reviews


@router.get(
    "/suggestions",
    response_model=list[SuggestedUserResponse],
)
def community_suggestions(
    limit: int = Query(default=6, ge=1, le=20),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_suggested_users(
        db,
        current_user.id,
        limit,
    )
