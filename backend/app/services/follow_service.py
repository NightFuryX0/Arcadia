from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Follow, User


def follow_user(
    db: Session,
    follower_id,
    following_id,
) -> Follow:
    if follower_id == following_id:
        raise ValueError("You cannot follow yourself")

    target_user = db.scalar(
        select(User).where(User.id == following_id)
    )

    if not target_user:
        raise ValueError("User not found")

    existing_follow = db.scalar(
        select(Follow).where(
            Follow.follower_id == follower_id,
            Follow.following_id == following_id,
        )
    )

    if existing_follow:
        raise ValueError("You are already following this user")

    follow = Follow(
        follower_id=follower_id,
        following_id=following_id,
    )

    db.add(follow)
    db.commit()
    db.refresh(follow)

    return follow


def unfollow_user(
    db: Session,
    follower_id,
    following_id,
) -> None:
    follow = db.scalar(
        select(Follow).where(
            Follow.follower_id == follower_id,
            Follow.following_id == following_id,
        )
    )

    if not follow:
        raise ValueError("You are not following this user")

    db.delete(follow)
    db.commit()
