# app/services/inventory.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.inventory import Inventory
from app.schemas.inventory import InventoryCreate, InventoryUpdate

async def create_inventory(db: AsyncSession, inventory_data: InventoryCreate) -> Inventory:
    new_inventory = Inventory(
        key_type=inventory_data.key_type,
        quantity=inventory_data.quantity,
        threshold=inventory_data.threshold,
        added_by=inventory_data.added_by
    )
    db.add(new_inventory)
    await db.commit()
    await db.refresh(new_inventory)
    return new_inventory

async def get_all_inventory(db: AsyncSession) -> list[Inventory]:
    result = await db.execute(select(Inventory))
    return result.scalars().all()

async def update_inventory(db: AsyncSession, item_id: int, inventory_data: InventoryUpdate) -> Inventory | None:
    result = await db.execute(select(Inventory).where(Inventory.id == item_id))
    inventory_item = result.scalar_one_or_none()
    if not inventory_item:
        return None

    if inventory_data.quantity is not None:
        inventory_item.quantity = inventory_data.quantity
    if inventory_data.threshold is not None:
        inventory_item.threshold = inventory_data.threshold

    await db.commit()
    await db.refresh(inventory_item)
    return inventory_item

async def delete_inventory(db: AsyncSession, item_id: int) -> Inventory | None:
    result = await db.execute(select(Inventory).where(Inventory.id == item_id))
    inventory_item = result.scalar_one_or_none()
    if not inventory_item:
        return None

    await db.delete(inventory_item)
    await db.commit()
    return inventory_item
