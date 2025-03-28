# app/models/receipt_items.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from utils.db import Base

class ReceiptItem(Base):
    __tablename__ = "receipt_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    receipt_id = Column(Integer, ForeignKey("receipts.id"), nullable=False)
    key_type = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)

    receipt = relationship("Receipt", back_populates="items")