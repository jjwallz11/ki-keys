from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.schemas.invoices import InvoiceCreate, InvoiceResponse
from app.services.invoices import create_invoice, get_invoice_by_id, get_all_invoices, update_invoice, delete_invoice

router = APIRouter()

@router.post("/generate", response_model=InvoiceResponse)
def generate_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db)):
    new_invoice = create_invoice(db, invoice)
    return new_invoice

@router.get("", response_model=list[InvoiceResponse])
def read_invoices(db: Session = Depends(get_db)):
    return get_all_invoices(db)

@router.get("/{invoice_id}", response_model=InvoiceResponse)
def read_invoice(invoice_id: int, db: Session = Depends(get_db)):
    inv = get_invoice_by_id(db, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return inv

@router.put("/{invoice_id}/update", response_model=InvoiceResponse)
def update_invoice_route(invoice_id: int, invoice_data: InvoiceCreate, db: Session = Depends(get_db)):
    inv = get_invoice_by_id(db, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    updated_inv = update_invoice(db, inv, invoice_data)
    return updated_inv

@router.delete("/{invoice_id}/delete")
def delete_invoice_route(invoice_id: int, db: Session = Depends(get_db)):
    inv = get_invoice_by_id(db, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    delete_invoice(db, inv)
    return {"message": "Invoice deleted successfully"}