from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    display_name: str = Field(min_length=1, max_length=100)


class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    display_name: str

    model_config = {
        "from_attributes": True,
    }
