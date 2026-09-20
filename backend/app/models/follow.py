import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import CheckConstraint, DateTime, ForeignKey, UniqueConstraint
from app.database.base import Base


class Follow(Base):
    __tablename__ = "follows"

    __table_args__ = (
        UniqueConstraint(
            "follower_id",
            "following_id",
            name="uq_follower_following",
        ),
        CheckConstraint(
            "follower_id != following_id",
            name="ck_no_self_follow",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    follower_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    following_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
