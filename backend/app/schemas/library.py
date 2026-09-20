from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.user_game import GameStatus


class LibraryAddRequest(BaseModel):
    game_id: UUID


class LibraryUpdateRequest(BaseModel):
    status: Optional[GameStatus] = None
    rating: Optional[float] = Field(
        default=None,
        ge=0,
        le=10,
    )
    playtime_minutes: Optional[int] = Field(
        default=None,
        ge=0,
    )
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class LibraryResponse(BaseModel):
    id: UUID
    game_id: UUID
    status: GameStatus
    rating: Optional[float]
    playtime_minutes: int
    started_at: Optional[datetime]
    completed_at: Optional[datetime]

    model_config = {
        "from_attributes": True,
    }
