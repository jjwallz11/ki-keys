from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint, Enum
from datetime import datetime

db = SQLAlchemy()


class Invoice(db.Model):
    __tablename__ = 'invoices'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    locksmith_id = db.Column(db.Integer, db.ForeignKey('locksmiths.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    description = db.Column(db.JSON, nullable=False)
    units = db.Column(db.Integer, CheckConstraint('units IN (1, 2)'), nullable=False)
    price = db.Column(db.Numeric(10, 2), CheckConstraint('price > 0'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), CheckConstraint('amount > 0'), nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    total_due = db.Column(db.Numeric(10, 2), CheckConstraint('total_due > 0'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime, onupdate=datetime, nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='invoices')
    locksmith = db.relationship('Locksmith', back_populates='invoices')
    vehicle = db.relationship('Vehicle', back_populates='invoices')

    def __repr__(self):
        return f"<Invoice {self.id} - Total Due: {self.total_due}>"