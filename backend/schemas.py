# schemas.py
from pydantic import BaseModel, EmailStr, Field

# --- TOKEN ---
class Token(BaseModel):
    access_token: str
    token_type: str = "Bearer"

class TokenData(BaseModel):
    email: str | None = None

# --- USER ---
class UserCreate(BaseModel):
    nickname: str = Field(..., min_length=2, max_length=30)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

class UserOut(BaseModel):
    email: EmailStr
    nickname: str

class UserPasswordUpdate(BaseModel):
    new_password: str = Field(..., min_length=6, max_length=100)