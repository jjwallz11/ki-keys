# app/schemas/inventory.py
from pydantic import BaseModel
from typing import Optional

class InventoryBase(BaseModel):
    key_type: str
    quantity: int
    threshold: int

class InventoryCreate(InventoryBase):
    added_by: int

class InventoryUpdate(BaseModel):
    quantity: Optional[int] = None
    threshold: Optional[int] = None

class InventoryResponse(InventoryBase):
    id: int
    added_by: int

    class Config:
        model_config = {
        "from_attributes": True
    }