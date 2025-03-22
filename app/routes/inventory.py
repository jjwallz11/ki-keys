from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.utils.auth import admin_or_locksmith, get_current_user
from app.models.inventory import Inventory
from app.models.users import User
from app.schemas.inventory import InventoryCreate, InventoryUpdate, InventoryResponse

router = APIRouter()

# View all inventory - Admins & Locksmiths
@router.get("", response_model=list[InventoryResponse])
def read_inventory(
    db: Session = Depends(get_db),
    _user: User = Depends(admin_or_locksmith)
):
    return db.query(Inventory).all()

# Create a new inventory item - Admins & Locksmiths
@router.post("", response_model=InventoryResponse)
def create_inventory(
    item: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_or_locksmith)
):
    new_item = Inventory(
        key_type=item.key_type,
        quantity=item.quantity,
        threshold=item.threshold,
        added_by=current_user.id
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

# Update inventory - Admins & Locksmiths
@router.put("/{item_id}", response_model=InventoryResponse)
def update_inventory(
    item_id: int,
    item: InventoryUpdate,
    db: Session = Depends(get_db),
    _user: User = Depends(admin_or_locksmith)
):
    inventory_item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    if item.quantity is not None:
        inventory_item.quantity = item.quantity
    if item.threshold is not None:
        inventory_item.threshold = item.threshold

    db.commit()
    db.refresh(inventory_item)
    return inventory_item

# Delete inventory - Admin only
@router.delete("/{item_id}")
def delete_inventory(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inventory_item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    # Admins can delete anything; locksmiths can delete their own items only
    if current_user.role != "admin" and inventory_item.added_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this item")

    db.delete(inventory_item)
    db.commit()
    return {"message": "Inventory item deleted successfully"}