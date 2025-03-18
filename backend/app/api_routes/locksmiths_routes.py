from flask import Blueprint, request, jsonify
from app.models import Locksmith, db

locksmiths_routes = Blueprint('locksmiths', __name__)

@locksmiths_routes.route('/')
def get_locksmiths():
    locksmiths = Locksmith.query.all()
    return jsonify([locksmith.to_dict() for locksmith in locksmiths])

@locksmiths_routes.route('/<int:id>')
def get_locksmith(id):
    locksmith = Locksmith.query.get_or_404(id)
    return jsonify(locksmith.to_dict())

@locksmiths_routes.route('/', methods=['POST'])
def create_locksmith():
    data = request.get_json()
    locksmith = Locksmith(**data)
    db.session.add(locksmith)
    db.session.commit()
    return jsonify(locksmith.to_dict()), 201