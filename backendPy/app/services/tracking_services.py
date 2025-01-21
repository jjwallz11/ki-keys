from app.models import Tracking, db

class TrackingService:
    @staticmethod
    def log_usage(key_type, vehicle_model):
        tracking = Tracking.query.filter_by(key_type=key_type, vehicle_model=vehicle_model).first()
        if tracking:
            tracking.usage_count += 1
            db.session.commit()
        else:
            tracking = Tracking(key_type=key_type, vehicle_model=vehicle_model, usage_count=1)
            db.session.add(tracking)
            db.session.commit()
        return tracking

    @staticmethod
    def get_trends():
        return Tracking.query.order_by(Tracking.usage_count.desc()).all()