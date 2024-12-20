
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config.config import Config

db = SQLAlchemy()
migrate = Migrate()


from app.routes import vehicles_bp, users_bp, invoices_bp, images_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app, db)

    # Register Blueprints
    app.register_blueprint(vehicles_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(invoices_bp)
    app.register_blueprint(images_bp)

    return app
