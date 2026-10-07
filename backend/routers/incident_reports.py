import hashlib
import html
import json
import logging
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from models.incident_report_shares import IncidentReportShare

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/incident-reports",
    tags=["incident_reports"],
)


class IncidentReportShareRequest(BaseModel):
    session_id: Optional[str] = None
    session_code: Optional[str] = None
    incident_id: Optional[str] = None
    expires_in_minutes: int = Field(
        default=120,
        ge=5,
        le=1440,
    )
    include_health_data: bool = False
    report: Dict[str, Any] = Field(default_factory=dict)


class IncidentReportShareResponse(BaseModel):
    share_id: int
    share_url: str
    expires_at: datetime


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _public_report_html(
    payload: Dict[str, Any],
    expires_at: datetime,
) -> str:
    """Render a simple mobile-friendly public incident report."""

    title = html.escape("ResQKit — Raport de incident")

    report_json = html.escape(
        json.dumps(
            payload,
            ensure_ascii=False,
            indent=2,
            default=str,
        )
    )

    expiry = html.escape(
        expires_at.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    )

    return f"""<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>

<style>
body {{
    font-family: Arial, sans-serif;
    background: #f5fafb;
    margin: 0;
    padding: 20px;
    color: #17324d;
}}

.card {{
    max-width: 760px;
    margin: auto;
    background: #ffffff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}}

h1 {{
    margin-top: 0;
    font-size: 28px;
}}

.muted {{
    color: #64748b;
    font-size: 14px;
}}

pre {{
    white-space: pre-wrap;
    word-break: break-word;
    background: #f4f7f8;
    border-radius: 14px;
    padding: 16px;
    overflow: auto;
}}

.badge {{
    display: inline-block;
    padding: 6px 10px;
    border-radius: 999px;
    background: #e8f7ef;
    color: #18794e;
    font-weight: 700;
}}
</style>
</head>

<body>
<main class="card">

<h1>ResQKit — Raport de incident</h1>

<p class="badge">
    Raport partajat temporar
</p>

<p class="muted">
    Linkul expiră la {expiry}.
    ResQKit nu trimite automat acest raport către 112.
</p>

<pre>{report_json}</pre>

</main>
</body>
</html>"""


async def _get_valid_share(
    token: str,
    db: AsyncSession,
) -> IncidentReportShare:
    token_hash = _hash_token(token)

    result = await db.execute(
        select(IncidentReportShare).where(IncidentReportShare.token_hash == token_hash)
    )

    share = result.scalar_one_or_none()

    if not share:
        raise HTTPException(
            status_code=404,
            detail="Raportul nu există sau linkul este invalid.",
        )

    expires_at = share.expires_at

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=410,
            detail="Linkul raportului a expirat.",
        )

    return share


@router.post(
    "/share",
    response_model=IncidentReportShareResponse,
    status_code=201,
)
async def create_share(
    data: IncidentReportShareRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a temporary public URL for an incident report.

    Authentication is intentionally not required here because an
    emergency session may be started without logging in.
    """

    token = secrets.token_urlsafe(32)

    expires_at = datetime.now(timezone.utc) + timedelta(minutes=data.expires_in_minutes)

    share = IncidentReportShare(
        token_hash=_hash_token(token),
        user_id=None,
        incident_id=data.incident_id,
        session_id=data.session_id,
        payload=data.report,
        include_health_data=(1 if data.include_health_data else 0),
        expires_at=expires_at,
    )

    db.add(share)

    await db.commit()
    await db.refresh(share)

    base = str(request.base_url).rstrip("/")

    share_url = f"{base}/api/v1/incident-reports/public/{token}"

    logger.info(
        "Created temporary incident report share id=%s",
        share.id,
    )

    return IncidentReportShareResponse(
        share_id=share.id,
        share_url=share_url,
        expires_at=expires_at,
    )


@router.get(
    "/public/{token}",
    response_class=HTMLResponse,
)
async def public_share(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    share = await _get_valid_share(token, db)

    return HTMLResponse(
        _public_report_html(
            share.payload,
            share.expires_at,
        )
    )


@router.get("/public/{token}/json")
async def public_share_json(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    share = await _get_valid_share(token, db)

    return {
        "report": share.payload,
        "expires_at": share.expires_at,
    }
