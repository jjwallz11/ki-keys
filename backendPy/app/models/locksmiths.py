from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Locksmith(db.Model):
    __tablename__ = 'locksmiths'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    company_name = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)
    zip = db.Column(db.Integer, nullable=False)
    country = db.Column(db.String, nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='locksmith')
    invoices = db.relationship('Invoice', back_populates='locksmith', cascade='all, delete')
    orders = db.relationship('Order', back_populates='locksmith', cascade='all, delete-orphan')
    tracking = db.relationship('Tracking', back_populates='locksmith', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f"<Locksmith {self.company_name}>"