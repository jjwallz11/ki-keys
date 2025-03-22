from sqlalchemy.orm import Session
from app.models.invoices import Invoice
from app.models.invoice_items import InvoiceItem
from app.schemas.invoices import InvoiceCreate
from datetime import timedelta, datetime

def generate_invoice_number(db: Session) -> str:
    last_invoice = db.query(Invoice).order_by(Invoice.id.desc()).first()
    if last_invoice and last_invoice.invoice_number:
        try:
            last_number = int(last_invoice.invoice_number.replace("INV-", ""))
            return f"INV-{last_number + 1:03d}"
        except ValueError:
            pass  # fallback below
    return "INV-001"

def create_invoice(db: Session, invoice_data: InvoiceCreate, user_id: int) -> Invoice:
    # Calculate the total_due based on invoice items
    total = sum(item.quantity * item.unit_price for item in invoice_data.items)
    invoice_number = generate_invoice_number(db)
    invoice_date = invoice_data.date or datetime.utcnow()
    
    invoice = Invoice(
        invoice_number=invoice_number,
        bill_to=invoice_data.bill_to,
        date=invoice_date,
        terms=invoice_data.terms,
        due_date=invoice_data.due_date or invoice_data.date + timedelta(days=30),
        total_due=total,
        user_id=user_id,
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    
    # Create invoice items
    for item in invoice_data.items:
        invoice_item = InvoiceItem(
            invoice_id=invoice.id,
            key_type=item.key_type,
            quantity=item.quantity,
            unit_price=item.unit_price,
            amount=item.quantity * item.unit_price
        )
        db.add(invoice_item)
    db.commit()
    db.refresh(invoice)
    return invoice

def get_invoice_by_id(db: Session, invoice_id: int):
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()

def get_all_invoices(db: Session):
    return db.query(Invoice).all()

def update_invoice(db: Session, invoice: Invoice, invoice_data) -> Invoice:
    new_date = invoice_data.date or invoice.date
    invoice.bill_to = invoice_data.bill_to or invoice.bill_to
    invoice.date = new_date
    invoice.terms = invoice_data.terms or invoice.terms
    invoice.due_date = invoice_data.due_date or new_date + timedelta(days=30)
    db.commit()
    db.refresh(invoice)
    return invoice

def delete_invoice(db: Session, invoice: Invoice):
    # Optionally, delete related invoice items first if your DB is not cascading
    db.delete(invoice)
    db.commit()