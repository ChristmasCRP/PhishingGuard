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
    return schemas.UserOut(email=new_user["email"], nickname=new_user["nickname"])

# ---------------------------------------------------------
# LOGOWANIE
# ---------------------------------------------------------
@app.post("/login", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    print(f"\n--- PRÓBA LOGOWANIA ---")
    print(f"Wpisany login (username): '{form_data.username}'")
    print(f"Wpisane hasło: '{form_data.password}'")

    user = await crud.get_user_by_email(form_data.username)
    
    if not user:
        print("BŁĄD: Nie znaleziono użytkownika o takim emailu w bazie.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"Znaleziono usera w bazie: {user['email']}")
    print(f"Hash hasła w bazie: {user['hashed_password']}")

    is_password_correct = verify_password(form_data.password, user["hashed_password"])
    
    if not is_password_correct:
        print("BŁĄD: Hasło się nie zgadza.")
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