from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class CommunityReviewResponse(BaseModel):
    id: UUID
    user_id: UUID
    username: str
    display_name: Optional[str]
    avatar_url: Optional[str]

    game_id: UUID
    game_title: str
    game_cover_url: Optional[str]

    title: Optional[str]
    body: str
    rating: float
    contains_spoilers: bool
    created_at: datetime

    class Config:
        orm_mode = True


class SuggestedUserResponse(BaseModel):
    id: UUID
    username: str
    display_name: Optional[str]
    avatar_url: Optional[str]
    is_following: bool

    class Config:
        orm_mode = True
