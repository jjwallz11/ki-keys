from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint, Enum
from datetime import datetime

db = SQLAlchemy()


class Session(db.Model):
    __tablename__ = 'sessions'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    login_time = db.Column(db.DateTime, default=datetime, nullable=False)
    logout_time = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='sessions')

    def __repr__(self):
        return f"<Session {self.id} - Active: {self.is_active}>"