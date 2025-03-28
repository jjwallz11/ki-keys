# app/models/receipts.py
from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from utils.db import Base

class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))  # 🔁 updated
    source = Column(String(50), nullable=True)  # ✅ new field

    items = relationship("ReceiptItem", back_populates="receipt", cascade="all, delete")

from .receipt_items import ReceiptItem  # ✅ keep this