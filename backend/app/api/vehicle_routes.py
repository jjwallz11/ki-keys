from fastapi import FastAPI, HTTPException
import httpx  # Used for making async requests

app = FastAPI()

NHTSA_API_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}?format=json"

@app.get("/api/vehicles/{vin}")
async def get_vehicle_by_vin(vin: str):
    if len(vin) != 17:
        raise HTTPException(status_code=400, detail="Invalid VIN format. VIN must be 17 characters.")

    async with httpx.AsyncClient() as client:
        response = await client.get(NHTSA_API_URL.format(vin=vin))

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="NHTSA API is unavailable. Please try again later.")

    data = response.json()
    
    # Extract relevant vehicle details
    vehicle_info = {item["Variable"]: item["Value"] for item in data["Results"] if item["Value"]}

    return {
        "vin": vin,
        "make": vehicle_info.get("Make", "Unknown"),
        "model": vehicle_info.get("Model", "Unknown"),
        "year": vehicle_info.get("Model Year", "Unknown"),
        "bodyType": vehicle_info.get("Body Class", "Unknown"),
        "fuelType": vehicle_info.get("Fuel Type - Primary", "Unknown"),
        "manufacturer": vehicle_info.get("Manufacturer Name", "Unknown"),
        "plantCountry": vehicle_info.get("Plant Country", "Unknown"),
    }