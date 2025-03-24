# app/seeds/inventory.py
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.utils.db import AsyncSessionLocal
from app.models.inventory import Inventory

async def seed_inventory():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Inventory))
        if result.scalars().first():
            print("Inventory already seeded.")
            return

        inventory = [
            Inventory(key_type="Smart", quantity=10, threshold=5, added_by=1),
            Inventory(key_type="Transponder", quantity=20, threshold=10, added_by=1),
            Inventory(key_type="High-Security Transponder", quantity=15, threshold=7, added_by=1),
        ]
        db.add_all(inventory)
        await db.commit()
        print("✅ Seeded inventory data.")

async def undo_inventory():
    async with AsyncSessionLocal() as db:
        await db.execute("DELETE FROM inventory")
        await db.commit()
        print("🗑️ Deleted all inventory items.")

if __name__ == "__main__":
    asyncio.run(seed_inventory())