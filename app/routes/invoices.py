from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.utils.auth import get_current_user
from app.models.users import User
from app.models.invoices import Invoice
from app.schemas.invoices import InvoiceCreate, InvoiceResponse
from app.services.invoices import (
    create_invoice,
    get_invoice_by_id,
    get_all_invoices,
    update_invoice,
    delete_invoice
)

router = APIRouter()

@router.post("/generate", response_model=InvoiceResponse)
def generate_invoice(
    invoice: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print("👤 current_user:", current_user)
    print("🧢 role:", getattr(current_user, "role", None))

    if current_user.role not in ["admin", "locksmith"]:
        raise HTTPException(status_code=403, detail="Not authorized to generate invoices")

    invoice.user_id = current_user.id
    return create_invoice(db, invoice)

@router.get("", response_model=list[InvoiceResponse])
def read_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoices = get_all_invoices(db)

    if current_user.role == "admin":
        return invoices

    if current_user.role == "locksmith":
        return [inv for inv in invoices if inv.user_id == current_user.id]

    # Owner: only show invoices where they're billed
    return [inv for inv in invoices if inv.bill_to and current_user.email.lower() in inv.bill_to.lower()]

@router.get("/{invoice_id}", response_model=InvoiceResponse)
def read_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inv = get_invoice_by_id(db, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    # Admin can view any
    if current_user.role == "admin":
        return inv

    # Locksmith can view their own
    if current_user.role == "locksmith" and inv.user_id == current_user.id:
        return inv

    # Owner can view if their email matches bill_to
    if current_user.role == "owner" and inv.bill_to and current_user.email.lower() in inv.bill_to.lower():
        return inv

    raise HTTPException(status_code=403, detail="Not authorized to view this invoice")

@router.put("/{invoice_id}/update", response_model=InvoiceResponse)
def update_invoice_route(
    invoice_id: int,
    invoice_data: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inv = get_invoice_by_id(db, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if current_user.role != "admin" and inv.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this invoice")

    return update_invoice(db, inv, invoice_data)

@router.delete("/{invoice_id}/delete")
def delete_invoice_route(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inv = get_invoice_by_id(db, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if current_user.role != "admin" and inv.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this invoice")

    delete_invoice(db, inv)
    return {"message": "Invoice deleted successfully"}
