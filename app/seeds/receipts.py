# app/seeds/receipts.py
import asyncio
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.utils.db import AsyncSessionLocal
from app.models.receipts import Receipt
from app.models.receipt_items import ReceiptItem

async def seed_receipts():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Receipt))
        if result.scalars().first():
            print("Receipts already seeded.")
            return

        receipt = Receipt(
            user_id=2,  # assuming user 2 is a locksmith
            created_at=datetime.now(timezone.utc),  # 🔁 updated
            source="transponder"  # ✅ new field
        )
        db.add(receipt)
        await db.commit()
        await db.refresh(receipt)

        receipt_items_data = [
            {"key_type": "transponder", "quantity": 5},
            {"key_type": "smart", "quantity": 3},
            {"key_type": "high-security transponder", "quantity": 4},
        ]

        for item_data in receipt_items_data:
            db.add(ReceiptItem(
                receipt_id=receipt.id,
                key_type=item_data["key_type"],
                quantity=item_data["quantity"]
            ))

        await db.commit()
        print("✅ Seeded receipt with receipt items.")

async def undo_receipts():
    async with AsyncSessionLocal() as db:
        await db.execute("DELETE FROM receipt_items")
        await db.execute("DELETE FROM receipts")
        await db.commit()
        print("🗑️ Deleted all receipts and receipt items.")

if __name__ == "__main__":
    asyncio.run(seed_receipts())