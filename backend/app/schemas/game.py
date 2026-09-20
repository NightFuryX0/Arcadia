from datetime import date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GameCreate(BaseModel):
    external_id: Optional[str] = None
    title: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=250)
    description: Optional[str] = None
    cover_url: Optional[str] = None
    release_date: Optional[date] = None
    developer: Optional[str] = Field(default=None, max_length=200)
    publisher: Optional[str] = Field(default=None, max_length=200)


class GameResponse(BaseModel):
    id: UUID
    external_id: Optional[str]
    title: str
    slug: str
    description: Optional[str]
    cover_url: Optional[str]
    release_date: Optional[date]
    developer: Optional[str]
    publisher: Optional[str]

    model_config = ConfigDict(from_attributes=True)
