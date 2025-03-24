from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ReceiptItemBase(BaseModel):
    key_type: str
    quantity: int

class ReceiptItemCreate(ReceiptItemBase):
    pass

class ReceiptItemResponse(ReceiptItemBase):
    id: int

    class Config:
        model_config = {
            "from_attributes": True
        }

class ReceiptBase(BaseModel):
    processed: bool = False
    source: Optional[str] = None 

class ReceiptCreate(ReceiptBase):
    items: List[ReceiptItemCreate]

class ReceiptResponse(ReceiptBase):
    id: int
    created_at: Optional[datetime]
    items: List[ReceiptItemResponse] = []

    class Config:
        model_config = {
            "from_attributes": True
        }