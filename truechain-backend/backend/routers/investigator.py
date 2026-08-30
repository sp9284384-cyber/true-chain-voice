"""
POST  /investigator/login
GET   /investigator/reports              — queue, sorted by AI-assigned urgency
GET   /investigator/reports/{id}         — single report detail (decrypts here, only here)
PATCH /investigator/reports/{id}/status  — append-only status update

Every route here (except login) requires a valid investigator JWT.
"""
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from database import get_db
from models import Report, Investigator, StatusUpdate, Evidence
from schemas import (
    InvestigatorLogin, InvestigatorLoginResponse,
    ReportSummary, ReportDetail, StatusUpdateRequest, StatusUpdateResponse,
    EvidenceItem,
)
from services.auth import verify_password, create_access_token, get_current_investigator
from services.crypto import decrypt_content, compute_update_hash, _fernet
from config import VALID_STATUS, BASE_DIR

router = APIRouter(prefix="/investigator", tags=["investigator"])

_URGENCY_ORDER = {"high": 0, "medium": 1, "low": 2, None: 3}


@router.post("/login", response_model=InvestigatorLoginResponse)
def login(payload: InvestigatorLogin, db: Session = Depends(get_db)):
    investigator = db.query(Investigator).filter(Investigator.username == payload.username).first()
    if not investigator or not verify_password(payload.password, investigator.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token(investigator.username)
    return InvestigatorLoginResponse(access_token=token)


@router.get("/reports", response_model=list[ReportSummary])
def list_reports(
    db: Session = Depends(get_db),
    _investigator: Investigator = Depends(get_current_investigator),
):
    reports = db.query(Report).all()
    reports.sort(key=lambda r: _URGENCY_ORDER.get(r.urgency, 3))
    return reports


@router.get("/reports/{report_id}", response_model=ReportDetail)
def get_report_detail(
    report_id: int,
    db: Session = Depends(get_db),
    _investigator: Investigator = Depends(get_current_investigator),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    content = decrypt_content(report.encrypted_content)  # only ever decrypted here
    evidence_records = db.query(Evidence).filter(Evidence.report_id == report_id).all()
    evidence_list = [
        EvidenceItem(
            id=e.id,
            file_hash=e.file_hash,
            metadata_removed=e.original_metadata_removed,
            uploaded_at=e.uploaded_at,
        )
        for e in evidence_records
    ]

    return ReportDetail(
        id=report.id,
        content=content,
        category=report.category,
        urgency=report.urgency,
        status=report.status,
        report_hash=report.report_hash,
        prev_hash=report.prev_hash,
        created_at=report.created_at,
        evidence_count=len(evidence_list),
        evidence_list=evidence_list,
    )


@router.get("/reports/{report_id}/evidence/{evidence_id}/download")
def download_evidence(
    report_id: int,
    evidence_id: int,
    db: Session = Depends(get_db),
    _investigator: Investigator = Depends(get_current_investigator),
):
    evidence = db.query(Evidence).filter(
        Evidence.id == evidence_id,
        Evidence.report_id == report_id
    ).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")

    file_path = BASE_DIR / evidence.sanitized_file_path
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File on disk not found")

    encrypted_bytes = file_path.read_bytes()
    clean_bytes = _fernet.decrypt(encrypted_bytes)

    ext = Path(evidence.sanitized_file_path).suffix.lower()
    media_type = "application/pdf" if ext == ".pdf" else f"image/{ext.replace('.', '')}"
    if media_type == "image/jpg":
        media_type = "image/jpeg"

    headers = {
        "Content-Disposition": f'inline; filename="evidence_{evidence_id}{ext}"'
    }
    return Response(content=clean_bytes, media_type=media_type, headers=headers)


@router.patch("/reports/{report_id}/status", response_model=StatusUpdateResponse)
def update_status(
    report_id: int,
    payload: StatusUpdateRequest,
    db: Session = Depends(get_db),
    investigator: Investigator = Depends(get_current_investigator),
):
    """
    Append-only: this NEVER writes to reports.status directly. It inserts a new
    chained status_updates row, then mirrors the latest status onto reports.status
    as a convenience read-column only — the source of truth is the append-only log.
    """
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if payload.new_status not in VALID_STATUS:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {VALID_STATUS}")

    last_update = (
        db.query(StatusUpdate)
        .filter(StatusUpdate.report_id == report_id)
        .order_by(StatusUpdate.id.desc())
        .first()
    )
    prev_update_hash = last_update.update_hash if last_update else None

    update_hash = compute_update_hash(payload.new_status, report_id, prev_update_hash)

    status_update = StatusUpdate(
        report_id=report_id,
        new_status=payload.new_status,
        updated_by=payload.updated_by or investigator.username,
        update_hash=update_hash,
        prev_update_hash=prev_update_hash,
    )
    db.add(status_update)

    # Convenience mirror only — status_updates remains the append-only source of truth
    report.status = payload.new_status

    db.commit()
    db.refresh(status_update)

    return status_update
