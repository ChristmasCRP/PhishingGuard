# schemas.py
from pydantic import BaseModel, EmailStr, Field

# --- TOKEN ---
class Token(BaseModel):
    access_token: str
    token_type: str = "Bearer"

class TokenData(BaseModel):
    email: str | None = None

# --- USER --
class UserCreate(BaseModel):
    nickname: str = Field(..., min_length=2, max_length=30)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

class UserOut(BaseModel):
    email: EmailStr
    nickname: str
    role: str = "user"

class UserPasswordUpdate(BaseModel):
    new_password: str = Field(..., min_length=6, max_length=100)

# --- QUIZ ---

class QuestionCreate(BaseModel):
    quiz_id: str
    content: str
    image_url: str | None = None
    options: list[str]
    correct_answer_index: int

class QuestionPublicOut(BaseModel):
    id: str
    quiz_id: str
    content: str
    image_url: str | None = None
    options: list[str]
    correct_answer_index: int

class AnswerCheck(BaseModel):
    question_id: str
    selected_index: int

class AnswerResult(BaseModel):
    is_correct: bool
    correct_index: int