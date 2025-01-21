from app.models import Vehicle, db

class VehicleService:
    @staticmethod
    def create_vehicle(owner_id, year, make, model, vin, key_type, price, preview_image=None, key_image=None):
        vehicle = Vehicle(
            owner_id=owner_id,
            year=year,
            make=make,
            model=model,
            vin=vin,
            key_type=key_type,
            price=price,
            preview_image=preview_image,
            key_image=key_image
        )
        db.session.add(vehicle)
        db.session.commit()
        return vehicle

    @staticmethod
    def get_vehicle_by_vin(vin):
        return Vehicle.query.filter_by(vin=vin).first()

    @staticmethod
    def get_vehicles_by_owner_id(owner_id):
        return Vehicle.query.filter_by(owner_id=owner_id).all()
    
    def get_vehicles_needing_keys():
        return Vehicle.query.filter(Vehicle.key_type.is_(None)).all()