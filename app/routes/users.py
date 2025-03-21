# app/api/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.utils.errors import error_400, error_404
from app.models.users import User
from app.services.users import create_user, update_user, delete_user, get_user_by_id
from app.schemas.users import UserCreate, UserResponse, UserUpdate
from app.utils.auth import oauth2_scheme
from jose import JWTError, jwt
from app.config import settings
from typing import List

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        error_400("Email already registered")
    new_user = create_user(db, user)
    return new_user

@router.get("", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.get("/{user_id}", response_model=UserResponse)
def get_single_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        error_404("User not found")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user_route(
    user_id: int, 
    user: UserUpdate, 
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
):
    # Decode JWT to get the authenticated user's email
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_email: str = payload.get("sub")
        if not user_email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    # Get the user from the database
    db_user = db.query(User).filter(User.email == user_email).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Check if the logged-in user is trying to update their own profile
    if db_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this user")

    # Apply updates
    if user.first_name: db_user.first_name = user.first_name
    if user.last_name: db_user.last_name = user.last_name
    if user.company: db_user.company = user.company
    if user.phone: db_user.phone = user.phone
    if user.email: db_user.email = user.email  # Allow email update if needed

    db.commit()
    db.refresh(db_user)

    return db_user

@router.delete("/{user_id}")
def delete_user_route(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        error_404("User not found")
    delete_user(db, db_user)
    return {"message": "User account deleted successfully"}