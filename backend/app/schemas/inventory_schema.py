from marshmallow import Schema, fields

class InventorySchema(Schema):
    id = fields.Int(dump_only=True)
    locksmithId = fields.Int(required=True)
    keyType = fields.Str(required=True)
    quantity = fields.Int(required=True, validate=lambda q: q >= 0)