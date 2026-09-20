from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AdminStatsResponse(BaseModel):
    users: int
    games: int
    reviews: int
    collections: int
    follows: int


class AdminActivityResponse(BaseModel):
    username: str
    action: str
    target: Optional[str]
    created_at: datetime


class AdminLibraryStatusResponse(BaseModel):
    status: str
    count: int
