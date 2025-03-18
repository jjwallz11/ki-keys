from marshmallow import Schema, fields, validate

class VehicleSchema(Schema):
    id = fields.Int(dump_only=True)
    ownerId = fields.Int(required=True)
    year = fields.Int(required=True, validate=validate.Range(min=1949, max=2024))
    make = fields.Str(required=True)
    model = fields.Str(required=True)
    vin = fields.Str(required=True, validate=validate.Length(equal=17))
    keyType = fields.Str(validate=validate.OneOf(["smart key", "transponder", "high-security"]))
    price = fields.Decimal(required=True, validate=validate.Range(min=0.01))
    previewImage = fields.Url()
    keyImage = fields.Url()