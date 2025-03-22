from fastapi import APIRouter, Depends, HTTPException
from app.utils.auth import get_current_user
import httpx

router = APIRouter()

NHTSA_API_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}?format=json"

async def fetch_vehicle_data(vin: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(NHTSA_API_URL.format(vin=vin))
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="NHTSA API is unavailable")
    return {item["Variable"]: item["Value"] for item in response.json().get("Results", []) if item["Value"]}

@router.get("/{vin}")
async def get_vehicle_by_vin(vin: str, user: dict = Depends(get_current_user)):
    if len(vin) != 17:
        raise HTTPException(status_code=400, detail="Invalid VIN format")

    vehicle_data = await fetch_vehicle_data(vin)

    return {
        "vin": vin,
        "make": vehicle_data.get("Make", "Unknown"),
        "model": vehicle_data.get("Model", "Unknown"),
        "year": vehicle_data.get("Model Year", "Unknown"),
        "bodyType": vehicle_data.get("Body Class", "Unknown"),
        "fuelType": vehicle_data.get("Fuel Type - Primary", "Unknown"),
        "manufacturer": vehicle_data.get("Manufacturer Name", "Unknown"),
        "plantCountry": vehicle_data.get("Plant Country", "Unknown"),
    }