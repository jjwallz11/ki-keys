from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class InvoiceItemBase(BaseModel):
    # Optional: include key_type if needed; otherwise, remove it.
    key_type: Optional[str] = None
    date: Optional[datetime] = None
    description: Optional[str] = None
    details: Optional[str] = None
    quantity: int = 1
    unit_price: float
    amount: float

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemResponse(InvoiceItemBase):
    id: int
    invoice_id: int

    class Config:
        model_config = {
        "from_attributes": True
    }

class InvoiceBase(BaseModel):
    invoice_number: str
    user_id: int
    bill_to: Optional[str] = None
    date: datetime
    terms: Optional[str] = None
    due_date: datetime
    total_due: float = 0.0

class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]

class InvoiceResponse(InvoiceBase):
    id: int
    items: List[InvoiceItemResponse] = []

    class Config:
        model_config = {
        "from_attributes": True
    }