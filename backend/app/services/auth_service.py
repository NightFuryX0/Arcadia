from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models import User
from app.schemas.auth import RegisterRequest


def register_user(
    db: Session,
    data: RegisterRequest,
) -> User:
    existing_username = db.scalar(
        select(User).where(User.username == data.username)
    )

    if existing_username:
        raise ValueError("Username already exists")

    existing_email = db.scalar(
        select(User).where(User.email == data.email)
    )

    if existing_email:
        raise ValueError("Email already exists")

    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
        display_name=data.display_name,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
