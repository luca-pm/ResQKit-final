from datetime import datetime

from core.database import Base
from sqlalchemy import Column, DateTime, Integer, JSON, String


class IncidentReportShare(Base):
    """Short-lived server-side snapshot used by QR incident reports."""

    __tablename__ = "incident_report_shares"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    token_hash = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(String(255), nullable=True, index=True)
    incident_id = Column(String(255), nullable=True, index=True)
    session_id = Column(String(255), nullable=True, index=True)
    payload = Column(JSON, nullable=False)
    include_health_data = Column(Integer, nullable=False, default=0)
    expires_at = Column(DateTime(timezone=True), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now, nullable=False)
