"""add incident report shares

Revision ID: 7c2f1d9b4a01
Revises: f2c17a9b3d41
"""

from alembic import op
import sqlalchemy as sa

revision = "7c2f1d9b4a01"
down_revision = "f2c17a9b3d41"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "incident_report_shares",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
        sa.Column("token_hash", sa.String(length=64), nullable=False),
        sa.Column("user_id", sa.String(length=255), nullable=True),
        sa.Column("incident_id", sa.String(length=255), nullable=True),
        sa.Column("session_id", sa.String(length=255), nullable=True),
        sa.Column("payload", sa.JSON(), nullable=False),
        sa.Column("include_health_data", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(
        "ix_incident_report_shares_token_hash",
        "incident_report_shares",
        ["token_hash"],
        unique=True,
    )
    op.create_index(
        "ix_incident_report_shares_user_id",
        "incident_report_shares",
        ["user_id"],
    )
    op.create_index(
        "ix_incident_report_shares_incident_id",
        "incident_report_shares",
        ["incident_id"],
    )
    op.create_index(
        "ix_incident_report_shares_session_id",
        "incident_report_shares",
        ["session_id"],
    )
    op.create_index(
        "ix_incident_report_shares_expires_at",
        "incident_report_shares",
        ["expires_at"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_incident_report_shares_expires_at",
        table_name="incident_report_shares",
    )
    op.drop_index(
        "ix_incident_report_shares_session_id",
        table_name="incident_report_shares",
    )
    op.drop_index(
        "ix_incident_report_shares_incident_id",
        table_name="incident_report_shares",
    )
    op.drop_index(
        "ix_incident_report_shares_user_id",
        table_name="incident_report_shares",
    )
    op.drop_index(
        "ix_incident_report_shares_token_hash",
        table_name="incident_report_shares",
    )
    op.drop_table("incident_report_shares")
