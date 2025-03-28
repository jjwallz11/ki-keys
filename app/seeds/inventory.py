import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from utils.db import AsyncSessionLocal
from models.inventory import Inventory
from models.users import User  # Needed to fetch user ID

async def seed_inventory():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Inventory))
        if result.scalars().first():
            print("Inventory already seeded.")
            return

        user_result = await db.execute(select(User))
        user = user_result.scalars().first()
        if not user:
            print("❌ No users found. Please seed users first.")
            return

        inventory = [
            Inventory(key_type="Smart", quantity=10, threshold=5, added_by=user.id),
            Inventory(key_type="Transponder", quantity=20, threshold=10, added_by=user.id),
            Inventory(key_type="High-Security Transponder", quantity=15, threshold=7, added_by=user.id),
        ]
        db.add_all(inventory)
        await db.commit()
        print("✅ Seeded inventory data.")

async def undo_inventory():
    async with AsyncSessionLocal() as db:
        await db.execute(text("DELETE FROM inventory"))
        await db.commit()
        print("🗑️ Deleted all inventory items.")

if __name__ == "__main__":
    asyncio.run(seed_inventory())