from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    game_id: UUID
    title: Optional[str] = Field(
        default=None,
        max_length=200,
    )
    body: str = Field(
        min_length=1,
        max_length=5000,
    )
    rating: Optional[float] = Field(
        default=None,
        ge=0,
        le=10,
    )
    contains_spoilers: bool = False


class ReviewUpdate(BaseModel):
    title: Optional[str] = Field(
        default=None,
        max_length=200,
    )
    body: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=5000,
    )
    rating: Optional[float] = Field(
        default=None,
        ge=0,
        le=10,
    )
    contains_spoilers: Optional[bool] = None


class ReviewResponse(BaseModel):
    id: UUID
    user_id: UUID
    game_id: UUID
    title: Optional[str]
    body: str
    rating: Optional[float]
    contains_spoilers: bool
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }
