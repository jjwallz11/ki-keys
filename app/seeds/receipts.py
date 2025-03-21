# seeds/receipts.py

from datetime import datetime
from app.utils.db import SessionLocal
from app.models.receipts import Receipt
from app.models.receipt_items import ReceiptItem

def seed_receipts():
    db = SessionLocal()
    try:
        # Check if any receipt exists
        if db.query(Receipt).first():
            print("Receipts already seeded.")
            return

        # Create a receipt (simulate a scanned receipt for a reorder)
        receipt = Receipt(
            user_id=2,  # assuming locksmith user id is 2
            image_url="https://example.com/receipt.jpg",  # sample image URL
            processed=False,
            created_at=datetime.utcnow()
        )
        db.add(receipt)
        db.commit()
        db.refresh(receipt)
        
        # Create receipt items
        receipt_items_data = [
            {"key_type": "Transponder", "quantity": 5, "cost": 75.00},
            {"key_type": "Smart", "quantity": 3, "cost": 175.00},
            {"key_type": "High-Security Transponder", "quantity": 4, "cost": 75.00},
        ]
        for item_data in receipt_items_data:
            item = ReceiptItem(
                receipt_id=receipt.id,
                key_type=item_data["key_type"],
                quantity=item_data["quantity"],
                cost=item_data["cost"]
            )
            db.add(item)
        db.commit()
        print("Seeded receipt data with receipt items.")
    finally:
        db.close()
        
        

def undo_receipts():
    db = SessionLocal()
    try:
        deleted_items = db.query(ReceiptItem).delete()
        deleted_receipts = db.query(Receipt).delete()
        db.commit()
        print(f"Deleted {deleted_items} receipt items and {deleted_receipts} receipts.")
    finally:
        db.close()
        
        
if __name__ == "__main__":
    seed_receipts()