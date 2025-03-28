# app/models/invoices.py
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from utils.db import Base

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    invoice_number = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bill_to = Column(String, nullable=True)
    date = Column(DateTime, nullable=False)
    terms = Column(String, nullable=True)
    due_date = Column(DateTime, nullable=False)
    total_due = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    items = relationship("InvoiceItem", back_populates="invoice", lazy="joined", cascade="all, delete-orphan")