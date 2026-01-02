"""Static pages routes - Schwangerschaft, BabyAlltag, Tipps, etc."""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone

from database import db
from utils.auth import verify_admin_session

router = APIRouter(prefix="/api")

# Default content for each page
STATIC_PAGE_DEFAULTS = {
    "schwangerschaft": {
        "hero_label": "Schwangerschaft",
        "hero_title": "Zwillings-Schwangerschaft",
        "hero_description": "Eine Zwillingsschwangerschaft ist besonders – in jeder Hinsicht. Hier teilen wir unsere Erfahrungen und geben Tipps für jedes Trimester.",
        "sections": [
            {"id": "1", "title": "1. Trimester (1-12 Woche)", "subtitle": "Der aufregende Anfang", "items": ["Frühe Ultraschalle zur Bestätigung der Zwillinge", "Häufigere Arzttermine als bei Einlings-Schwangerschaften", "Stärkere Morgenübelkeit möglich", "Wichtig: Folsäure und ausreichend Ruhe"]},
            {"id": "2", "title": "2. Trimester (13-26 Woche)", "subtitle": "Die goldene Phase", "items": ["Mehr Energie, weniger Übelkeit", "Erste Kindsbewegungen spürbar", "Regelmäßige Kontrollen des Gebärmutterhalses", "Bauch wächst schneller als bei Einlingen"]},
            {"id": "3", "title": "3. Trimester (27-40 Woche)", "subtitle": "Der Endspurt", "items": ["Wöchentliche CTG-Kontrollen", "Vorbereitung auf mögliche Frühgeburt", "Krankenhaustasche früh packen", "Zwillinge kommen oft früher (ca. 37. Woche)"]}
        ],
        "cta_title": "Mehr erfahren",
        "cta_link": "/baby-alltag",
        "cta_link_text": "Weiter zum Baby-Alltag"
    },
    "baby-alltag": {
        "hero_label": "Baby-Alltag",
        "hero_title": "Leben mit Zwillingen",
        "hero_description": "Der Alltag mit zwei Babys ist intensiv, aber auch wunderschön. Hier zeigen wir, wie wir unseren Tag strukturieren und welche Tipps uns helfen.",
        "sections": [
            {"id": "1", "title": "06:00 - Aufwachen", "description": "Erste Flasche/Stillen"},
            {"id": "2", "title": "08:00 - Frühstück", "description": "Frühstück & Spielzeit"},
            {"id": "3", "title": "10:00 - Schläfchen", "description": "Vormittags-Schläfchen"},
            {"id": "4", "title": "12:00 - Mittagessen", "description": "Mittagessen & Wickeln"}
        ],
        "cta_title": "Praktische Tipps",
        "cta_link": "/tipps",
        "cta_link_text": "Zu unseren Tipps"
    },
    "tipps": {
        "hero_label": "Tipps & Tricks",
        "hero_title": "Praktische Tipps für Zwillingseltern",
        "hero_description": "Gesammelte Weisheiten und praktische Ratschläge aus unserem Alltag mit Zwillingen.",
        "sections": [],
        "cta_link": "/kontakt",
        "cta_link_text": "Fragen? Kontaktiere uns"
    },
    "reisen": {
        "hero_label": "Reisen",
        "hero_title": "Reisen mit Zwillingen",
        "hero_description": "Unterwegs mit zwei Babys – unsere Erfahrungen und Tipps für stressfreie Ausflüge und Reisen.",
        "sections": [],
        "cta_link": "/kontakt",
        "cta_link_text": "Eure Reise-Tipps teilen"
    },
    "ueber-uns": {
        "hero_label": "Über uns",
        "hero_title": "Unsere Geschichte",
        "hero_description": "Wir sind eine junge Familie vom Niederrhein mit Zwillingen. Hier teilen wir unsere Erfahrungen.",
        "sections": [],
        "cta_link": "/kontakt",
        "cta_link_text": "Schreib uns"
    },
    "spende": {
        "hero_label": "Unterstützung",
        "hero_title": "Projekt unterstützen",
        "hero_description": "Mit deiner Unterstützung hilfst du uns, dieses Projekt weiterzuführen.",
        "sections": [],
        "cta_link": "https://paypal.me/gltzfamily",
        "cta_link_text": "Via PayPal unterstützen"
    },
    "suchen": {
        "hero_label": "Suche",
        "hero_title": "Inhalte durchsuchen",
        "hero_description": "Finde schnell was du suchst.",
        "sections": []
    }
}

@router.get("/static-pages/{page_id}")
async def get_static_page_content(page_id: str):
    """Get static page content for public display"""
    content = await db.static_pages.find_one({"page_id": page_id}, {"_id": 0})
    if content:
        return content
    defaults = STATIC_PAGE_DEFAULTS.get(page_id, {})
    return {"page_id": page_id, **defaults}

@router.get("/admin/static-pages")
async def get_all_static_pages(token: str):
    """Get all static pages for admin"""
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    pages = await db.static_pages.find({}, {"_id": 0}).to_list(100)
    result = {}
    for page_id, defaults in STATIC_PAGE_DEFAULTS.items():
        result[page_id] = {"page_id": page_id, **defaults}
    
    for page in pages:
        result[page["page_id"]] = page
    
    return list(result.values())

@router.get("/admin/static-pages/{page_id}")
async def get_admin_static_page(page_id: str, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    content = await db.static_pages.find_one({"page_id": page_id}, {"_id": 0})
    if content:
        return content
    defaults = STATIC_PAGE_DEFAULTS.get(page_id, {})
    return {"page_id": page_id, **defaults}

@router.put("/admin/static-pages/{page_id}")
async def update_static_page(page_id: str, content: dict, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    content["page_id"] = page_id
    content["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.static_pages.update_one(
        {"page_id": page_id},
        {"$set": content},
        upsert=True
    )
    return {"success": True}

@router.post("/admin/static-pages")
async def create_static_page(content: dict, token: str):
    """Create a new custom static page"""
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    page_id = content.get("page_id")
    if not page_id:
        raise HTTPException(status_code=400, detail="page_id ist erforderlich")
    
    # Check if page already exists
    existing = await db.static_pages.find_one({"page_id": page_id})
    if existing or page_id in STATIC_PAGE_DEFAULTS:
        raise HTTPException(status_code=400, detail="Seite existiert bereits")
    
    content["page_id"] = page_id
    content["custom"] = True
    content["created_at"] = datetime.now(timezone.utc).isoformat()
    content["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.static_pages.insert_one(content)
    return {"success": True, "page_id": page_id}

@router.delete("/admin/static-pages/{page_id}")
async def delete_static_page(page_id: str, token: str):
    """Delete a custom static page"""
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    # Don't allow deleting default pages
    if page_id in STATIC_PAGE_DEFAULTS:
        raise HTTPException(status_code=400, detail="Standard-Seiten können nicht gelöscht werden")
    
    result = await db.static_pages.delete_one({"page_id": page_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    
    return {"success": True}

@router.post("/admin/static-pages/{page_id}/duplicate")
async def duplicate_static_page(page_id: str, token: str, new_page_id: str = None):
    """Duplicate a static page"""
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    # Get the source page
    source = await db.static_pages.find_one({"page_id": page_id}, {"_id": 0})
    if not source:
        # Check if it's a default page
        if page_id in STATIC_PAGE_DEFAULTS:
            source = {"page_id": page_id, **STATIC_PAGE_DEFAULTS[page_id]}
        else:
            raise HTTPException(status_code=404, detail="Quell-Seite nicht gefunden")
    
    # Generate new page_id
    import uuid
    new_id = new_page_id or f"{page_id}-kopie-{str(uuid.uuid4())[:8]}"
    
    # Create duplicate
    new_page = dict(source)
    new_page["page_id"] = new_id
    new_page["hero_title"] = f"{source.get('hero_title', 'Neue Seite')} (Kopie)"
    new_page["custom"] = True
    new_page["created_at"] = datetime.now(timezone.utc).isoformat()
    new_page["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.static_pages.insert_one(new_page)
    return {"success": True, "page_id": new_id}

