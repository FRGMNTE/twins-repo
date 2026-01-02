"""Admin routes - authentication, dashboard, settings"""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone, timedelta
import uuid

from database import db
from models import (
    AdminLogin, SiteSettings, DashboardStats,
    ImpressumContent, DatenschutzContent, CookiesContent
)
from utils.auth import (
    hash_password, verify_admin_session, create_admin_session,
    DEFAULT_PASSWORD
)

router = APIRouter(prefix="/api")

# ============== Admin Auth ==============

@router.post("/admin/login")
async def admin_login(login: AdminLogin):
    settings = await db.admin_settings.find_one({"type": "admin"})
    
    if settings and settings.get('admin_password_hash'):
        stored_hash = settings['admin_password_hash']
    else:
        stored_hash = hash_password(DEFAULT_PASSWORD)
    
    if hash_password(login.password) != stored_hash:
        raise HTTPException(status_code=401, detail="Falsches Passwort")
    
    token = await create_admin_session()
    return {"success": True, "token": token}

@router.get("/admin/verify")
async def verify_admin(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Session abgelaufen")
    return {"valid": True}

@router.post("/admin/logout")
async def admin_logout(token: str):
    await db.admin_sessions.update_one({"token": token}, {"$set": {"active": False}})
    return {"success": True}

@router.post("/admin/change-password")
async def change_password(token: str, old_password: str, new_password: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    settings = await db.admin_settings.find_one({"type": "admin"})
    current_hash = settings.get('admin_password_hash') if settings else hash_password(DEFAULT_PASSWORD)
    
    if hash_password(old_password) != current_hash:
        raise HTTPException(status_code=401, detail="Altes Passwort falsch")
    
    await db.admin_settings.update_one(
        {"type": "admin"},
        {"$set": {"admin_password_hash": hash_password(new_password), "type": "admin"}},
        upsert=True
    )
    return {"success": True}

# ============== Dashboard Stats ==============

@router.get("/admin/stats", response_model=DashboardStats)
async def get_dashboard_stats(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    total_contacts = await db.contact_submissions.count_documents({})
    unread_contacts = await db.contact_submissions.count_documents({"status": "neu"})
    total_pages = await db.pages.count_documents({})
    total_gallery = await db.gallery_images.count_documents({})
    total_posts = await db.blog_posts.count_documents({})
    
    donations = await db.admin_settings.find_one({"type": "donations"})
    donations_count = donations.get('count', 0) if donations else 0
    
    return DashboardStats(
        total_contacts=total_contacts,
        unread_contacts=unread_contacts,
        total_pages=total_pages,
        total_gallery=total_gallery,
        total_posts=total_posts,
        donations_count=donations_count
    )

@router.post("/admin/donations/increment")
async def increment_donations(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    await db.admin_settings.update_one(
        {"type": "donations"},
        {"$inc": {"count": 1}, "$set": {"type": "donations"}},
        upsert=True
    )
    return {"success": True}

# ============== Site Settings ==============

@router.get("/settings", response_model=SiteSettings)
async def get_site_settings():
    settings = await db.site_settings.find_one({"type": "main"}, {"_id": 0})
    if settings:
        return SiteSettings(**settings)
    return SiteSettings()

@router.post("/settings", response_model=SiteSettings)
async def save_site_settings(settings: SiteSettings, token: str = None):
    settings_dict = settings.model_dump()
    settings_dict["type"] = "main"
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.site_settings.update_one(
        {"type": "main"},
        {"$set": settings_dict},
        upsert=True
    )
    return settings

# ============== Structured Page Content (Impressum, Datenschutz, Cookies) ==============

@router.get("/page-content/impressum")
async def get_impressum_content():
    content = await db.page_content.find_one({"type": "impressum"}, {"_id": 0})
    if content:
        return content
    return ImpressumContent().model_dump()

@router.get("/admin/page-content/impressum")
async def get_admin_impressum_content(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    content = await db.page_content.find_one({"type": "impressum"}, {"_id": 0})
    if content:
        return content
    return ImpressumContent().model_dump()

@router.put("/admin/page-content/impressum")
async def update_impressum_content(content: ImpressumContent, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    content_dict = content.model_dump()
    content_dict["type"] = "impressum"
    content_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.page_content.update_one(
        {"type": "impressum"},
        {"$set": content_dict},
        upsert=True
    )
    return {"success": True}

@router.get("/page-content/datenschutz")
async def get_datenschutz_content():
    content = await db.page_content.find_one({"type": "datenschutz"}, {"_id": 0})
    if content:
        return content
    return DatenschutzContent().model_dump()

@router.get("/admin/page-content/datenschutz")
async def get_admin_datenschutz_content(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    content = await db.page_content.find_one({"type": "datenschutz"}, {"_id": 0})
    if content:
        return content
    return DatenschutzContent().model_dump()

@router.put("/admin/page-content/datenschutz")
async def update_datenschutz_content(content: DatenschutzContent, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    content_dict = content.model_dump()
    content_dict["type"] = "datenschutz"
    content_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.page_content.update_one(
        {"type": "datenschutz"},
        {"$set": content_dict},
        upsert=True
    )
    return {"success": True}

@router.get("/page-content/cookies")
async def get_cookies_content():
    content = await db.page_content.find_one({"type": "cookies"}, {"_id": 0})
    if content:
        return content
    return CookiesContent().model_dump()

@router.get("/admin/page-content/cookies")
async def get_admin_cookies_content(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    content = await db.page_content.find_one({"type": "cookies"}, {"_id": 0})
    if content:
        return content
    return CookiesContent().model_dump()

@router.put("/admin/page-content/cookies")
async def update_cookies_content(content: CookiesContent, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    content_dict = content.model_dump()
    content_dict["type"] = "cookies"
    content_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.page_content.update_one(
        {"type": "cookies"},
        {"$set": content_dict},
        upsert=True
    )
    return {"success": True}

# ============== Trash Management ==============

@router.post("/admin/trash/cleanup")
async def cleanup_trash(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    
    pages_result = await db.pages.delete_many({
        "status": "deleted",
        "deleted_at": {"$lt": thirty_days_ago.isoformat()}
    })
    
    posts_result = await db.blog_posts.delete_many({
        "status": "deleted", 
        "deleted_at": {"$lt": thirty_days_ago.isoformat()}
    })
    
    return {
        "success": True,
        "deleted_pages": pages_result.deleted_count,
        "deleted_posts": posts_result.deleted_count
    }

@router.post("/admin/trash/empty")
async def empty_trash(token: str, type: str = "all"):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    deleted_pages = 0
    deleted_posts = 0
    
    if type in ["all", "pages"]:
        result = await db.pages.delete_many({"status": "deleted"})
        deleted_pages = result.deleted_count
    
    if type in ["all", "posts"]:
        result = await db.blog_posts.delete_many({"status": "deleted"})
        deleted_posts = result.deleted_count
    
    return {
        "success": True,
        "deleted_pages": deleted_pages,
        "deleted_posts": deleted_posts
    }
