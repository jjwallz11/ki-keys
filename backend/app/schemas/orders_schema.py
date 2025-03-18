from marshmallow import Schema, fields

class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    userId = fields.Int(required=True)
    locksmithId = fields.Int(required=True)
    vehicleId = fields.Int(required=True)
    description = fields.Dict(required=True)  # Assuming a JSON description
    units = fields.Int(required=True, validate=lambda n: n in [1, 2])
    price = fields.Decimal(required=True, validate=lambda p: p > 0)
    amount = fields.Decimal(required=True, validate=lambda a: a > 0)
    dueDate = fields.Date(required=True)
    totalDue = fields.Decimal(required=True, validate=lambda t: t > 0)