from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.utils.auth import get_current_user
from app.models.users import User
from app.schemas.receipts import ReceiptCreate, ReceiptResponse
from app.services.receipts import create_receipt, get_receipt_by_id, process_receipt

router = APIRouter()

@router.post("/upload", response_model=ReceiptResponse)
def upload_receipt(
    receipt: ReceiptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "locksmith"]:
        raise HTTPException(status_code=403, detail="Not authorized to upload receipts")

    receipt.user_id = current_user.id
    return create_receipt(db, receipt)

@router.get("/{receipt_id}", response_model=ReceiptResponse)
def read_receipt(
    receipt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rec = get_receipt_by_id(db, receipt_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Receipt not found")

    if current_user.role != "admin" and rec.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this receipt")

    return rec

@router.post("/process/{receipt_id}", response_model=ReceiptResponse)
def process_receipt_route(
    receipt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rec = get_receipt_by_id(db, receipt_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Receipt not found")

    if current_user.role != "admin" and rec.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to process this receipt")

    return process_receipt(db, rec)