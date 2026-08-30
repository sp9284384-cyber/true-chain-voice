"""
TrueChain backend — FastAPI app entrypoint.

Run locally:
    uvicorn main:app --reload --port 8000

Once your friend sends the frontend zip, drop it in as ../frontend, set
NEXT_PUBLIC_API_URL=http://localhost:8000 in its .env.local, and it will
connect immediately — CORS is already open for localhost:3000 below.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db, SessionLocal
from models import Investigator
from services.auth import hash_password
from config import CORS_ORIGINS
from routers import reports, evidence, investigator, verify

app = FastAPI(
    title="TrueChain API",
    description="Anonymous reporting platform with tamper-evident hash-chain integrity.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com|http://localhost:\d+|http://127\.0\.0\.1:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def auto_seed_investigators():
    db = SessionLocal()
    try:
        users = [
            ("sunnypathak979", "Sunny@979"),
            ("admin", "changeme123"),
        ]
        for username, password in users:
            existing = db.query(Investigator).filter(Investigator.username == username).first()
            if not existing:
                inv = Investigator(username=username, password_hash=hash_password(password))
                db.add(inv)
                print(f"Auto-created investigator account: {username}")
        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    init_db()
    auto_seed_investigators()


@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok", "service": "TrueChain API"}


app.include_router(reports.router)
app.include_router(evidence.router)
app.include_router(investigator.router)
app.include_router(verify.router)
