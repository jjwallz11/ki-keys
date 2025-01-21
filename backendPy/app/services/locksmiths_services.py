from app.models import Locksmith, db

class LocksmithService:
    @staticmethod
    def create_locksmith(user_id, company_name, address, city, state, zip_code, country):
        locksmith = Locksmith(
            user_id=user_id,
            company_name=company_name,
            address=address,
            city=city,
            state=state,
            zip=zip_code,
            country=country
        )
        db.session.add(locksmith)
        db.session.commit()
        return locksmith

    @staticmethod
    def get_locksmith_by_user_id(user_id):
        return Locksmith.query.filter_by(user_id=user_id).first()