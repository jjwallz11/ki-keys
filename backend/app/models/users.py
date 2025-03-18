from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint, Enum
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_name = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)
    zip = db.Column(db.Integer, nullable=False)
    country = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    role = db.Column(Enum('owner', 'locksmith', 'admin', name='user_role_enum'), nullable=False)

    # Relationships
    locksmith = db.relationship('Locksmith', back_populates='user', uselist=False)
    vehicles = db.relationship('Vehicle', back_populates='owner', cascade='all, delete')
    invoices = db.relationship('Invoice', back_populates='user', cascade='all, delete')
    orders = db.relationship('Order', back_populates='owner', cascade='all, delete-orphan')
    sessions = db.relationship('Session', back_populates='user', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<User {self.company_name} (Role: {self.role})>"