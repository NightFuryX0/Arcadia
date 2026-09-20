from pydantic import BaseModel, EmailStr, Field
from uuid import UUID


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=30)

    email: EmailStr

    password: str = Field(min_length=8, max_length=128)

    display_name: str = Field(min_length=1, max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr

    password: str


class UserResponse(BaseModel):
    id: UUID

    username: str

    email: EmailStr

    display_name: str

    model_config = {
        "from_attributes": True,
    }


class TokenResponse(BaseModel):
    access_token: str

    token_type: str
