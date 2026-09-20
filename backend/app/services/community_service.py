from uuid import UUID

from sqlalchemy import exists
from sqlalchemy.orm import Session

from app.models.game import Game
from app.models.review import Review
from app.models.user import User
from app.models.follow import Follow


def get_community_feed(
    db: Session,
    current_user_id: UUID,
    limit: int = 20,
    offset: int = 0,
):
    following_subquery = exists().where(
        (Follow.follower_id == current_user_id)
        & (Follow.following_id == Review.user_id)
    )

    query = (
        db.query(
            Review.id,
            Review.user_id,
            User.username,
            User.display_name,
            User.avatar_url,
            Review.game_id,
            Game.title.label("game_title"),
            Game.cover_url.label("game_cover_url"),
            Review.title,
            Review.body,
            Review.rating,
            Review.contains_spoilers,
            Review.created_at,
        )
        .join(User, Review.user_id == User.id)
        .join(Game, Review.game_id == Game.id)
        .filter(
            Review.user_id != current_user_id,
            following_subquery,
        )
        .order_by(Review.created_at.desc())
        .offset(offset)
        .limit(limit)
    )

    return query.all()


def get_recent_reviews(
    db: Session,
    current_user_id: UUID,
    limit: int = 20,
    offset: int = 0,
):
    query = (
        db.query(
            Review.id,
            Review.user_id,
            User.username,
            User.display_name,
            User.avatar_url,
            Review.game_id,
            Game.title.label("game_title"),
            Game.cover_url.label("game_cover_url"),
            Review.title,
            Review.body,
            Review.rating,
            Review.contains_spoilers,
            Review.created_at,
        )
        .join(User, Review.user_id == User.id)
        .join(Game, Review.game_id == Game.id)
        .filter(Review.user_id != current_user_id)
        .order_by(Review.created_at.desc())
        .offset(offset)
        .limit(limit)
    )

    return query.all()


def get_suggested_users(
    db: Session,
    current_user_id: UUID,
    limit: int = 6,
):
    followed_subquery = exists().where(
        (Follow.follower_id == current_user_id)
        & (Follow.following_id == User.id)
    )

    query = (
        db.query(
            User.id,
            User.username,
            User.display_name,
            User.avatar_url,
            (~followed_subquery).label("is_following"),
        )
        .filter(
            User.id != current_user_id,
            User.is_active.is_(True),
            ~followed_subquery,
        )
        .order_by(User.created_at.desc())
        .limit(limit)
    )

    return query.all()
