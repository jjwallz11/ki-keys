from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint, Enum
from datetime import datetime

db = SQLAlchemy()

class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Foreign key to Users
    year = db.Column(db.Integer, nullable=False)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    vin = db.Column(db.String(17), unique=True, nullable=False)
    key_type = db.Column(Enum('smart key', 'transponder', 'high-security', name='key_type_enum'), nullable=False)
    price = db.Column(db.Numeric(10, 2), CheckConstraint('price > 0'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime, onupdate=datetime, nullable=False)
    preview_image = db.Column(db.String, nullable=True)  # URL for preview image
    key_image = db.Column(db.String, nullable=True)      # URL for key image
    
    # Relationships
    orders = db.relationship('Order', back_populates='vehicle', cascade='all, delete-orphan')
    
    # Constraints
    __table_args__ = (
        CheckConstraint('year BETWEEN 1949 AND 2024', name='check_year_valid_range'),
    )

    def __repr__(self):
        return f"<Vehicle {self.year} {self.make} {self.model} (VIN: {self.vin})>"