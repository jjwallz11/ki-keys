from flask import Blueprint, request, jsonify
from app.models import Vehicle, db

vehicles_routes = Blueprint('vehicles', __name__)

@vehicles_routes.route('/')
def get_vehicles():
    vehicles = Vehicle.query.all()
    return jsonify([vehicle.to_dict() for vehicle in vehicles])

@vehicles_routes.route('/<int:id>')
def get_vehicle(id):
    vehicle = Vehicle.query.get_or_404(id)
    return jsonify(vehicle.to_dict())

@vehicles_routes.route('/', methods=['POST'])
def create_vehicle():
    data = request.get_json()
    vehicle = Vehicle(**data)
    db.session.add(vehicle)
    db.session.commit()
    return jsonify(vehicle.to_dict()), 201