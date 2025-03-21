from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.utils.auth import create_access_token, verify_password, get_current_user
from app.utils.db import get_db
from app.models.users import User
from app.utils.errors import error_400, error_401
from pydantic import BaseModel, EmailStr

router = APIRouter()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/session/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """ Authenticate user and return JWT token """
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        error_400("Invalid credentials")

    access_token = create_access_token({"sub": user.email})

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role
        }
    }

@router.get("/session/current")
def get_current_user_route(user: dict = Depends(get_current_user)):
    """ Retrieve currently logged-in user details """
    if not user:
        error_401("Unauthorized. Please log in.")

    return {"user": user}

@router.post("/session/logout")
def logout():
    """ Frontend should remove token upon logout request """
    return {"message": "Logout successful, please remove token on client side"}