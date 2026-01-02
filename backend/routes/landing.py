"""Landing page routes - Customizable landing page content"""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone

from database import db
from utils.auth import verify_admin_session

router = APIRouter(prefix="/api")

DEFAULT_LANDING_CONTENT = {
    "hero_enabled": True,
    "hero_label": "Willkommen bei unserer Familie",
    "hero_title": "Das Zwillings-Abenteuer",
    "hero_subtitle": "Ehrliche Einblicke in unser Leben mit zwei Babys",
    "hero_description": "Wir teilen unsere Erfahrungen, Tipps und die kleinen Kunstwerke unserer Zwillinge M & O.",
    "hero_cta_text": "Unsere Geschichte",
    "hero_cta_link": "/ueber-uns",
    "hero_secondary_cta_text": "",
    "hero_secondary_cta_link": "",
    "hero_background_type": "none",
    "hero_background_url": "",
    "hero_video_autoplay": True,
    "hero_video_loop": True,
    "hero_video_muted": True,
    "features_enabled": True,
    "features_title": "Was dich hier erwartet",
    "features_items": [],
    "news_enabled": True,
    "news_title": "Aktuelles",
    "news_autoplay_interval": 10,
    "categories_enabled": True,
    "categories_title": "Entdecken",
    "blog_enabled": True,
    "blog_title": "Aus dem Blog",
    "blog_subtitle": "Aktuelle Beiträge und Erfahrungen",
    "blog_max_posts": 4,
    "cta_enabled": True,
    "cta_title": "Möchtest du uns unterstützen?",
    "cta_description": "Mit deiner Hilfe können wir dieses Projekt weiterführen.",
    "cta_button_text": "Unterstützen",
    "cta_button_link": "/spende",
    "custom_sections": []
}

@router.get("/landing-content")
async def get_landing_content():
    """Get landing page content for public display"""
    content = await db.landing_content.find_one({"type": "main"}, {"_id": 0})
    if content:
        return content
    return DEFAULT_LANDING_CONTENT

@router.get("/admin/landing-content")
async def get_admin_landing_content(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    content = await db.landing_content.find_one({"type": "main"}, {"_id": 0})
    if content:
        return content
    return DEFAULT_LANDING_CONTENT

@router.put("/admin/landing-content")
async def update_landing_content(content: dict, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    content["type"] = "main"
    content["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.landing_content.update_one(
        {"type": "main"},
        {"$set": content},
        upsert=True
    )
    return {"success": True}
