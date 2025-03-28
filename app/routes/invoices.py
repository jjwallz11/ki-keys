from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from utils.db import get_async_db
from utils.auth import get_current_user
from models.users import User
from models.invoices import Invoice
from schemas.invoices import InvoiceCreate, InvoiceResponse
from services.invoices import (
    create_invoice,
    get_invoice_by_id,
    get_all_invoices,
    update_invoice,
    delete_invoice
)

router = APIRouter()

@router.post("/generate", response_model=InvoiceResponse)
async def generate_invoice(
    invoice: InvoiceCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "locksmith"]:
        raise HTTPException(status_code=403, detail="Not authorized to generate invoices")

    return await create_invoice(db, invoice, user_id=current_user.id)


@router.get("", response_model=list[InvoiceResponse])
async def read_invoices(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    invoices = await get_all_invoices(db)

    if current_user.role == "admin":
        return invoices

    if current_user.role == "locksmith":
        return [inv for inv in invoices if inv.user_id == current_user.id]

    return [inv for inv in invoices if inv.bill_to and current_user.email.lower() in inv.bill_to.lower()]


@router.get("/{invoice_id}", response_model=InvoiceResponse)
async def read_invoice(
    invoice_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    inv = await get_invoice_by_id(db, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if current_user.role == "admin":
        return inv

    if current_user.role == "locksmith" and inv.user_id == current_user.id:
        return inv

    if current_user.role == "owner" and inv.bill_to and current_user.email.lower() in inv.bill_to.lower():
        return inv

    raise HTTPException(status_code=403, detail="Not authorized to view this invoice")


@router.put("/{invoice_id}/update", response_model=InvoiceResponse)
async def update_invoice_route(
    invoice_id: int,
    invoice_data: InvoiceCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    inv = await get_invoice_by_id(db, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if current_user.role != "admin" and inv.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this invoice")

    return await update_invoice(db, inv, invoice_data)


@router.delete("/{invoice_id}/delete")
async def delete_invoice_route(
    invoice_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_user)
):
    inv = await get_invoice_by_id(db, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if current_user.role != "admin" and inv.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this invoice")

    await delete_invoice(db, inv)
    return {"message": "Invoice deleted successfully"}