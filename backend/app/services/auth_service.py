from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.security import verify_password, create_access_token
from app.core.security import hash_password
from app.models import User
from app.schemas.auth import RegisterRequest


def login_user(
    db: Session,
    email: str,
    password: str,
) -> str:
    user = db.scalar(
        select(User).where(User.email == email)
    )

    if not user:
        raise ValueError("Invalid email or password")

    if not verify_password(password, user.password_hash):
        raise ValueError("Invalid email or password")

    return create_access_token(str(user.id))


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


def login_user(
    db: Session,
    email: str,
    password: str,
) -> str:
    user = db.scalar(
        select(User).where(User.email == email)
    )

    if not user:
        raise ValueError("Invalid email or password")

    if not verify_password(password, user.password_hash):
        raise ValueError("Invalid email or password")

    return create_access_token(str(user.id))
