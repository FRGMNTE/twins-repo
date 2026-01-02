"""Blog routes - CRUD operations for blog posts"""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from typing import List

from database import db
from models import BlogPost, BlogPostCreate
from utils.auth import verify_admin_session

router = APIRouter(prefix="/api")

# ============== Public Blog API ==============

@router.get("/blog")
async def get_public_blog(limit: int = 10):
    posts = await db.blog_posts.find({"status": "live"}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    result = []
    for p in posts:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
        result.append(p)
    return result

@router.get("/blog/{post_id}")
async def get_blog_post(post_id: str):
    post = await db.blog_posts.find_one({"id": post_id, "status": "live"}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Beitrag nicht gefunden")
    return post

# ============== Admin Blog CRUD ==============

@router.get("/admin/posts", response_model=List[BlogPost])
async def get_all_posts(token: str, include_deleted: bool = False):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    query = {} if include_deleted else {"status": {"$ne": "deleted"}}
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("publish_date", -1).to_list(100)
    result = []
    for p in posts:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
        if isinstance(p.get('updated_at'), str):
            p['updated_at'] = datetime.fromisoformat(p['updated_at'])
        if isinstance(p.get('publish_date'), str):
            p['publish_date'] = datetime.fromisoformat(p['publish_date'])
        if isinstance(p.get('deleted_at'), str):
            p['deleted_at'] = datetime.fromisoformat(p['deleted_at'])
        if 'publish_date' not in p:
            p['publish_date'] = p.get('created_at', datetime.now(timezone.utc))
        result.append(BlogPost(**p))
    return result

@router.post("/admin/posts", response_model=BlogPost)
async def create_post(post: BlogPostCreate, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    publish_date = datetime.fromisoformat(post.publish_date) if post.publish_date else datetime.now(timezone.utc)
    
    new_post = BlogPost(
        title=post.title,
        excerpt=post.excerpt,
        content=post.content,
        category=post.category,
        image_url=post.image_url,
        status=post.status,
        publish_date=publish_date
    )
    
    doc = new_post.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    doc['publish_date'] = doc['publish_date'].isoformat()
    
    await db.blog_posts.insert_one(doc)
    return new_post

@router.put("/admin/posts/{post_id}", response_model=BlogPost)
async def update_post(post_id: str, post: BlogPostCreate, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    update_data = post.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    if post.publish_date:
        update_data['publish_date'] = post.publish_date
    
    await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    
    updated = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    if isinstance(updated.get('publish_date'), str):
        updated['publish_date'] = datetime.fromisoformat(updated['publish_date'])
    if 'publish_date' not in updated or updated['publish_date'] is None:
        updated['publish_date'] = updated.get('created_at', datetime.now(timezone.utc))
    return BlogPost(**updated)

@router.delete("/admin/posts/{post_id}")
async def delete_post(post_id: str, token: str, permanent: bool = False):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    if permanent:
        await db.blog_posts.delete_one({"id": post_id})
    else:
        await db.blog_posts.update_one(
            {"id": post_id},
            {"$set": {"status": "deleted", "deleted_at": datetime.now(timezone.utc).isoformat()}}
        )
    return {"success": True}

@router.post("/admin/posts/{post_id}/restore")
async def restore_post(post_id: str, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    await db.blog_posts.update_one(
        {"id": post_id},
        {"$set": {"status": "draft", "deleted_at": None}}
    )
    return {"success": True}

@router.get("/admin/posts/trash")
async def get_trashed_posts(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    posts = await db.blog_posts.find({"status": "deleted"}, {"_id": 0}).to_list(100)
    result = []
    for p in posts:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
        if isinstance(p.get('deleted_at'), str):
            p['deleted_at'] = datetime.fromisoformat(p['deleted_at'])
        if isinstance(p.get('publish_date'), str):
            p['publish_date'] = datetime.fromisoformat(p['publish_date'])
        result.append(p)
    return result
