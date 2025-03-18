from flask import Blueprint, request, jsonify
from app.models import Order, db

orders_routes = Blueprint('orders', __name__)

@orders_routes.route('/')
def get_orders():
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders])

@orders_routes.route('/<int:id>')
def get_order(id):
    order = Order.query.get_or_404(id)
    return jsonify(order.to_dict())

@orders_routes.route('/', methods=['POST'])
def create_order():
    data = request.get_json()
    order = Order(**data)
    db.session.add(order)
    db.session.commit()
    return jsonify(order.to_dict()), 201