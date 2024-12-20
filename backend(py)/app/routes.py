


from flask import Blueprint, jsonify

vehicles_bp = Blueprint('vehicles', __name__, url_prefix='/api/vehicles')

# Placeholder route for vehicles
@vehicles_bp.route('/', methods=['GET'])
def get_vehicles():
    # Example response
    return jsonify({"message": "Vehicles endpoint placeholder"}), 200



from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from werkzeug.security import generate_password_hash

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

# User signup route
@users_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    password = data.get('password')

    # Basic validation
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Create and save the user
    new_user = User(email=email, first_name=first_name, last_name=last_name, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "user": {"id": new_user.id, "email": new_user.email}}), 201



from flask import Blueprint, request, jsonify
from app import db
from app.models import Invoice

invoices_bp = Blueprint('invoices', __name__, url_prefix='/api/invoices')

# Get all invoices (placeholder)
@invoices_bp.route('/', methods=['GET'])
def get_invoices():
    invoices = Invoice.query.all()
    invoices_data = [
        {"id": invoice.id, "user_id": invoice.user_id, "vehicle_id": invoice.vehicle_id, "total_amount": invoice.total_amount}
        for invoice in invoices
    ]
    return jsonify(invoices_data), 200

# Create an invoice (placeholder)
@invoices_bp.route('/', methods=['POST'])
def create_invoice():
    data = request.get_json()
    user_id = data.get('user_id')
    locksmith_id = data.get('locksmith_id')
    vehicle_id = data.get('vehicle_id')
    total_amount = data.get('total_amount')

    if not all([user_id, locksmith_id, vehicle_id, total_amount]):
        return jsonify({"error": "All fields are required"}), 400

    # Create and save the invoice
    new_invoice = Invoice(user_id=user_id, locksmith_id=locksmith_id, vehicle_id=vehicle_id, total_amount=total_amount)
    db.session.add(new_invoice)
    db.session.commit()

    return jsonify({"message": "Invoice created successfully", "invoice": {"id": new_invoice.id}}), 201



from flask import Blueprint, request, jsonify
from app import db
from app.models import Image

images_bp = Blueprint('images', __name__, url_prefix='/api/images')

# Get all images for a vehicle (placeholder)
@images_bp.route('/vehicle/<int:vehicle_id>', methods=['GET'])
def get_vehicle_images(vehicle_id):
    images = Image.query.filter_by(vehicle_id=vehicle_id).all()
    images_data = [{"id": image.id, "url": image.url} for image in images]
    return jsonify(images_data), 200

# Upload an image (placeholder)
@images_bp.route('/', methods=['POST'])
def upload_image():
    data = request.get_json()
    vehicle_id = data.get('vehicle_id')
    url = data.get('url')

    if not all([vehicle_id, url]):
        return jsonify({"error": "Vehicle ID and URL are required"}), 400

    # Create and save the image
    new_image = Image(vehicle_id=vehicle_id, url=url)
    db.session.add(new_image)
    db.session.commit()

    return jsonify({"message": "Image uploaded successfully", "image": {"id": new_image.id, "url": new_image.url}}), 201

# Delete an image (placeholder)
@images_bp.route('/<int:image_id>', methods=['DELETE'])
def delete_image(image_id):
    image = Image.query.get(image_id)
    if not image:
        return jsonify({"error": "Image not found"}), 404

    db.session.delete(image)
    db.session.commit()

    return jsonify({"message": "Image deleted successfully"}), 200
