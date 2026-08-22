"""
Run once to create an investigator login for the dashboard demo:
    python seed_investigator.py

Default creds (CHANGE before any real deployment): admin / changeme123
"""
import sys
from database import SessionLocal, init_db
from models import Investigator
from services.auth import hash_password


def seed(username: str = "admin", password: str = "changeme123"):
    init_db()
    db = SessionLocal()
    try:
        existing = db.query(Investigator).filter(Investigator.username == username).first()
        if existing:
            print(f"Investigator '{username}' already exists.")
            return
        inv = Investigator(username=username, password_hash=hash_password(password))
        db.add(inv)
        db.commit()
        print(f"Created investigator '{username}' with password '{password}' — change this before demo day.")
    finally:
        db.close()


if __name__ == "__main__":
    args = sys.argv[1:]
    if len(args) == 2:
        seed(args[0], args[1])
    else:
        seed()
