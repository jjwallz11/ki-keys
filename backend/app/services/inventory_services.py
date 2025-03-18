# app/services/inventory_service.py
from app.models import Inventory, db, Vehicle

class InventoryService:
    @staticmethod
    def check_stock(key_type):
        return Inventory.query.filter_by(key_type=key_type).first()

    @staticmethod
    def update_stock(key_type, quantity):
        inventory = Inventory.query.filter_by(key_type=key_type).first()
        if inventory:
            inventory.quantity += quantity
            db.session.commit()
        else:
            inventory = Inventory(key_type=key_type, quantity=quantity)
            db.session.add(inventory)
            db.session.commit()
        return inventory
    

    def assign_key_type_service(vehicle_id, key_type):
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return {"error": "Vehicle not found"}

        vehicle.key_type = key_type
        db.session.commit()
        return {"message": "Key type assigned successfully", "vehicle": vehicle.to_dict()}