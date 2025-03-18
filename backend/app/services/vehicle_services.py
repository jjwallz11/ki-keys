"""Handles vehicle-related database operations and VIN lookups."""

import requests
from app.models import Vehicle, db


class VehicleService:
    """Handles vehicle-related operations like creation and lookup."""

    @staticmethod
    def create_vehicle(
        owner_id,
        year,
        make,
        model,
        vin,
        key_type,
        price,
        preview_image=None,
        key_image=None,
    ):
        """Creates a new vehicle entry in the database."""
        vehicle = Vehicle(
            owner_id=owner_id,
            year=year,
            make=make,
            model=model,
            vin=vin,
            key_type=key_type,
            price=price,
            preview_image=preview_image,
            key_image=key_image,
        )
        db.session.add(vehicle)
        db.session.commit()
        return vehicle

    @staticmethod
    def get_vehicle_by_vin(vin):
        """Fetch a vehicle from the database. If !exist, fetch from vPIC API and store it."""
        existing_vehicle = Vehicle.query.filter_by(vin=vin).first()

        if existing_vehicle:
            return existing_vehicle

        # Fetch from external API if not in DB
        vehicle_data = VehicleService.fetch_vehicle_data(vin)
        if "error" in vehicle_data:
            return vehicle_data  # Return error response

        # Create a new vehicle entry
        new_vehicle = Vehicle(
            owner_id=None,  # No owner if auto-fetched
            year=vehicle_data["year"],
            make=vehicle_data["make"],
            model=vehicle_data["model"],
            vin=vin,
            key_type=None,  # Key type unknown
            price=None,  # No price if auto-fetched
            preview_image=None,
            key_image=None,
        )
        db.session.add(new_vehicle)
        db.session.commit()

        return new_vehicle

    @staticmethod
    def fetch_vehicle_data(vin):
        """Fetch vehicle details from the NHTSA vPIC API using a VIN."""
        api_url = f"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}?format=json"
        response = requests.get(api_url, timeout=5)

        if response.status_code != 200:
            return {
                "error": "Failed to fetch vehicle data",
                "status_code": response.status_code,
            }

        data = response.json()

        # Extract relevant fields
        vehicle_info = {"make": None, "model": None, "year": None}

        for item in data.get("Results", []):
            if item["Variable"] == "Make":
                vehicle_info["make"] = item["Value"]
            elif item["Variable"] == "Model":
                vehicle_info["model"] = item["Value"]
            elif item["Variable"] == "Model Year":
                vehicle_info["year"] = item["Value"]

        return vehicle_info

    @staticmethod
    def get_vehicles_by_owner_id(owner_id):
        """Handles getting one vic by ownerId"""
        return Vehicle.query.filter_by(owner_id=owner_id).all()

    @staticmethod
    def get_vehicles_needing_keys():
        """Handles getting vics needing keys"""
        return Vehicle.query.filter(Vehicle.key_type.is_(None)).all()
