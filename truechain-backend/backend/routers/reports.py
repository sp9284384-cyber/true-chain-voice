"""
POST /reports            — submit a new anonymous report
GET  /reports/{token}/status — reporter checks their own status via session_token

No auth. No PII fields accepted anywhere in this router, by design.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Report
from schemas import ReportCreate, ReportSubmitResponse, ReportStatusResponse
from services.crypto import encrypt_content, generate_session_token, compute_report_hash
from services.ai_triage import classify_report, generate_embedding

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("", response_model=ReportSubmitResponse, status_code=201)
def submit_report(payload: ReportCreate, db: Session = Depends(get_db)):
    # 1. Classify + embed BEFORE encryption — we need plaintext for the AI step,
    #    but nothing here ever gets stored unencrypted.
    triage = classify_report(payload.content)
    embedding = generate_embedding(payload.content)

    # 2. Find the last report to link the chain
    last_report = db.query(Report).order_by(Report.id.desc()).first()
    prev_hash = last_report.report_hash if last_report else None

    # 3. Encrypt content for storage
    encrypted = encrypt_content(payload.content)

    # 4. Compute this report's chain hash (no evidence yet at creation time —
    #    if evidence is uploaded after, see routers/evidence.py for re-chaining note)
    report_hash = compute_report_hash(payload.content, evidence_hash=None, prev_hash=prev_hash)

    # 5. Random, identity-free session token
    session_token = generate_session_token()

    report = Report(
        session_token=session_token,
        encrypted_content=encrypted,
        category=triage["category"],
        urgency=triage["urgency"],
        status="submitted",
        report_hash=report_hash,
        prev_hash=prev_hash,
        embedding=embedding,
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return ReportSubmitResponse(session_token=session_token, report_id=report.id)


@router.get("/{token}/status", response_model=ReportStatusResponse)
def get_report_status(token: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.session_token == token).first()
    if not report:
        raise HTTPException(status_code=404, detail="No report found for this token")

    return ReportStatusResponse(
        session_token=report.session_token,
        status=report.status,
        category=report.category,
        urgency=report.urgency,
        created_at=report.created_at,
    )
