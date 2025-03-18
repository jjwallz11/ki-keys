from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint, Enum
from datetime import datetime

db = SQLAlchemy()


class Tracking(db.Model):
    __tablename__ = 'tracking'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    locksmith_id = db.Column(db.Integer, db.ForeignKey('locksmiths.id'), nullable=False)
    key_type = db.Column(Enum('smart key', 'transponder', 'high-security', name='key_type_enum'), nullable=False)
    model = db.Column(db.String, nullable=True)  # Optional: specific vehicle model
    threshold = db.Column(db.Integer, nullable=False, default=5)  # Minimum inventory level
    quantity_available = db.Column(db.Integer, CheckConstraint('quantity_available >= 0'), nullable=False, default=0)
    needs_reorder = db.Column(db.Boolean, nullable=False, default=False)
    updated_at = db.Column(db.DateTime, default=datetime, onupdate=datetime, nullable=False)

    # Relationships
    locksmith = db.relationship('Locksmith', back_populates='tracking')

    def __repr__(self):
        return f"<Tracking Key Type: {self.key_type}, Needs Reorder: {self.needs_reorder}>"