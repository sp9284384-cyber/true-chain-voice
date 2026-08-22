"""
crypto.py — two separate, independently testable concerns:
  1. encrypt_content()/decrypt_content() — protects report text at rest
  2. compute_report_hash() — builds the tamper-evident hash-chain link

Keep these separate. Do not let hashing logic depend on encryption succeeding
or vice versa — that coupling is exactly what the architecture doc warns against.
"""
import hashlib
import secrets
from cryptography.fernet import Fernet

from config import FERNET_KEY

# Fernet requires a 32-byte urlsafe-base64 key. If the configured default
# placeholder is used, derive a valid key from it so local dev doesn't crash —
# but this MUST be replaced with a real generated key before any real deployment.
def _get_fernet() -> Fernet:
    try:
        return Fernet(FERNET_KEY.encode() if isinstance(FERNET_KEY, str) else FERNET_KEY)
    except Exception:
        derived = hashlib.sha256(FERNET_KEY.encode()).digest()
        import base64
        return Fernet(base64.urlsafe_b64encode(derived))


_fernet = _get_fernet()


def encrypt_content(plaintext: str) -> bytes:
    """Encrypt report text before it ever touches the DB."""
    return _fernet.encrypt(plaintext.encode("utf-8"))


def decrypt_content(ciphertext: bytes) -> str:
    """Decrypt report text — only called from authenticated investigator paths."""
    return _fernet.decrypt(ciphertext).decode("utf-8")


def generate_session_token() -> str:
    """Random token, not derived from or tied to any identity attribute."""
    return secrets.token_urlsafe(32)


def compute_report_hash(content: str, evidence_hash: str | None, prev_hash: str | None) -> str:
    """
    report_hash = SHA256(content + evidence_hash + prev_hash)
    Deterministic and order-sensitive — this is what chain_verify.py recomputes
    to check for tampering.
    """
    payload = f"{content}|{evidence_hash or ''}|{prev_hash or ''}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def compute_update_hash(new_status: str, report_id: int, prev_update_hash: str | None) -> str:
    """Same chaining pattern applied to status_updates."""
    payload = f"{report_id}|{new_status}|{prev_update_hash or ''}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def hash_file_bytes(data: bytes) -> str:
    """SHA256 of sanitized file contents — feeds into the report's chain hash."""
    return hashlib.sha256(data).hexdigest()
