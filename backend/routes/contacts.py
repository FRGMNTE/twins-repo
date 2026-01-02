"""Contact routes - Contact form and submissions"""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from typing import List
import uuid

from database import db
from models import ContactSubmission, ContactFormInput
from utils.auth import verify_admin_session

router = APIRouter(prefix="/api")

# ============== Public Contact Form ==============

@router.post("/contact")
async def submit_contact_form(form: ContactFormInput):
    contact_id = str(uuid.uuid4())
    timestamp = datetime.now(timezone.utc)
    
    doc = {
        "id": contact_id,
        "name": form.name,
        "email": form.email,
        "thema": form.thema,
        "nachricht": form.nachricht,
        "timestamp": timestamp.isoformat(),
        "status": "neu"
    }
    
    await db.contact_submissions.insert_one(doc)
    return {"success": True, "id": contact_id}

# ============== Admin Contacts ==============

@router.get("/admin/contacts", response_model=List[ContactSubmission])
async def get_all_contacts(token: str, status: str = None):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    query = {}
    if status:
        query["status"] = status
    
    contacts = await db.contact_submissions.find(query, {"_id": 0}).sort("timestamp", -1).to_list(500)
    result = []
    for c in contacts:
        if isinstance(c.get('timestamp'), str):
            c['timestamp'] = datetime.fromisoformat(c['timestamp'])
        result.append(ContactSubmission(**c))
    return result

@router.put("/admin/contacts/{contact_id}/status")
async def update_contact_status(contact_id: str, token: str, status: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    await db.contact_submissions.update_one({"id": contact_id}, {"$set": {"status": status}})
    return {"success": True}

@router.get("/admin/contacts/export")
async def export_contacts(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    contacts = await db.contact_submissions.find({}, {"_id": 0}).to_list(1000)
    
    csv_lines = ["Datum,Name,Email,Thema,Nachricht,Status"]
    for c in contacts:
        timestamp = c.get('timestamp', '')
        if isinstance(timestamp, datetime):
            timestamp = timestamp.isoformat()
        line = f'"{timestamp}","{c.get("name", "")}","{c.get("email", "")}","{c.get("thema", "")}","{c.get("nachricht", "").replace(chr(34), chr(39))}","{c.get("status", "")}"'
        csv_lines.append(line)
    
    return {"csv": "\n".join(csv_lines)}
