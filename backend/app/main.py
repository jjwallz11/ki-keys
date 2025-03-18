from flask import Flask
from app.config import Configuration
from app.routes import blueprints
from app.models import db
from flask_migrate import Migrate
import os

app = Flask(__name__)

app.config.from_object(Configuration)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///dev.db')

for blueprint in blueprints:
    app.register_blueprint(blueprint)

db.init_app(app)
Migrate(app, db)