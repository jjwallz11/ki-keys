from flask import Blueprint, request, jsonify
from app.models import User, db

users_routes = Blueprint('users', __name__)

@users_routes.route('/')
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@users_routes.route('/<int:id>')
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict())

@users_routes.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201