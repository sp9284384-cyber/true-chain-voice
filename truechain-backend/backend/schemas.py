"""
Pydantic schemas — the contract between frontend and backend.
Keep field names in sync with frontend/lib/types.ts when the frontend arrives.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


# ---------- Reports ----------

class ReportCreate(BaseModel):
    content: str = Field(..., min_length=10, description="Free-text report description")
    category: Optional[str] = Field(None, description="Reporter-suggested category (AI may override)")


class ReportSubmitResponse(BaseModel):
    session_token: str
    report_id: int
    message: str = "Report submitted. Save this token — it is the only way to check your report's status."


class ReportStatusResponse(BaseModel):
    session_token: str
    status: str
    category: Optional[str] = None
    urgency: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- Evidence ----------

class EvidenceUploadResponse(BaseModel):
    evidence_id: int
    report_id: int
    file_hash: str
    metadata_removed: Optional[str] = None
    message: str = "File sanitized and stored securely."


# ---------- Investigator ----------

class InvestigatorLogin(BaseModel):
    username: str
    password: str


class InvestigatorLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ReportSummary(BaseModel):
    id: int
    category: Optional[str] = None
    urgency: Optional[str] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReportDetail(BaseModel):
    id: int
    content: str  # decrypted, investigator-only
    category: Optional[str] = None
    urgency: Optional[str] = None
    status: str
    report_hash: str
    prev_hash: Optional[str] = None
    created_at: datetime
    evidence_count: int = 0


class StatusUpdateRequest(BaseModel):
    new_status: str = Field(..., description="submitted | under_review | resolved")
    updated_by: Optional[str] = None


class StatusUpdateResponse(BaseModel):
    id: int
    report_id: int
    new_status: str
    update_hash: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- Chain verification ----------

class ChainVerifyResult(BaseModel):
    verified: bool
    total_records: int
    broken_at_report_id: Optional[int] = None
    message: str
