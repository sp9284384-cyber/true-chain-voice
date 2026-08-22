"""
chain_verify.py — the demo centerpiece. Walks the report chain in order,
recomputes each hash from stored (decrypted) content, and compares it to the
stored report_hash. Returns the first row where they diverge, if any.

This is what gets called live on stage: submit → tamper with a DB row →
run this → watch it flag the exact break point.
"""
from sqlalchemy.orm import Session

from models import Report, Evidence
from services.crypto import decrypt_content, compute_report_hash


def _evidence_hash_for(report: Report) -> str | None:
    """A report may have zero or more evidence files; use the first's hash,
    matching how compute_report_hash was originally called at submission time."""
    if report.evidence:
        return report.evidence[0].file_hash
    return None


def verify_chain(db: Session, up_to_report_id: int | None = None) -> dict:
    """
    Walks reports in id order (optionally only up to `up_to_report_id`, so a
    judge can verify "just this record and everything before it"). Returns:
      {verified: bool, total_records: int, broken_at_report_id: int|None, message: str}
    """
    query = db.query(Report).order_by(Report.id.asc())
    if up_to_report_id is not None:
        query = query.filter(Report.id <= up_to_report_id)
    reports = query.all()

    if not reports:
        return {
            "verified": True,
            "total_records": 0,
            "broken_at_report_id": None,
            "message": "No reports in the chain yet.",
        }

    prev_hash = None
    for report in reports:
        try:
            content = decrypt_content(report.encrypted_content)
        except Exception:
            return {
                "verified": False,
                "total_records": len(reports),
                "broken_at_report_id": report.id,
                "message": f"Report {report.id} could not be decrypted — chain integrity compromised.",
            }

        evidence_hash = _evidence_hash_for(report)
        recomputed = compute_report_hash(content, evidence_hash, prev_hash)

        if recomputed != report.report_hash:
            return {
                "verified": False,
                "total_records": len(reports),
                "broken_at_report_id": report.id,
                "message": f"Tampering detected at report {report.id}: stored hash does not match recomputed hash.",
            }

        if report.prev_hash != prev_hash:
            return {
                "verified": False,
                "total_records": len(reports),
                "broken_at_report_id": report.id,
                "message": f"Chain link broken before report {report.id}: prev_hash does not match.",
            }

        prev_hash = report.report_hash

    return {
        "verified": True,
        "total_records": len(reports),
        "broken_at_report_id": None,
        "message": f"All {len(reports)} reports verified — chain is intact.",
    }
