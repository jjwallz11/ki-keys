# invoices/services.py

from app.models import Invoice
from app.schemas import invoice_schema, invoices_schema
from datetime import datetime

def create_invoice(data):
    # Create a new invoice
    invoice = Invoice(
        customer_name=data['customer_name'],
        amount=data['amount'],
        date_created=datetime.now(),
        due_date=data.get('due_date')
    )
    invoice.save()  # Assuming you're using an ORM like SQLAlchemy
    return invoice_schema.dump(invoice)

def get_invoice(id):
    # Get an invoice by ID
    invoice = Invoice.query.get(id)  # Using SQLAlchemy
    if invoice:
        return invoice_schema.dump(invoice)
    return None
