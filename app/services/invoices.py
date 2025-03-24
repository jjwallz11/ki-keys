# app/services/invoices.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from datetime import datetime, timedelta

from app.models.invoices import Invoice
from app.models.invoice_items import InvoiceItem
from app.schemas.invoices import InvoiceCreate

async def generate_invoice_number(db: AsyncSession) -> str:
    result = await db.execute(select(Invoice).order_by(Invoice.id.desc()))
    last_invoice = result.scalars().first()
    if last_invoice and last_invoice.invoice_number:
        try:
            last_number = int(last_invoice.invoice_number.replace("INV-", ""))
            return f"INV-{last_number + 1:03d}"
        except ValueError:
            pass
    return "INV-001"

async def create_invoice(db: AsyncSession, invoice_data: InvoiceCreate, user_id: int) -> Invoice:
    invoice_number = await generate_invoice_number(db)
    invoice_date = invoice_data.date or datetime.utcnow()
    due_date = invoice_data.due_date or (invoice_data.date + timedelta(days=30) if invoice_data.date else invoice_date + timedelta(days=30))

    invoice = Invoice(
        invoice_number=invoice_number,
        user_id=user_id,
        bill_to=invoice_data.bill_to,
        date=invoice_date,
        terms=invoice_data.terms,
        due_date=due_date,
    )
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)

    total_due = 0.0
    for item in invoice_data.items:
        amount = item.quantity * item.unit_price
        total_due += amount
        db.add(InvoiceItem(
            invoice_id=invoice.id,
            key_type=item.key_type,
            quantity=item.quantity,
            unit_price=item.unit_price,
            amount=amount
        ))

    invoice.total_due = total_due
    await db.commit()
    await db.refresh(invoice)
    return invoice

async def get_invoice_by_id(db: AsyncSession, invoice_id: int) -> Invoice | None:
    result = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
    return result.scalar_one_or_none()

async def get_all_invoices(db: AsyncSession) -> list[Invoice]:
    result = await db.execute(select(Invoice))
    return result.scalars().all()

async def update_invoice(db: AsyncSession, invoice: Invoice, invoice_data: InvoiceCreate) -> Invoice:
    new_date = invoice_data.date or invoice.date
    invoice.bill_to = invoice_data.bill_to or invoice.bill_to
    invoice.date = new_date
    invoice.terms = invoice_data.terms or invoice.terms
    invoice.due_date = invoice_data.due_date or (new_date + timedelta(days=30))

    # Delete existing invoice items
    await db.execute(delete(InvoiceItem).where(InvoiceItem.invoice_id == invoice.id))
    await db.commit()

    # Add updated invoice items
    total_due = 0.0
    for item in invoice_data.items:
        amount = item.quantity * item.unit_price
        total_due += amount
        db.add(InvoiceItem(
            invoice_id=invoice.id,
            key_type=item.key_type,
            quantity=item.quantity,
            unit_price=item.unit_price,
            amount=amount
        ))

    invoice.total_due = total_due
    await db.commit()
    await db.refresh(invoice)
    return invoice

async def delete_invoice(db: AsyncSession, invoice: Invoice) -> None:
    await db.delete(invoice)
    await db.commit()
    