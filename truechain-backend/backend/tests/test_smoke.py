import sys
import os
import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from database import SessionLocal, init_db
from services.crypto import (
    encrypt_content,
    decrypt_content,
    compute_report_hash,
    compute_update_hash,
    generate_session_token
)
from services.sanitize import sanitize_file, strip_exif
from services.chain_verify import verify_chain

# Initialize database schema for tests (creates tables if missing)
init_db()

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "TrueChain API"

def test_crypto_encryption_decryption():
    secret_text = "Anonymous whistleblowing payload"
    ciphertext = encrypt_content(secret_text)
    assert ciphertext != secret_text.encode()
    decrypted = decrypt_content(ciphertext)
    assert decrypted == secret_text

def test_crypto_report_hashing():
    content = "Incident report detail"
    evidence_hash = "abc123hash"
    prev_hash = "00000000000000000000000000000000"
    
    hash1 = compute_report_hash(content, evidence_hash, prev_hash)
    hash2 = compute_report_hash(content, evidence_hash, prev_hash)
    
    assert len(hash1) == 64  # SHA-256 hex length
    assert hash1 == hash2

def test_crypto_token_generation():
    token1 = generate_session_token()
    token2 = generate_session_token()
    assert len(token1) > 20
    assert token1 != token2

def test_exif_sanitizer():
    # Create sample image in memory
    img = Image.new("RGB", (100, 100), color="blue")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    img_bytes = buf.getvalue()

    clean_bytes, log = sanitize_file("evidence.png", img_bytes)
    assert len(clean_bytes) > 0
    assert "metadata" in log.lower()

def test_chain_verifier_empty():
    db = SessionLocal()
    try:
        result = verify_chain(db)
        assert result["verified"] is True
        assert result["total_records"] == 0
    finally:
        db.close()
