from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class InvoiceItemBase(BaseModel):
    # Optional: include key_type if needed; otherwise, remove it.
    key_type: Optional[str] = None
    quantity: int = 1
    unit_price: float

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemResponse(InvoiceItemBase):
    id: int
    invoice_id: int
    amount: float

    class Config:
        model_config = {
        "from_attributes": True
    }

class InvoiceBase(BaseModel):
    bill_to: Optional[str] = None
    date: Optional[datetime] = None
    terms: Optional[str] = None
    due_date: Optional[datetime] = None
    total_due: Optional[float] = None

class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]

class InvoiceResponse(InvoiceBase):
    id: int
    items: List[InvoiceItemResponse] = []

    class Config:
        model_config = {
        "from_attributes": True
    }