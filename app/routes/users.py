# app/api/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.utils.errors import error_400, error_404
from app.models.users import User
from app.services.users import create_user, update_user, delete_user, get_user_by_id
from app.schemas.users import UserCreate, UserResponse, UserUpdate
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
def update_user_route(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        error_404("User not found")
    updated_user = update_user(db, db_user, user)
    return updated_user

@router.delete("/{user_id}")
def delete_user_route(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        error_404("User not found")
    delete_user(db, db_user)
    return {"message": "User account deleted successfully"}