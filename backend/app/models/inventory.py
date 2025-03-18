from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint, Enum
from datetime import datetime

db = SQLAlchemy()


class Inventory(db.Model):
    __tablename__ = 'inventory'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    locksmith_id = db.Column(db.Integer, db.ForeignKey('locksmiths.id'), nullable=False)
    key_type = db.Column(Enum('smart key', 'transponder', 'high-security', name='key_type_enum'), nullable=False)
    model = db.Column(db.String, nullable=True)  # Optional: specific vehicle model
    quantity = db.Column(db.Integer, CheckConstraint('quantity >= 0'), nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime, onupdate=datetime, nullable=False)

    # Relationships
    locksmith = db.relationship('Locksmith', back_populates='inventory')

    def __repr__(self):
        return f"<Inventory Key Type: {self.key_type}, Quantity: {self.quantity}>"