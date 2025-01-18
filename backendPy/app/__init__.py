from flask import Flask
from app.config import Configuration
from app.routes import main, session
from app.models import Vehicle, db
from flask_migrate import Migrate
import os

app = Flask(__name__)
app.config.from_object(Configuration)
app.config.from_mapping({'SQLALCHEMY_DATABASE_URI': os.environ.get('DATABASE_URL', 'sqlite:///dev.db')})
app.register_blueprint(main.bp)
app.register_blueprint(session.bp)
db.init_app(app)
Migrate(app, db)