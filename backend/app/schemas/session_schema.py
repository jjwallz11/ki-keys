from marshmallow import Schema, fields

class SessionSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)