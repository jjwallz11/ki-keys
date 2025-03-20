from sqlalchemy.orm import Session
from app.models.inventory import Inventory
from app.schemas.inventory import InventoryCreate, InventoryUpdate

def create_inventory(db: Session, inventory_data: InventoryCreate) -> Inventory:
    """
    Create a new inventory record.
    """
    new_inventory = Inventory(
        key_type=inventory_data.key_type,
        quantity=inventory_data.quantity,
        threshold=inventory_data.threshold,
        added_by=inventory_data.added_by
    )
    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)
    return new_inventory

def get_all_inventory(db: Session):
    """
    Retrieve all inventory records.
    """
    return db.query(Inventory).all()

def update_inventory(db: Session, item_id: int, inventory_data: InventoryUpdate):
    """
    Update an existing inventory record.
    """
    inventory_item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if not inventory_item:
        return None  # The route handler can raise an HTTPException for a 404
    if inventory_data.quantity is not None:
        inventory_item.quantity = inventory_data.quantity
    if inventory_data.threshold is not None:
        inventory_item.threshold = inventory_data.threshold
    db.commit()
    db.refresh(inventory_item)
    return inventory_item

def delete_inventory(db: Session, item_id: int):
    """
    Delete an inventory record.
    """
    inventory_item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if not inventory_item:
        return None  # The route handler can raise an HTTPException for a 404
    db.delete(inventory_item)
    db.commit()
    return inventory_item