from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint, Enum
from datetime import datetime

db = SQLAlchemy()


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    locksmith_id = db.Column(db.Integer, db.ForeignKey('locksmiths.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    key_type = db.Column(Enum('smart key', 'transponder', 'high-security', name='key_type_enum'), nullable=False)
    quantity = db.Column(db.Integer, CheckConstraint('quantity > 0'), nullable=False)
    status = db.Column(Enum('pending', 'in-progress', 'completed', name='order_status_enum'), default='pending', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime, onupdate=datetime, nullable=False)

    # Relationships
    owner = db.relationship('User', back_populates='orders')
    locksmith = db.relationship('Locksmith', back_populates='orders')
    vehicle = db.relationship('Vehicle')

    def __repr__(self):
        return f"<Order {self.id} - Status: {self.status}>"