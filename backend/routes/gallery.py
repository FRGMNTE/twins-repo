"""Gallery routes - CRUD operations for gallery images"""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from typing import List

from database import db
from models import GalleryImage
from utils.auth import verify_admin_session

router = APIRouter(prefix="/api")

# ============== Public Gallery ==============

@router.get("/gallery")
async def get_public_gallery():
    images = await db.gallery_images.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    result = []
    for img in images:
        if isinstance(img.get('created_at'), str):
            img['created_at'] = datetime.fromisoformat(img['created_at'])
        result.append(img)
    return result

# ============== Admin Gallery CRUD ==============

@router.get("/admin/gallery", response_model=List[GalleryImage])
async def get_all_gallery(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    images = await db.gallery_images.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    result = []
    for img in images:
        if isinstance(img.get('created_at'), str):
            img['created_at'] = datetime.fromisoformat(img['created_at'])
        result.append(GalleryImage(**img))
    return result

@router.post("/admin/gallery")
async def add_gallery_image(token: str, url: str, title: str = "", alt: str = "", tags: str = ""):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    tag_list = [t.strip() for t in tags.split(",") if t.strip()]
    
    image = GalleryImage(
        url=url,
        title=title,
        alt=alt or title,
        tags=tag_list
    )
    
    doc = image.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.gallery_images.insert_one(doc)
    return {"success": True, "id": image.id}

@router.put("/admin/gallery/{image_id}")
async def update_gallery_image(image_id: str, token: str, title: str = None, alt: str = None, caption: str = None, tags: str = None, featured: bool = None, externalLink: str = None):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    update_data = {}
    if title is not None: update_data['title'] = title
    if alt is not None: update_data['alt'] = alt
    if caption is not None: update_data['caption'] = caption
    if tags is not None: update_data['tags'] = [t.strip() for t in tags.split(",") if t.strip()]
    if featured is not None: 
        if featured:
            await db.gallery_images.update_many({}, {"$set": {"featured": False}})
        update_data['featured'] = featured
    if externalLink is not None: update_data['externalLink'] = externalLink
    
    await db.gallery_images.update_one({"id": image_id}, {"$set": update_data})
    return {"success": True}

@router.delete("/admin/gallery/{image_id}")
async def delete_gallery_image(image_id: str, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    result = await db.gallery_images.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bild nicht gefunden")
    return {"success": True}
