from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import (
    Collection,
    Follow,
    Game,
    Review,
    User,
    UserGame,
)


def get_admin_stats(db: Session):
    return {
        "users": db.query(func.count(User.id)).scalar() or 0,
        "games": db.query(func.count(Game.id)).scalar() or 0,
        "reviews": db.query(func.count(Review.id)).scalar() or 0,
        "collections": db.query(func.count(Collection.id)).scalar() or 0,
        "follows": db.query(func.count(Follow.id)).scalar() or 0,
    }


def get_admin_activity(db: Session, limit: int = 20):
    activities = []

    reviews = (
        db.query(
            Review.created_at,
            User.username,
            Game.title,
        )
        .join(User, Review.user_id == User.id)
        .join(Game, Review.game_id == Game.id)
        .order_by(Review.created_at.desc())
        .limit(limit)
        .all()
    )

    for created_at, username, game_title in reviews:
        activities.append(
            {
                "username": username,
                "action": "posted a review",
                "target": game_title,
                "created_at": created_at,
            }
        )

    library_entries = (
        db.query(
            UserGame.created_at,
            User.username,
            Game.title,
        )
        .join(User, UserGame.user_id == User.id)
        .join(Game, UserGame.game_id == Game.id)
        .order_by(UserGame.created_at.desc())
        .limit(limit)
        .all()
    )

    for created_at, username, game_title in library_entries:
        activities.append(
            {
                "username": username,
                "action": "added a game to their library",
                "target": game_title,
                "created_at": created_at,
            }
        )

    collections = (
        db.query(
            Collection.created_at,
            User.username,
            Collection.name,
        )
        .join(User, Collection.user_id == User.id)
        .order_by(Collection.created_at.desc())
        .limit(limit)
        .all()
    )

    for created_at, username, collection_name in collections:
        activities.append(
            {
                "username": username,
                "action": "created a collection",
                "target": collection_name,
                "created_at": created_at,
            }
        )

    activities.sort(
        key=lambda activity: activity["created_at"],
        reverse=True,
    )

    return activities[:limit]


def get_library_statuses(db: Session):
    rows = (
        db.query(
            UserGame.status,
            func.count(UserGame.id),
        )
        .group_by(UserGame.status)
        .order_by(func.count(UserGame.id).desc())
        .all()
    )

    return [
        {
            "status": status.value if hasattr(status, "value") else str(status),
            "count": count,
        }
        for status, count in rows
    ]
