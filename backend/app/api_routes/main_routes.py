from flask import Blueprint

main_routes = Blueprint('main', __name__)

@main_routes.route('/')
def index():
    return {'message': 'Welcome to the Patriotic Keys App!'}