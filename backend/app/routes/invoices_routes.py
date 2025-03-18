# routes/invoices_routes.py
from flask import Blueprint, request, jsonify, render_template
from app.services import create_invoice, get_invoice, get_all_invoices

invoice_routes = Blueprint('invoice', __name__)

@invoice_routes.route('/invoices', methods=['POST'])
def create():
    data = request.json
    invoice = create_invoice(data)
    return jsonify(invoice), 201

@invoice_routes.route('/invoices/<int:id>', methods=['GET'])
def get(id):
    invoice = get_invoice(id)
    if invoice:
        return jsonify(invoice)
    return jsonify({'message': 'Invoice not found'}), 404

@invoice_routes.route('/invoices', methods=['GET'])
def list_invoices():
    invoices = get_all_invoices()
    return render_template('invoices_list.html', invoices=invoices)