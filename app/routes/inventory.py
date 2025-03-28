from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from utils.db import get_async_db
from utils.auth import admin_or_locksmith, get_current_user
from models.inventory import Inventory
from models.users import User
from schemas.inventory import InventoryCreate, InventoryUpdate, InventoryResponse
from typing import List
from pydantic import BaseModel

router = APIRouter()


@router.get("", response_model=List[InventoryResponse])
async def read_inventory(
    db: AsyncSession = Depends(get_async_db),
    _user: User = Depends(admin_or_locksmith),
):
    result = await db.execute(select(Inventory))
    return result.scalars().all()


@router.post("", response_model=InventoryResponse)
async def create_inventory(
    item: InventoryCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(admin_or_locksmith),
):
    new_item = Inventory(
        key_type=item.key_type,
        quantity=item.quantity,
        threshold=item.threshold,
        added_by=current_user.id,
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item


class BulkInventoryItem(BaseModel):
    key_type: str
    quantity: int


class BulkInventoryRequest(BaseModel):
    items: List[BulkInventoryItem]


@router.post("/bulk-add")
async def bulk_add_inventory(
    data: BulkInventoryRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(admin_or_locksmith),
):
    added_items = []

    for item in data.items:
        new_item = Inventory(
            key_type=item.key_type,
            quantity=item.quantity,
            added_by=current_user.id,
        )
        db.add(new_item)
        added_items.append(new_item)

    await db.commit()
    return {"message": "Inventory updated", "items_added": len(added_items)}


@router.put("/{item_id}", response_model=InventoryResponse)
async def update_inventory(
    item_id: int,
    item: InventoryUpdate,
    db: AsyncSession = Depends(get_async_db),
    _user: User = Depends(admin_or_locksmith),
):
    result = await db.execute(select(Inventory).where(Inventory.id == item_id))
    inventory_item = result.scalar_one_or_none()

    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    if item.quantity is not None:
        inventory_item.quantity = item.quantity
    if item.threshold is not None:
        inventory_item.threshold = item.threshold

    await db.commit()
    await db.refresh(inventory_item)
    return inventory_item


@router.delete("/{item_id}")
async def delete_inventory(
    item_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Inventory).where(Inventory.id == item_id))
    inventory_item = result.scalar_one_or_none()

    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    if current_user.role != "admin" and inventory_item.added_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this item")

    await db.delete(inventory_item)
    await db.commit()
    return {"message": "Inventory item deleted successfully"}