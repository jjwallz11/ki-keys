from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer, nullable=False)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    vin = db.Column(db.String(17), unique=True, nullable=False)
    user_id = db.Column(db.Integer, unique=True, nullable=False)