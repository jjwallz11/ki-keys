# app/models/receipt_items.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.utils.db import Base

class ReceiptItem(Base):
    __tablename__ = "receipt_items"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    receipt_id = Column(Integer, ForeignKey("receipts.id"), nullable=False)
    key_type = Column(String(100), nullable=False)  # e.g., "smart", "transponder", "high-security transponder"
    quantity = Column(Integer, nullable=False)
    cost = Column(Float, nullable=False)  # Cost per unit or total cost for that item