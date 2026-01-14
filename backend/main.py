# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

import crud
import schemas
import auth
from auth import ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user, verify_password 

app = FastAPI(title="PhishGuard User API")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# REJESTRACJA
# ---------------------------------------------------------
@app.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
async def register_user(user: schemas.UserCreate):
    print(f"--- PRÓBA REJESTRACJI ---")
    print(f"Email: {user.email}, Nick: {user.nickname}")

    new_user = await crud.create_user(user)
    
    if new_user is None:
        print("BŁĄD: Taki email już istnieje w bazie!")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )
    
    print("SUKCES: Użytkownik utworzony.")
    return schemas.UserOut(email=new_user["email"], nickname=new_user["nickname"], role=new_user.get("role", "user"))

# ---------------------------------------------------------
# LOGOWANIE
# ---------------------------------------------------------
@app.post("/login", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    print(f"\n--- PRÓBA LOGOWANIA ---")
    print(f"Wpisany login (username): '{form_data.username}'")

    user = await crud.get_user_by_email(form_data.username)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    is_password_correct = verify_password(form_data.password, user["hashed_password"])
    
    if not is_password_correct:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print("SUKCES: Hasło poprawne, generuję token.")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "Bearer"}

@app.get("/users/me", response_model=schemas.UserOut)
async def read_users_me(current_user: schemas.UserOut = Depends(get_current_user)):
    return current_user

@app.put("/users/me/password", status_code=status.HTTP_200_OK)
async def change_password(
    password_data: schemas.UserPasswordUpdate,
    current_user: schemas.UserOut = Depends(get_current_user)
):
    success = await crud.update_user_password(current_user.email, password_data.new_password)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update password")
    return {"message": "Password updated successfully"}

@app.delete("/users/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_account(current_user: schemas.UserOut = Depends(get_current_user)):
    success = await crud.delete_user(current_user.email)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete account")
    return


# ========================================================== #
#                        QUIZ API                            #
# ========================================================== #

# 1. ADMIN: Dodawanie pytania
@app.post("/admin/quiz", status_code=status.HTTP_201_CREATED)
async def add_question(
    question: schemas.QuestionCreate,
    admin: schemas.UserOut = Depends(auth.get_current_admin)
):
    q_id = await crud.create_question(question)
    return {"message": "Question added", "id": q_id}

# 2. ADMIN: Usuwanie pytania
@app.delete("/admin/quiz/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_question(
    question_id: str,
    admin: schemas.UserOut = Depends(auth.get_current_admin)
):
    success = await crud.delete_question(question_id)
    if not success:
        raise HTTPException(status_code=404, detail="Question not found")
    return

# 3. ADMIN: Edycja pytania
@app.put("/admin/quiz/{question_id}")
async def edit_question(
    question_id: str,
    question_data: schemas.QuestionCreate,
    admin: schemas.UserOut = Depends(auth.get_current_admin)
):
    success = await crud.update_question(question_id, question_data)
    if not success:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"message": "Question updated"}

# 4. PUBLIC: Pobieranie listy pytań (bez poprawnej odpowiedzi)
@app.get("/quiz", response_model=list[schemas.QuestionPublicOut])
async def get_quiz_questions():
    return await crud.get_all_questions()

# 5. USER: Sprawdzanie odpowiedzi
@app.post("/quiz/check", response_model=schemas.AnswerResult)
async def check_my_answer(
    answer: schemas.AnswerCheck,
    user: schemas.UserOut = Depends(auth.get_current_user)
):
    result = await crud.check_answer(answer.question_id, answer.selected_index)
    if result is None:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return result