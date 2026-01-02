"""Pages routes - CRUD operations for dynamic pages"""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from typing import List
import uuid

from database import db
from models import PageModel, PageCreate
from utils.auth import verify_admin_session

router = APIRouter(prefix="/api")

# ============== Public Pages API ==============

@router.get("/pages")
async def get_public_pages():
    """Get all live pages for public display"""
    pages = await db.pages.find({"status": "live"}, {"_id": 0}).sort("order", 1).to_list(100)
    return pages

@router.get("/pages/{slug}")
async def get_page_by_slug(slug: str):
    """Get a single page by its slug"""
    page = await db.pages.find_one({"slug": slug, "status": "live"}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    return page

# ============== Admin Pages CRUD ==============

@router.get("/admin/pages", response_model=List[PageModel])
async def get_all_pages(token: str, include_deleted: bool = False):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    query = {} if include_deleted else {"status": {"$ne": "deleted"}}
    pages = await db.pages.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    result = []
    for p in pages:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
        if isinstance(p.get('updated_at'), str):
            p['updated_at'] = datetime.fromisoformat(p['updated_at'])
        if isinstance(p.get('deleted_at'), str):
            p['deleted_at'] = datetime.fromisoformat(p['deleted_at'])
        result.append(PageModel(**p))
    return result

@router.post("/admin/pages", response_model=PageModel)
async def create_page(page: PageCreate, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    new_page = PageModel(
        title=page.title,
        slug=page.slug,
        content=page.content,
        status=page.status,
        heroImage=page.heroImage,
        metaTitle=page.metaTitle,
        metaDescription=page.metaDescription
    )
    
    doc = new_page.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.pages.insert_one(doc)
    return new_page

@router.put("/admin/pages/{page_id}", response_model=PageModel)
async def update_page(page_id: str, page: PageCreate, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    update_data = page.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.pages.update_one({"id": page_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    
    updated = await db.pages.find_one({"id": page_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    return PageModel(**updated)

@router.delete("/admin/pages/{page_id}")
async def delete_page(page_id: str, token: str, permanent: bool = False):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    if permanent:
        result = await db.pages.delete_one({"id": page_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    else:
        result = await db.pages.update_one(
            {"id": page_id},
            {"$set": {"status": "deleted", "deleted_at": datetime.now(timezone.utc).isoformat()}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    return {"success": True}

@router.post("/admin/pages/{page_id}/restore")
async def restore_page(page_id: str, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    result = await db.pages.update_one(
        {"id": page_id},
        {"$set": {"status": "draft", "deleted_at": None}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    return {"success": True}

@router.get("/admin/pages/trash")
async def get_trashed_pages(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    pages = await db.pages.find({"status": "deleted"}, {"_id": 0}).to_list(100)
    result = []
    for p in pages:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
        if isinstance(p.get('updated_at'), str):
            p['updated_at'] = datetime.fromisoformat(p['updated_at'])
        if isinstance(p.get('deleted_at'), str):
            p['deleted_at'] = datetime.fromisoformat(p['deleted_at'])
        result.append(p)
    return result

@router.post("/admin/pages/{page_id}/duplicate")
async def duplicate_page(page_id: str, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    original = await db.pages.find_one({"id": page_id}, {"_id": 0})
    if not original:
        raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    
    new_page = dict(original)
    new_page['id'] = str(uuid.uuid4())
    new_page['title'] = f"{original['title']} (Kopie)"
    new_page['slug'] = f"{original['slug']}-kopie"
    new_page['status'] = "draft"
    new_page['created_at'] = datetime.now(timezone.utc).isoformat()
    new_page['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.pages.insert_one(new_page)
    return {"success": True, "id": new_page['id']}

@router.post("/admin/pages/init-defaults")
async def init_default_pages(token: str):
    """Initialize default system pages if they don't exist"""
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    default_pages = [
        {
            "slug": "impressum",
            "title": "Impressum",
            "content": """<h2>Angaben gemäß § 5 TMG</h2>
<p>gltz.de<br>
Familie vom Niederrhein<br>
Deutschland</p>

<h3>Kontakt</h3>
<p>E-Mail: gltz.de@gmail.com</p>

<h3>Haftungsausschluss</h3>
<p>Diese Website dient ausschließlich privaten, nicht-kommerziellen Zwecken.</p>""",
            "status": "live",
            "order": 100
        },
        {
            "slug": "datenschutz",
            "title": "Datenschutzerklärung",
            "content": """<h2>Datenschutzerklärung</h2>
<p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert.</p>""",
            "status": "live",
            "order": 101
        }
    ]
    
    created = 0
    for page_data in default_pages:
        existing = await db.pages.find_one({"slug": page_data["slug"]})
        if not existing:
            new_page = {
                "id": str(uuid.uuid4()),
                **page_data,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            await db.pages.insert_one(new_page)
            created += 1
    
    return {"success": True, "created": created}
