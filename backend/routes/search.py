"""Search and seed routes"""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
import uuid

from database import db
from utils.auth import verify_admin_session

router = APIRouter(prefix="/api")

# Static page defaults for search
STATIC_PAGE_DEFAULTS_SEARCH = [
    {"page_id": "schwangerschaft", "title": "Schwangerschaft", "hero_title": "Zwillings-Schwangerschaft", "hero_description": "Eine Zwillingsschwangerschaft ist besonders", "path": "/schwangerschaft"},
    {"page_id": "baby-alltag", "title": "Baby-Alltag", "hero_title": "Leben mit Zwillingen", "hero_description": "Der Alltag mit zwei Babys ist intensiv", "path": "/baby-alltag"},
    {"page_id": "tipps", "title": "Tipps & Tricks", "hero_title": "Praktische Ratschläge", "hero_description": "Gesammelte Weisheiten aus unserem Alltag", "path": "/tipps"},
    {"page_id": "reisen", "title": "Reisen", "hero_title": "Unterwegs mit Zwillingen", "hero_description": "Reisen mit zwei kleinen Kindern", "path": "/reisen"},
    {"page_id": "ueber-uns", "title": "Über uns", "hero_title": "Unsere Geschichte", "hero_description": "Wir sind eine junge Familie", "path": "/ueber-uns"},
    {"page_id": "spende", "title": "Spende", "hero_title": "Projekt unterstützen", "hero_description": "Mit deiner Unterstützung", "path": "/spende"},
]

@router.get("/search")
async def search_content(q: str):
    """Search across all content: pages, blog posts, gallery, and static pages"""
    if not q or len(q) < 2:
        return {"pages": [], "posts": [], "gallery": [], "static_pages": []}
    
    query_lower = q.lower()
    
    # Search in dynamic pages
    pages = await db.pages.find({"status": "live"}, {"_id": 0}).to_list(100)
    filtered_pages = [
        p for p in pages 
        if query_lower in p.get('title', '').lower() or 
           query_lower in p.get('content', '').lower() or
           query_lower in p.get('slug', '').lower()
    ]
    
    # Search in blog posts
    posts = await db.blog_posts.find({"status": "live"}, {"_id": 0}).to_list(100)
    filtered_posts = [
        p for p in posts 
        if query_lower in p.get('title', '').lower() or 
           query_lower in p.get('excerpt', '').lower() or
           query_lower in p.get('category', '').lower() or
           query_lower in p.get('content', '').lower()
    ]
    
    # Search in gallery
    images = await db.gallery_images.find({}, {"_id": 0}).to_list(100)
    filtered_gallery = [
        g for g in images 
        if query_lower in g.get('title', '').lower() or 
           any(query_lower in t.lower() for t in g.get('tags', []))
    ]
    
    # Search in static pages
    static_pages_db = await db.static_pages.find({}, {"_id": 0}).to_list(100)
    static_pages_merged = {p['page_id']: p for p in STATIC_PAGE_DEFAULTS_SEARCH}
    for p in static_pages_db:
        static_pages_merged[p['page_id']] = {**static_pages_merged.get(p['page_id'], {}), **p}
    
    filtered_static = []
    for page in static_pages_merged.values():
        searchable_text = f"{page.get('title', '')} {page.get('hero_title', '')} {page.get('hero_description', '')} {page.get('hero_label', '')}".lower()
        for section in page.get('sections', []):
            searchable_text += f" {section.get('title', '')} {section.get('description', '')} {section.get('subtitle', '')}".lower()
            for item in section.get('items', []):
                if isinstance(item, str):
                    searchable_text += f" {item}".lower()
                elif isinstance(item, dict):
                    searchable_text += f" {item.get('title', '')} {item.get('content', '')}".lower()
        
        if query_lower in searchable_text:
            filtered_static.append({
                "page_id": page.get('page_id'),
                "title": page.get('hero_title') or page.get('title', ''),
                "description": page.get('hero_description', ''),
                "path": page.get('path', f"/{page.get('page_id', '')}")
            })
    
    return {
        "pages": filtered_pages,
        "posts": filtered_posts,
        "gallery": filtered_gallery,
        "static_pages": filtered_static
    }

@router.post("/seed")
async def seed_data():
    """Seed default data if database is empty"""
    existing_posts = await db.blog_posts.count_documents({})
    if existing_posts == 0:
        default_posts = [
            {
                "id": str(uuid.uuid4()),
                "title": "Schlaf-Routinen für Zwillinge",
                "excerpt": "Wie wir unsere Zwillinge gleichzeitig zum Schlafen bringen.",
                "content": "Der Schlaf ist eine der größten Herausforderungen...",
                "category": "Schlaf",
                "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
                "status": "live",
                "publish_date": datetime.now(timezone.utc).isoformat(),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Tandem-Stillen leicht gemacht",
                "excerpt": "Praktische Positionen für das gleichzeitige Stillen.",
                "content": "Das Tandem-Stillen war anfangs eine Herausforderung...",
                "category": "Füttern",
                "image_url": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400",
                "status": "live",
                "publish_date": datetime.now(timezone.utc).isoformat(),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "10 Hacks für den Zwillingsalltag",
                "excerpt": "Von der Wickelstation bis zum Einkaufen.",
                "content": "Nach einem Jahr mit Zwillingen haben wir viel gelernt...",
                "category": "Tipps",
                "image_url": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400",
                "status": "live",
                "publish_date": datetime.now(timezone.utc).isoformat(),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.blog_posts.insert_many(default_posts)
    
    existing_images = await db.gallery_images.count_documents({})
    if existing_images == 0:
        default_images = [
            {"id": str(uuid.uuid4()), "url": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600", "title": "Handabdrücke", "alt": "Bunte Kinderkunst - Handabdrücke", "tags": ["Baby-Art", "Handabdrücke"], "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600", "title": "Abstrakt", "alt": "Abstrakte Kindermalerei", "tags": ["Abstrakt"], "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "url": "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600", "title": "Familie", "alt": "Kreative Familienmotive", "tags": ["Familie"], "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "url": "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600", "title": "Fingermalerei", "alt": "Fingermalerei von Kindern", "tags": ["Baby-Art"], "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "url": "https://images.unsplash.com/photo-1499892477393-f675706cbe6e?w=600", "title": "Farbkleckse", "alt": "Bunte Farbkleckse", "tags": ["Abstrakt"], "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "url": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600", "title": "Kleine Hände", "alt": "Kunstwerke von kleinen Händen", "tags": ["Baby-Art", "Familie"], "created_at": datetime.now(timezone.utc).isoformat()},
        ]
        await db.gallery_images.insert_many(default_images)
    
    existing_pages = await db.pages.count_documents({})
    if existing_pages == 0:
        default_pages = [
            {"id": str(uuid.uuid4()), "title": "Impressum", "slug": "impressum", "content": "Impressum Inhalt hier...", "status": "live", "order": 1, "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "Datenschutz", "slug": "datenschutz", "content": "Datenschutzerklärung hier...", "status": "live", "order": 2, "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
        ]
        await db.pages.insert_many(default_pages)
    
    return {"success": True}

@router.get("/")
async def root():
    return {"message": "gltz.de API"}
