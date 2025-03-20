# backend/app/schemas/receipts.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ReceiptItemBase(BaseModel):
    key_type: str
    quantity: int
    cost: float

class ReceiptItemCreate(ReceiptItemBase):
    pass

class ReceiptItemResponse(ReceiptItemBase):
    id: int

    class Config:
        orm_mode = True

class ReceiptBase(BaseModel):
    user_id: int
    image_url: str
    processed: bool = False

class ReceiptCreate(ReceiptBase):
    items: List[ReceiptItemCreate]

class ReceiptResponse(ReceiptBase):
    id: int
    created_at: Optional[datetime]
    items: List[ReceiptItemResponse] = []

    class Config:
        orm_mode = True