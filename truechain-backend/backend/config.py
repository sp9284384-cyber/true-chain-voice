"""
Central configuration for TrueChain backend.
All secrets/paths are read from environment variables with safe local-dev defaults.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# --- Database ---
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'truechain.db'}")

# --- Encryption ---
# IMPORTANT: In production, set FERNET_KEY as an env var. This default is for local dev only.
# Generate a real one with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
FERNET_KEY = os.getenv("FERNET_KEY", "changeme-generate-a-real-fernet-key-for-prod-use-CLI-above=")

# --- Auth ---
JWT_SECRET = os.getenv("JWT_SECRET", "changeme-dev-secret-do-not-use-in-prod")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

# --- File storage ---
EVIDENCE_DIR = BASE_DIR / "storage" / "evidence"
EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))
ALLOWED_EVIDENCE_TYPES = {".jpg", ".jpeg", ".png", ".pdf"}

# --- AI triage (Ollama) ---
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")
AI_TRIAGE_ENABLED = os.getenv("AI_TRIAGE_ENABLED", "true").lower() == "true"

# --- CORS (so the frontend can connect without extra config) ---
# Add your deployed frontend URL here too when you have one.
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

VALID_CATEGORIES = ["harassment", "corruption", "misconduct", "other"]
VALID_URGENCY = ["low", "medium", "high"]
VALID_STATUS = ["submitted", "under_review", "resolved"]
