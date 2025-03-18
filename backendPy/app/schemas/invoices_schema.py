# invoices/schemas.py

from marshmallow import Schema, fields

class InvoiceSchema(Schema):
    id = fields.Int(dump_only=True)
    customer_name = fields.Str(required=True)
    amount = fields.Float(required=True)
    date_created = fields.DateTime(dump_only=True)
    due_date = fields.DateTime()

invoice_schema = InvoiceSchema()
invoices_schema = InvoiceSchema(many=True)
