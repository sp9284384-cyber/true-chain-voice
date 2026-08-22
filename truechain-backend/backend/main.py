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

from database import init_db
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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok", "service": "TrueChain API"}


app.include_router(reports.router)
app.include_router(evidence.router)
app.include_router(investigator.router)
app.include_router(verify.router)
