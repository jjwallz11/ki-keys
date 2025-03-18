# app/api_routes/__init__.py
from app.routes.locksmiths_routes import locksmiths_routes
from app.routes.main_routes import main_routes
from app.routes.orders_routes import orders_routes
from app.routes.session_routes import session_routes
from app.routes.tracking_inventory_routes import tracking_inventory_routes
from app.routes.users_routes import users_routes
from app.routes.vehicles_routes import vehicles_routes

blueprints = [
    ('/locksmiths', locksmiths_routes),
    ('/', main_routes),
    ('/orders', orders_routes),
    ('/session', session_routes),
    ('/tracking_inventory', tracking_inventory_routes),
    ('/users', users_routes),
    ('/vehicles', vehicles_routes),
]
