# seeds/inventory.py

from app.utils.db import SessionLocal
from app.models.inventory import Inventory

def seed_inventory():
    db = SessionLocal()
    try:
        # Assuming admin user (id=1) exists from seed_users.py
        existing = db.query(Inventory).first()
        if existing:
            print("Inventory already seeded.")
            return

        inventory_items = [
            Inventory(key_type="Smart", quantity=10, threshold=5, added_by=1),
            Inventory(key_type="Transponder", quantity=20, threshold=10, added_by=1),
            Inventory(key_type="High-Security Transponder", quantity=15, threshold=7, added_by=1)
        ]
        db.add_all(inventory_items)
        db.commit()
        print("Seeded inventory data.")
    finally:
        db.close()
        
def undo_inventory():
    db = SessionLocal()
    try:
        deleted_items = db.query(InventoryItem).delete()
        deleted_inventory = db.query(Inventory).delete()
        db.commit()
        print(f"Deleted {deleted_items} inventory items and {deleted_inventory} inventory.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_inventory()