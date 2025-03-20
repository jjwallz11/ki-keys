# backend/seed/seed_users.py

from app.utils.db import engine, Base, SessionLocal
from app.models.users import User
from app.utils.auth import hash_password

def seed_users():
    Base.metadata.create_all(bind=engine)  # Ensure tables are created
    db = SessionLocal()
    try:
        # Create admin user if not exists
        admin_email = "johnny@jjp3.io"
        if not db.query(User).filter(User.email == admin_email).first():
            admin = User(
                email=admin_email,
                password_hash=hash_password("BAtFitFMA13#*"),
                first_name="Johnny",
                last_name="Wallz",
                role="admin"
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            print(f"Created admin user with email: {admin_email}")
        
        # Create locksmith user if not exists
        locksmith_email = "leeno@pkaz.com"
        if not db.query(User).filter(User.email == locksmith_email).first():
            locksmith = User(
                email=locksmith_email,
                password_hash=hash_password("password"),
                first_name="Abelino",
                last_name="Solis",
                role="locksmith"
            )
            db.add(locksmith)
            db.commit()
            db.refresh(locksmith)
            print(f"Created locksmith user with email: {locksmith_email}")
        
        # Create owner user if not exists
        owner_email = "joel@rsa.com"
        if not db.query(User).filter(User.email == owner_email).first():
            owner = User(
                email=owner_email,
                password_hash=hash_password("password"),
                first_name="Joel",
                last_name="Gonzalez",
                role="owner"
            )
            db.add(owner)
            db.commit()
            db.refresh(owner)
            print(f"Created owner with email: {owner_email}")
            
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()