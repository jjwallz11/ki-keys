from typing import List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from models.users import User
from models.receipts import Receipt
from models.receipt_items import ReceiptItem
from datetime import datetime, timezone
import httpx

AKS_API_URL = "https://api.americankeysupply.com/v1/orders"

async def fetch_aks_orders(api_key: str) -> List[Dict]:
    headers = {"Authorization": f"Bearer {api_key}"}
    async with httpx.AsyncClient() as client:
        response = await client.get(AKS_API_URL, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to fetch AKS orders")
    return response.json().get("data", [])

def extract_items_from_order(order: Dict) -> List[Dict[str, int]]:
    # Customize this based on AKS response structure
    items = []
    for product in order.get("products", []):
        description = product.get("description", "").lower()
        quantity = product.get("quantity", 1)

        if "smart" in description:
            key_type = "smart"
        elif "high-security" in description:
            key_type = "high-security transponder"
        elif "transponder" in description:
            key_type = "transponder"
        else:
            continue  # Skip irrelevant items

        items.append({"key_type": key_type, "quantity": quantity})
    return items

async def import_aks_receipt(db: AsyncSession, user: User) -> Receipt:
    if not user.aks_api_key:
        raise HTTPException(status_code=400, detail="AKS API key not found for user")

    orders = await fetch_aks_orders(user.aks_api_key)
    if not orders:
        raise HTTPException(status_code=404, detail="No AKS orders found")

    # Pick the most recent order
    latest_order = orders[0]
    items_data = extract_items_from_order(latest_order)
    if not items_data:
        raise HTTPException(status_code=400, detail="No relevant keys found in order")

    receipt = Receipt(
        user_id=user.id,
        created_at=datetime.now(timezone.utc),
        source="aks"
    )
    db.add(receipt)
    await db.commit()
    await db.refresh(receipt)

    for item in items_data:
        db.add(ReceiptItem(
            receipt_id=receipt.id,
            key_type=item["key_type"],
            quantity=item["quantity"]
        ))

    await db.commit()
    return receipt