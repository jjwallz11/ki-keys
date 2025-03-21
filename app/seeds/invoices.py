# seeds/invoices.py

from datetime import datetime, timedelta
from app.utils.db import SessionLocal
from app.models.invoices import Invoice
from app.models.invoice_items import InvoiceItem

def seed_invoices():
    db = SessionLocal()
    try:
        # Check if any invoice exists
        if db.query(Invoice).first():
            print("Invoices already seeded.")
            return

        # Create an invoice
        invoice = Invoice(
            invoice_number="3916",  # example invoice number
            user_id=2,              # assuming locksmith user id is 2 from seed_users.py
            bill_to="Repossession Services of AZ, LLC",
            date=datetime(2024, 3, 4),
            terms="Net 15",
            due_date=datetime(2024, 3, 19),
            total_due=975.00
        )
        db.add(invoice)
        db.commit()
        db.refresh(invoice)
        
        # Create related invoice items
        invoice_items_data = [
            {"key_type": "Smart", "quantity": 1, "unit_price": 175.00},
            {"key_type": "Transponder", "quantity": 1, "unit_price": 75.00},
            {"key_type": "High-Security Transponder", "quantity": 1, "unit_price": 75.00},
            {"key_type": "Transponder", "quantity": 1, "unit_price": 75.00},
            {"key_type": "High-Security Transponder", "quantity": 1, "unit_price": 75.00},
            {"key_type": "Smart", "quantity": 1, "unit_price": 175.00},
            {"key_type": "High-Security Transponder", "quantity": 1, "unit_price": 75.00},
            {"key_type": "High-Security Transponder", "quantity": 1, "unit_price": 75.00},
            {"key_type": "Smart", "quantity": 1, "unit_price": 175.00},
        ]
        for item_data in invoice_items_data:
            item = InvoiceItem(
                invoice_id=invoice.id,
                key_type=item_data["key_type"],
                quantity=item_data["quantity"],
                unit_price=item_data["unit_price"],
                amount=item_data["quantity"] * item_data["unit_price"]
            )
            db.add(item)
        db.commit()
        print("Seeded invoice data with invoice items.")
    finally:
        db.close()
        

def undo_invoices():
    db = SessionLocal()
    try:
        deleted_items = db.query(InvoiceItem).delete()
        deleted_invoices = db.query(Invoice).delete()
        db.commit()
        print(f"Deleted {deleted_items} invoice items and {deleted_invoices} invoices.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_invoices()