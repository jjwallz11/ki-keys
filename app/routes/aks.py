# app/routes/aks.py
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.utils.db import get_async_db
from app.models.users import User
from app.utils.auth import get_current_user
from app.services.aks import import_aks_receipt
import httpx

router = APIRouter(prefix="/api/aks", tags=["aks"])

@router.post("/store-key")
async def store_aks_key(
    api_key: str = Body(...),
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    current_user.aks_api_key = api_key
    await db.commit()
    return {"message": "AKS API key saved successfully"}

@router.get("/orders")
async def get_aks_orders(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.aks_api_key:
        raise HTTPException(status_code=400, detail="No AKS API key stored")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://api.americankeysupply.com/v1/orders",
                headers={"X-Api-Key": current_user.aks_api_key}
            )
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"HTTP error: {str(e)}")

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail="Failed to fetch AKS orders"
        )

    return response.json()

@router.post("/import-latest")
async def import_latest_aks_order(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user),
):
    receipt = await import_aks_receipt(db, current_user)
    return {
        "message": "AKS order imported as receipt",
        "receipt_id": receipt.id,
        "items": [{"key_type": item.key_type, "quantity": item.quantity} for item in receipt.items],
        "source": receipt.source,
    }