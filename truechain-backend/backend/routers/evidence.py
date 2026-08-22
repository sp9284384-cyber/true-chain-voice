"""
POST /reports/{id}/evidence — upload + sanitize + encrypt supporting evidence.

Design note on hashing order: the report's chain hash is originally computed
at submission time with no evidence (evidence_hash=None), since text and file
upload are separate requests. When evidence arrives, we RECOMPUTE the report's
report_hash to fold in the evidence hash, using the same prev_hash it already
had. This keeps the chain mathematically consistent (chain_verify.py recomputes
the same way) while still reflecting that evidence is part of that report's
final, submitted state. This update is scoped to before any status_update
exists for that report — once the investigator has acted on it, evidence
should not be added retroactively (enforced in evidence router).
"""
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from config import EVIDENCE_DIR, ALLOWED_EVIDENCE_TYPES, MAX_UPLOAD_SIZE_MB
from database import get_db
from models import Report, Evidence, StatusUpdate
from schemas import EvidenceUploadResponse
from services.sanitize import sanitize_file
from services.crypto import hash_file_bytes, compute_report_hash, decrypt_content, _fernet

router = APIRouter(prefix="/reports", tags=["evidence"])


@router.post("/{report_id}/evidence", response_model=EvidenceUploadResponse, status_code=201)
async def upload_evidence(report_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    has_status_update = db.query(StatusUpdate).filter(StatusUpdate.report_id == report_id).first()
    if has_status_update:
        raise HTTPException(
            status_code=409,
            detail="Cannot attach evidence after an investigator has acted on this report.",
        )

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EVIDENCE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {sorted(ALLOWED_EVIDENCE_TYPES)}",
        )

    raw_bytes = await file.read()
    size_mb = len(raw_bytes) / (1024 * 1024)
    if size_mb > MAX_UPLOAD_SIZE_MB:
        raise HTTPException(status_code=413, detail=f"File exceeds {MAX_UPLOAD_SIZE_MB}MB limit")

    # 1. Sanitize BEFORE anything touches disk
    clean_bytes, removed_log = sanitize_file(file.filename, raw_bytes)

    # 2. Encrypt sanitized bytes at rest
    encrypted_bytes = _fernet.encrypt(clean_bytes)

    # 3. Write to storage with a random filename (never the original name)
    stored_name = f"{uuid.uuid4().hex}{ext}"
    stored_path = EVIDENCE_DIR / stored_name
    stored_path.write_bytes(encrypted_bytes)

    # 4. Hash the SANITIZED (pre-encryption) bytes — this feeds the report's chain hash
    file_hash = hash_file_bytes(clean_bytes)

    evidence = Evidence(
        report_id=report.id,
        sanitized_file_path=str(stored_path.relative_to(EVIDENCE_DIR.parent)),
        file_hash=file_hash,
        original_metadata_removed=removed_log,
    )
    db.add(evidence)

    # 5. Recompute this report's chain hash to fold in the evidence hash (see module docstring)
    content = decrypt_content(report.encrypted_content)
    report.report_hash = compute_report_hash(content, evidence_hash=file_hash, prev_hash=report.prev_hash)

    db.commit()
    db.refresh(evidence)

    return EvidenceUploadResponse(
        evidence_id=evidence.id,
        report_id=report.id,
        file_hash=file_hash,
        metadata_removed=removed_log,
    )
