from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Game, Review
from app.schemas.review import ReviewCreate, ReviewUpdate


def create_review(
    db: Session,
    user_id,
    data: ReviewCreate,
) -> Review:
    game = db.scalar(
        select(Game).where(Game.id == data.game_id)
    )

    if not game:
        raise ValueError("Game not found")

    existing_review = db.scalar(
        select(Review).where(
            Review.user_id == user_id,
            Review.game_id == data.game_id,
        )
    )

    if existing_review:
        raise ValueError("You have already reviewed this game")

    review = Review(
        user_id=user_id,
        game_id=data.game_id,
        title=data.title,
        body=data.body,
        rating=data.rating,
        contains_spoilers=data.contains_spoilers,
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return review


def update_review(
    db: Session,
    user_id,
    review_id,
    data: ReviewUpdate,
) -> Review:
    review = db.scalar(
        select(Review).where(
            Review.id == review_id,
            Review.user_id == user_id,
        )
    )

    if not review:
        raise ValueError("Review not found")

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(review, field, value)

    db.commit()
    db.refresh(review)

    return review
