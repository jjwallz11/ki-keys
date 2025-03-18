from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    companyName = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    address = fields.Str(required=True)
    city = fields.Str(required=True)
    state = fields.Str(required=True)
    zip = fields.Int(required=True)
    country = fields.Str(required=True)
    email = fields.Email(required=True)
    role = fields.Str(validate=validate.OneOf(["owner", "locksmith", "admin"]))