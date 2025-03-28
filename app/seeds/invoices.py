# app/seeds/invoices.py
import asyncio
from datetime import datetime
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from utils.db import AsyncSessionLocal
from models.users import User
from models.invoices import Invoice
from models.invoice_items import InvoiceItem

async def seed_invoices():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Invoice))
        if result.scalars().first():
            print("Invoices already seeded.")
            return

        user_result = await db.execute(select(User))
        user = user_result.scalars().first()
        if not user:
            print("❌ No users found. Please seed users first.")
            return

        invoice = Invoice(
            invoice_number="3916",
            user_id=user.id,
            bill_to="Repossession Services of AZ, LLC",
            date=datetime(2024, 3, 4),
            terms="Net 15",
            due_date=datetime(2024, 3, 19),
            total_due=975.00
        )
        db.add(invoice)
        await db.commit()
        await db.refresh(invoice)

        items_data = [
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

        for item in items_data:
            db.add(InvoiceItem(
                invoice_id=invoice.id,
                key_type=item["key_type"],
                quantity=item["quantity"],
                unit_price=item["unit_price"],
                amount=item["quantity"] * item["unit_price"]
            ))

        await db.commit()
        print("✅ Seeded invoice and invoice items.")

async def undo_invoices():
    async with AsyncSessionLocal() as db:
        await db.execute(text("DELETE FROM invoice_items"))
        await db.execute(text("DELETE FROM invoices"))
        await db.commit()
        print("🗑️ Deleted all invoice items and invoices.")

if __name__ == "__main__":
    asyncio.run(seed_invoices())