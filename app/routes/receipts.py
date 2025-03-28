from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from utils.db import get_async_db
from utils.auth import get_current_user
from models.users import User
from services.receipts import extract_keys_from_pdf  # this should remain async

router = APIRouter()

@router.post("/upload-pdf")
async def upload_receipt_pdf(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "locksmith"]:
        raise HTTPException(status_code=403, detail="Not authorized to upload receipts")
    
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Extract key_type & quantity from the PDF
    key_data = await extract_keys_from_pdf(file)

    # Optional next steps (you can wire this in now or later):
    # - Create a Receipt linked to `current_user`
    # - Create ReceiptItems for each item in `key_data`
    # - Commit to DB

    return {"message": "PDF processed", "items": key_data}