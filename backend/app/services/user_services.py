from app.models import User, db
from werkzeug.security import generate_password_hash, check_password_hash

class UserService:
    @staticmethod
    def create_user(company_name, address, city, state, zip_code, country, email, password, role):
        hashed_password = generate_password_hash(password)
        new_user = User(
            company_name=company_name,
            address=address,
            city=city,
            state=state,
            zip=zip_code,
            country=country,
            email=email,
            password_hash=hashed_password,
            role=role
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user

    @staticmethod
    def validate_credentials(email, password):
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            return user
        return None

    @staticmethod
    def get_user_by_id(user_id):
        return User.query.get(user_id)