# app/services/receipts.py
from sqlalchemy.orm import Session
from app.models.receipts import Receipt
from app.models.receipt_items import ReceiptItem
from app.schemas.receipts import ReceiptCreate
from typing import Optional

def create_receipt(db: Session, receipt_data: ReceiptCreate) -> Receipt:
    """
    Create a new receipt along with its items.
    """
    receipt = Receipt(
        user_id=receipt_data.user_id,
        image_url=receipt_data.image_url,
        processed=False
    )
    db.add(receipt)
    db.commit()
    db.refresh(receipt)
    
    for item in receipt_data.items:
        receipt_item = ReceiptItem(
            receipt_id=receipt.id,
            key_type=item.key_type,
            quantity=item.quantity,
            cost=item.cost
        )
        db.add(receipt_item)
    db.commit()
    # Optionally refresh or query the receipt again to include items
    return receipt

def get_receipt_by_id(db: Session, receipt_id: int) -> Optional[Receipt]:
    """
    Retrieve a receipt by its ID.
    """
    return db.query(Receipt).filter(Receipt.id == receipt_id).first()

def process_receipt(db: Session, receipt: Receipt) -> Receipt:
    """
    Process a receipt. For example, mark it as processed.
    You can add logic here to update inventory based on receipt items.
    """
    receipt.processed = True
    db.commit()
    db.refresh(receipt)
    return receipt