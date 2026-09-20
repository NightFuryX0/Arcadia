from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class FollowResponse(BaseModel):
    id: UUID
    follower_id: UUID
    following_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}
