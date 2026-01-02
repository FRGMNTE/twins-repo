"""News routes - News/Announcements for landing page"""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone

from database import db
from models import NewsItem, NewsItemCreate
from utils.auth import verify_admin_session

router = APIRouter(prefix="/api")

# ============== Public News ==============

@router.get("/news")
async def get_public_news():
    """Get all live news items for public display"""
    now = datetime.now(timezone.utc)
    news = await db.news.find({"status": "live"}, {"_id": 0}).sort("order", 1).to_list(20)
    
    filtered = []
    for n in news:
        start = n.get('start_date')
        end = n.get('end_date')
        if start and isinstance(start, str):
            start = datetime.fromisoformat(start)
        if end and isinstance(end, str):
            end = datetime.fromisoformat(end)
        
        if start and start > now:
            continue
        if end and end < now:
            continue
        filtered.append(n)
    
    return filtered

# ============== Admin News CRUD ==============

@router.get("/admin/news")
async def get_all_news(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    news = await db.news.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return news

@router.post("/admin/news")
async def create_news(news: NewsItemCreate, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    new_item = NewsItem(
        title=news.title,
        subtitle=news.subtitle,
        image_url=news.image_url,
        link_url=news.link_url,
        link_type=news.link_type,
        status=news.status,
        order=news.order
    )
    
    doc = new_item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.news.insert_one(doc)
    return {"success": True, "id": new_item.id}

@router.put("/admin/news/{news_id}")
async def update_news(news_id: str, news: NewsItemCreate, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    update_data = news.model_dump()
    await db.news.update_one({"id": news_id}, {"$set": update_data})
    return {"success": True}

@router.delete("/admin/news/{news_id}")
async def delete_news(news_id: str, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    await db.news.delete_one({"id": news_id})
    return {"success": True}
