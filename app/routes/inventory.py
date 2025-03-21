from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.utils.auth import admin_or_locksmith 
from app.models.inventory import Inventory
from app.schemas.inventory import InventoryCreate, InventoryUpdate, InventoryResponse

router = APIRouter()

# Ensure proper roles can view only
@router.get("", response_model=list[InventoryResponse])
def read_inventory(user: dict = Depends(admin_or_locksmith), db: Session = Depends(get_db)):
    items = db.query(Inventory).all()
    return items
# Create a new inventory record (new key type)
@router.post("", response_model=InventoryResponse)
def create_inventory(item: InventoryCreate, db: Session = Depends(get_db)):
    # Check if key type already exists, etc.
    new_item = Inventory(
        key_type=item.key_type,
        quantity=item.quantity,
        threshold=item.threshold,
        added_by=item.added_by  # assuming added_by comes from authenticated user info
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

# Read all inventory items
@router.get("", response_model=list[InventoryResponse])
def read_inventory(db: Session = Depends(get_db)):
    items = db.query(Inventory).all()
    return items

# Update an inventory record (e.g., update quantity)
@router.put("/{item_id}", response_model=InventoryResponse)
def update_inventory(item_id: int, item: InventoryUpdate, db: Session = Depends(get_db)):
    inventory_item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    # Update fields as needed; for example, adjusting quantity
    if item.quantity is not None:
        inventory_item.quantity = item.quantity
    if item.threshold is not None:
        inventory_item.threshold = item.threshold

    db.commit()
    db.refresh(inventory_item)
    return inventory_item

# Delete an inventory record
@router.delete("/{item_id}")
def delete_inventory(item_id: int, db: Session = Depends(get_db)):
    inventory_item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    db.delete(inventory_item)
    db.commit()
    return {"message": "Inventory item deleted successfully"}

