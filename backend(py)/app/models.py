
from app import db

class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    make = db.Column(db.String(255), nullable=False)
    model = db.Column(db.String(255), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    owner = db.relationship('User', back_populates='vehicles', cascade='all, delete')
    invoices = db.relationship('Invoice', back_populates='vehicle', cascade='all, delete')
    images = db.relationship('Image', back_populates='vehicle', cascade='all, delete')

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    vehicles = db.relationship('Vehicle', back_populates='owner', cascade='all, delete')



class Invoice(db.Model):
    __tablename__ = 'invoices'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    locksmith_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id', ondelete='CASCADE'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    user = db.relationship('User', foreign_keys=[user_id], back_populates='invoices')
    locksmith = db.relationship('User', foreign_keys=[locksmith_id], back_populates='locksmith_invoices')
    vehicle = db.relationship('Vehicle', back_populates='invoices')

# Add relationships to the User and Vehicle models
User.invoices = db.relationship('Invoice', foreign_keys=[Invoice.user_id], back_populates='user', cascade='all, delete')
User.locksmith_invoices = db.relationship('Invoice', foreign_keys=[Invoice.locksmith_id], back_populates='locksmith', cascade='all, delete')
Vehicle.invoices = db.relationship('Invoice', back_populates='vehicle', cascade='all, delete')



class Image(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id', ondelete='CASCADE'), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    vehicle = db.relationship('Vehicle', back_populates='images')


class Locksmith(db.Model):
    __tablename__ = 'locksmiths'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    specialization = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    user = db.relationship('User', back_populates='locksmith_details')

# Add relationships to existing models
User.locksmith_details = db.relationship('Locksmith', back_populates='user', cascade='all, delete')
Vehicle.images = db.relationship('Image', back_populates='vehicle', cascade='all, delete')
