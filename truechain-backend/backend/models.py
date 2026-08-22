"""
ORM models. Mirrors the schema from Overview.docx exactly:
reports, evidence, status_updates, investigators.

Design intent (do not change without re-reading the overview doc):
- `reports` NEVER gets a name/email/PII column. session_token is the only link
  back to the reporter, and only the reporter holds it.
- `reports` and `status_updates` are both hash-chained (report_hash/prev_hash,
  update_hash/prev_update_hash). Application code enforces append-only — there
  is intentionally no UPDATE/DELETE path exposed for report content anywhere
  in routers/services.
"""
from sqlalchemy import (
    Column, Integer, String, Text, LargeBinary, ForeignKey, TIMESTAMP, func
)
from sqlalchemy.orm import relationship

from database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_token = Column(String, nullable=False, index=True, unique=True)
    encrypted_content = Column(LargeBinary, nullable=False)
    category = Column(String, nullable=True)
    urgency = Column(String, nullable=True)
    status = Column(String, nullable=False, default="submitted")
    report_hash = Column(String, nullable=False)
    prev_hash = Column(String, nullable=True)
    embedding = Column(LargeBinary, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    evidence = relationship("Evidence", back_populates="report", cascade="all, delete-orphan")
    status_updates = relationship("StatusUpdate", back_populates="report", cascade="all, delete-orphan")


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, autoincrement=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    sanitized_file_path = Column(String, nullable=False)
    file_hash = Column(String, nullable=False)
    original_metadata_removed = Column(Text, nullable=True)
    uploaded_at = Column(TIMESTAMP, server_default=func.now())

    report = relationship("Report", back_populates="evidence")


class StatusUpdate(Base):
    __tablename__ = "status_updates"

    id = Column(Integer, primary_key=True, autoincrement=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    new_status = Column(String, nullable=False)
    updated_by = Column(String, nullable=True)
    update_hash = Column(String, nullable=False)
    prev_update_hash = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    report = relationship("Report", back_populates="status_updates")


class Investigator(Base):
    __tablename__ = "investigators"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="investigator")
