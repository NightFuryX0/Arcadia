import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class GameStatus(str, Enum):
    BACKLOG = "backlog"
    PLAYING = "playing"
    COMPLETED = "completed"
    DROPPED = "dropped"
    ON_HOLD = "on_hold"


class UserGame(Base):
    __tablename__ = "user_games"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "game_id",
            name="uq_user_game",
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

    status: Mapped[GameStatus] = mapped_column(
        default=GameStatus.BACKLOG,
        nullable=False,
    )

    rating: Mapped[Optional[float]] = mapped_column(
        Numeric(3, 1),
        nullable=True,
    )

    playtime_minutes: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    started_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
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
