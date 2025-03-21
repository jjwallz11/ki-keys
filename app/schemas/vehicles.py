# app/schemas/vehicles.py

from pydantic import BaseModel, constr
from typing import Optional

class VehicleResponse(BaseModel):
    vin: constr(min_length=17, max_length=17)
    make: Optional[str] = "Unknown"
    model: Optional[str] = "Unknown"
    year: Optional[int] = None
    bodyType: Optional[str] = "Unknown"
    fuelType: Optional[str] = "Unknown"
    manufacturer: Optional[str] = "Unknown"
    plantCountry: Optional[str] = "Unknown"

    class Config:
        model_config = {
        "from_attributes": True
    }