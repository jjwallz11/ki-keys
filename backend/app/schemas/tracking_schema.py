from marshmallow import Schema, fields

class TrackingSchema(Schema):
    id = fields.Int(dump_only=True)
    locksmithId = fields.Int(required=True)
    keyType = fields.Str(required=True)
    model = fields.Str()
    requiredStock = fields.Int(required=True)
    currentStock = fields.Int(required=True)