# backend/app/routes/receipts.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.schemas.receipts import ReceiptCreate, ReceiptResponse
from app.services.receipts import create_receipt, get_receipt_by_id, process_receipt

router = APIRouter()

@router.post("/receipts/upload", response_model=ReceiptResponse)
def upload_receipt(receipt: ReceiptCreate, db: Session = Depends(get_db)):
    new_receipt = create_receipt(db, receipt)
    return new_receipt

@router.get("/receipts/{receipt_id}", response_model=ReceiptResponse)
def read_receipt(receipt_id: int, db: Session = Depends(get_db)):
    rec = get_receipt_by_id(db, receipt_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return rec

@router.post("/receipts/process/{receipt_id}", response_model=ReceiptResponse)
def process_receipt_route(receipt_id: int, db: Session = Depends(get_db)):
    rec = get_receipt_by_id(db, receipt_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Receipt not found")
    processed_receipt = process_receipt(db, rec)
    return processed_receipt