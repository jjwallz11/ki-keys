from flask import Blueprint, jsonify
from app.models import Inventory, Tracking, db

tracking_inventory_routes = Blueprint('tracking_inventory', __name__)

@tracking_inventory_routes.route('/inventory')
def get_inventory():
    inventory = Inventory.query.all()
    return jsonify([item.to_dict() for item in inventory])

@tracking_inventory_routes.route('/tracking')
def get_tracking():
    tracking_data = Tracking.query.all()
    return jsonify([item.to_dict() for item in tracking_data])