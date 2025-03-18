from app.models import db

def commit_or_rollback():
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise e