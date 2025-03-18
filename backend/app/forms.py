from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField, PasswordField, SelectField, SelectMultipleField
from wtforms.validators import DataRequired, Length, ValidationError
import re


class LoginForm(FlaskForm):
    user_id = StringField('User ID', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')


def validate_vin(form, field):
    VIN_REGEX = r'^[A-HJ-NPR-Z0-9]{17}$'
    if not re.match(VIN_REGEX, field.data):
        raise ValidationError("Invalid; VIN must be 17 alphanumeric characters and exclude I, O, and Q.")


class VehicleForm(FlaskForm):
    vin = StringField(
        "VIN",
        validators=[
            DataRequired(message="VIN is required."),
            Length(min=17, max=17, message="VIN must be exactly 17 characters."),
            validate_vin,
        ],
    )
    make = StringField("Make", validators=[DataRequired()])
    model = StringField("Model", validators=[DataRequired()])
    year = IntegerField("Year", validators=[DataRequired()])
    submit = SubmitField("Submit")
    

