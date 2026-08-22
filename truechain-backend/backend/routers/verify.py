"""
GET /verify — public, no auth required. Anyone (including judges) can trigger
the chain-integrity check. Kept outside /investigator/ deliberately so the
integrity demo never needs a login on stage.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas import ChainVerifyResult
from services.chain_verify import verify_chain

router = APIRouter(prefix="/verify", tags=["verify"])


@router.get("", response_model=ChainVerifyResult)
def verify_full_chain(db: Session = Depends(get_db)):
    """Verifies every report in the chain."""
    result = verify_chain(db)
    return ChainVerifyResult(**result)


@router.get("/{report_id}", response_model=ChainVerifyResult)
def verify_up_to_report(report_id: int, db: Session = Depends(get_db)):
    """Verifies the chain up to and including a specific report — matches
    frontend's verifyChain(id?) call in lib/api.ts."""
    result = verify_chain(db, up_to_report_id=report_id)
    return ChainVerifyResult(**result)
