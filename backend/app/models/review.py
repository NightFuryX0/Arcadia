import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Review(Base):
    __tablename__ = "reviews"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "game_id",
            name="uq_user_game_review",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    game_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("games.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[Optional[str]] = mapped_column(
        String(200),
        nullable=True,
    )

    body: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    rating: Mapped[Optional[float]] = mapped_column(
        Numeric(3, 1),
        nullable=True,
    )

    contains_spoilers: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
