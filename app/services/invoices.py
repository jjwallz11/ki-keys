from sqlalchemy.orm import Session
from app.models.invoices import Invoice
from app.models.invoice_items import InvoiceItem
from app.schemas.invoices import InvoiceCreate

def create_invoice(db: Session, invoice_data: InvoiceCreate) -> Invoice:
    # Calculate the total_due based on invoice items
    total = sum(item.quantity * item.unit_price for item in invoice_data.items)
    
    invoice = Invoice(
        invoice_number=invoice_data.invoice_number,
        user_id=invoice_data.user_id,
        bill_to=invoice_data.bill_to,
        date=invoice_data.date,
        terms=invoice_data.terms,
        due_date=invoice_data.due_date,
        total_due=total
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    
    # Create invoice items
    for item in invoice_data.items:
        invoice_item = InvoiceItem(
            invoice_id=invoice.id,
            date=item.date,
            description=item.description,
            details=item.details,
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
    # Example: update bill_to, date, terms, due_date; items update would be more complex.
    invoice.bill_to = invoice_data.bill_to or invoice.bill_to
    invoice.date = invoice_data.date or invoice.date
    invoice.terms = invoice_data.terms or invoice.terms
    invoice.due_date = invoice_data.due_date or invoice.due_date
    db.commit()
    db.refresh(invoice)
    return invoice

def delete_invoice(db: Session, invoice: Invoice):
    # Optionally, delete related invoice items first if your DB is not cascading
    db.delete(invoice)
    db.commit()