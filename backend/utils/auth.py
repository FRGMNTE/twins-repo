"""Authentication utilities"""
import hashlib
import secrets
from datetime import datetime, timezone, timedelta
from database import db

DEFAULT_PASSWORD = "gltz2025"

def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

async def verify_admin_session(token: str) -> bool:
    """Verify if an admin session token is valid"""
    session = await db.admin_sessions.find_one({"token": token, "active": True})
    if not session:
        return False
    created = datetime.fromisoformat(session['created_at'])
    if datetime.now(timezone.utc) - created > timedelta(minutes=30):
        await db.admin_sessions.update_one({"token": token}, {"$set": {"active": False}})
        return False
    return True

async def create_admin_session() -> str:
    """Create a new admin session and return the token"""
    token = secrets.token_urlsafe(32)
    await db.admin_sessions.insert_one({
        "token": token,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "active": True
    })
    return token
