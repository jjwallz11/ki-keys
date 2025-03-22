from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.utils.auth import create_access_token, verify_password, get_current_user
from app.utils.db import get_db
from app.models.users import User
from app.utils.errors import error_400, error_401
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from app.config import settings

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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/session/login")

@router.get("/session/current")
def session_info_route(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            error_401("Invalid token: missing subject")
    except JWTError:
        error_401("Could not validate credentials")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        error_401("User not found")

    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role
    }

@router.post("/session/logout")
def logout():
    """ Frontend should remove token upon logout request """
    return {"message": "Logout successful, please remove token on client side"}