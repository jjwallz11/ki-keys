# app/routes/inventory_routes.py
from flask import Blueprint, request, jsonify
from app.services.inventory_services import assign_key_type_service

inventory_routes = Blueprint('inventory', __name__)

@inventory_routes.route('/assign_key_type/<int:vehicle_id>', methods=['POST'])
def assign_key_type(vehicle_id):
    key_type = request.form.get('key_type')
    response = assign_key_type_service(vehicle_id, key_type)
    return jsonify(response), 200