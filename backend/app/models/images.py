from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint, Enum
from datetime import datetime

db = SQLAlchemy()


class Image(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=True)
    key_id = db.Column(db.Integer, nullable=True)  # This could later reference a 'Keys' table if added
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=True)
    image_url = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime, onupdate=datetime, nullable=False)

    # Relationships
    vehicle = db.relationship('Vehicle', back_populates='images')

    def __repr__(self):
        return f"<Image {self.id} - URL: {self.image_url}>"