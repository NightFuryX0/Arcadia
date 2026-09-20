from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class CollectionCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
    )
    is_public: bool = True


class CollectionUpdate(BaseModel):
    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
    )
    is_public: Optional[bool] = None


class CollectionResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    description: Optional[str]
    is_public: bool

    model_config = {
        "from_attributes": True,
    }


class CollectionGameRequest(BaseModel):
    game_id: UUID
