from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import secrets
import hashlib
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBasic()

# ============== Models ==============

class AdminLogin(BaseModel):
    password: str

class AdminSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    admin_password_hash: Optional[str] = None
    session_timeout_minutes: int = 30

class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    siteTitle: str = "gltz.de – Twins-Projekt"
    heroTitle: str = "gltz.de"
    heroSubtitle: str = "Unsere Reise mit Zwillingen"
    heroDescription: str = "Anonyme Tipps für junge Familien vom Niederrhein."
    fontFamily: str = "Inter"
    primaryColor: str = "#1d1d1f"
    lightBackground: str = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920"
    darkBackground: str = "https://images.unsplash.com/photo-1516572704891-60b47497c7b5?w=1920"
    logoText: str = "gltz.de"
    logoImage: Optional[str] = None  # Logo image URL (alternative to logoText)
    defaultTheme: str = "light"
    paypalLink: str = "https://paypal.me/gltzfamily"
    donationText: str = "Projekt unterstützen"
    donationDisclaimer: str = "Dies ist keine Spende im steuerlichen Sinne. Es erfolgt keine Gegenleistung. 100% freiwillige Unterstützung für unser Familienprojekt."
    ga4Tag: Optional[str] = None
    metaDescription: str = "Zwillings-Tipps für junge Familien"
    autoReplyMessage: str = "Danke für deine Nachricht – wir melden uns in 24h!"
    # Navigation with submenus support
    navItems: List[Dict[str, Any]] = [
        {"id": "1", "label": "Home", "path": "/", "enabled": True, "children": []},
        {"id": "2", "label": "Über uns", "path": "/ueber-uns", "enabled": True, "children": []},
        {"id": "3", "label": "Schwangerschaft", "path": "/schwangerschaft", "enabled": True, "children": []},
        {"id": "4", "label": "Baby-Alltag", "path": "/baby-alltag", "enabled": True, "children": []},
        {"id": "5", "label": "Tipps", "path": "/tipps", "enabled": True, "children": []},
        {"id": "6", "label": "Reisen", "path": "/reisen", "enabled": True, "children": []},
        {"id": "7", "label": "Blog", "path": "/blog", "enabled": True, "children": []},
        {"id": "8", "label": "Suchen", "path": "/suchen", "enabled": True, "children": []},
        {"id": "9", "label": "M&O Portfolio", "path": "/mo-portfolio", "enabled": True, "children": [
            {"id": "9-1", "label": "Twins-Art", "path": "/twins-art", "enabled": True}
        ]},
        {"id": "10", "label": "Spende", "path": "/spende", "enabled": True, "children": []},
        {"id": "11", "label": "Kontakt", "path": "/kontakt", "enabled": True, "children": []},
    ]
    # Footer
    footerText: str = "Unsere Reise mit Zwillingen. Anonyme Tipps für junge Familien."
    footerLinks: List[Dict[str, Any]] = []
    footerEmail: str = "gltz.de@gmail.com"  # Footer contact - only email
    # Social Links (separate section)
    socialLinks: List[Dict[str, Any]] = [
        {"id": "1", "platform": "facebook", "url": "https://www.facebook.com/people/%E0%B9%80%E0%B8%A1%E0%B8%B2%E0%B8%99%E0%B9%8C%E0%B9%80%E0%B8%97%E0%B8%B4%E0%B8%99-%E0%B9%82%E0%B8%AD%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B9%88%E0%B8%99/61584716588683/", "enabled": True},
        {"id": "2", "platform": "instagram", "url": "", "enabled": False},
        {"id": "3", "platform": "youtube", "url": "", "enabled": False},
        {"id": "4", "platform": "tiktok", "url": "", "enabled": False},
        {"id": "5", "platform": "twitter", "url": "", "enabled": False},
    ]
    # Legacy fields (for backward compatibility)
    socialFacebook: str = ""
    socialEmail: str = "gltz.de@gmail.com"
    # Landing Page Teaser Cards
    teaserCards: List[Dict[str, Any]] = []
    # CTA Section
    ctaTitle: str = "Projekt unterstützen"
    ctaDescription: str = "Die Kunst bringt Freude, Einnahmen bleiben 100% in der Familie."
    ctaButtonText: str = "Unterstützen"

class PageModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    content: str = ""
    status: str = "draft"  # draft, live, deleted
    heroImage: Optional[str] = None
    metaTitle: Optional[str] = None
    metaDescription: Optional[str] = None
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = None  # For trash functionality

class PageCreate(BaseModel):
    title: str
    slug: str
    content: str = ""
    status: str = "draft"
    heroImage: Optional[str] = None
    metaTitle: Optional[str] = None
    metaDescription: Optional[str] = None

class GalleryImage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    filename: str = ""
    title: str = ""
    alt: str = ""
    caption: str = ""
    tags: List[str] = []
    featured: bool = False
    externalLink: Optional[str] = None
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: Optional[str] = None
    email: str
    thema: str
    nachricht: str
    timestamp: datetime
    status: str = "neu"  # neu, gelesen, beantwortet

class ContactFormInput(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    thema: str
    nachricht: str

# News/Announcements Model for Landing Page
class NewsItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: Optional[str] = None
    image_url: str
    link_url: Optional[str] = None  # URL to redirect when clicked
    link_type: str = "internal"  # internal, external, blog, page
    status: str = "draft"  # draft, live
    order: int = 0
    start_date: Optional[datetime] = None  # Optional: show only after this date
    end_date: Optional[datetime] = None  # Optional: hide after this date
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsItemCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    image_url: str
    link_url: Optional[str] = None
    link_type: str = "internal"
    status: str = "draft"
    order: int = 0

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    category: str
    image_url: Optional[str] = None
    status: str = "draft"  # draft, live, deleted
    publish_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # For sorting/ordering
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = None  # For trash functionality

class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    image_url: Optional[str] = None
    status: str = "draft"
    publish_date: Optional[str] = None  # ISO format string

class DashboardStats(BaseModel):
    total_contacts: int = 0
    unread_contacts: int = 0
    total_pages: int = 0
    total_gallery: int = 0
    total_posts: int = 0
    donations_count: int = 0

class LegalText(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    type: str  # impressum, datenschutz
    content: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Structured Page Content Models for editable design pages
class ImpressumContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    # Provider info
    provider_name: str = "John D. Gold"
    provider_street: str = "Schützenstraße 38"
    provider_city: str = "47829 Krefeld"
    provider_country: str = "Deutschland"
    provider_phone: str = "01575 731 2560"
    provider_email: str = "gltz.de@gmail.com"
    # Responsible person
    responsible_name: str = "John D. Gold"
    responsible_address: str = "Schützenstraße 38, 47829 Krefeld"
    # Legal texts
    liability_content: str = "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen."
    liability_links: str = "Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben."
    copyright_text: str = "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht."
    dispute_text: str = "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DatenschutzContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    # Responsible person
    responsible_name: str = "John D. Gold"
    responsible_address: str = "Schützenstraße 38, 47829 Krefeld"
    responsible_email: str = "gltz.de@gmail.com"
    # Section texts
    intro_text: str = "Der Schutz deiner persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung informiert dich darüber, welche Daten wir erheben und wie wir sie verwenden."
    contact_form_text: str = "Wenn du uns über das Kontaktformular kontaktierst, werden Name, E-Mail, Thema und Nachricht erhoben."
    contact_form_purpose: str = "Zweck: Bearbeitung deiner Anfrage. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Speicherdauer: Bis zur Erledigung, maximal 2 Jahre."
    cookies_text: str = "Wir verwenden nur technisch notwendige Cookies für den Betrieb dieser Website (z.B. für Dark/Light Mode Einstellungen)."
    hosting_text: str = "Diese Website wird bei einem externen Dienstleister gehostet. Die Verarbeitung erfolgt auf Grundlage unserer berechtigten Interessen."
    rights_text: str = "Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch."
    paypal_text: str = "Wenn du unser Projekt über PayPal unterstützt, erfolgt die Datenverarbeitung durch PayPal gemäß deren Datenschutzbestimmungen."
    last_updated: str = "Dezember 2025"
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Cookies Page Content Model
class CookiesContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    intro_text: str = "Diese Website verwendet Cookies, um dir die bestmögliche Nutzererfahrung zu bieten. Hier erfährst du, welche Cookies wir verwenden und wie du sie verwalten kannst."
    what_are_cookies: str = "Cookies sind kleine Textdateien, die auf deinem Gerät gespeichert werden, wenn du eine Website besuchst. Sie helfen der Website, sich bestimmte Informationen zu merken."
    types_essential: str = "Technisch notwendige Cookies sind für den Betrieb der Website erforderlich. Sie ermöglichen grundlegende Funktionen wie die Seitennavigation und den Zugang zu gesicherten Bereichen."
    types_functional: str = "Funktionale Cookies ermöglichen es der Website, sich an deine Einstellungen zu erinnern, wie z.B. die Sprachauswahl oder die Theme-Einstellung (Hell/Dunkel-Modus)."
    types_analytics: str = "Analyse-Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren. Wir verwenden derzeit KEINE Analyse-Cookies."
    types_marketing: str = "Marketing-Cookies werden verwendet, um Besucher über Websites hinweg zu verfolgen. Wir verwenden KEINE Marketing- oder Werbe-Cookies."
    our_cookies: str = "Wir verwenden ausschließlich technisch notwendige und funktionale Cookies: cookie-consent (speichert deine Cookie-Einwilligung), theme (speichert deine Theme-Einstellung)."
    manage_cookies: str = "Du kannst Cookies in deinem Browser jederzeit löschen oder blockieren. Beachte jedoch, dass das Blockieren bestimmter Cookies die Funktionalität der Website beeinträchtigen kann."
    browser_settings: str = "In den Einstellungen deines Browsers kannst du Cookies verwalten: Chrome: Einstellungen → Datenschutz und Sicherheit → Cookies. Firefox: Einstellungen → Datenschutz & Sicherheit. Safari: Einstellungen → Datenschutz. Edge: Einstellungen → Datenschutz, Suche und Dienste."
    contact_email: str = "gltz.de@gmail.com"
    last_updated: str = "Januar 2025"
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============== Auth Helpers ==============

DEFAULT_PASSWORD = "gltz2025"  # Default password, should be changed

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

async def verify_admin_session(token: str) -> bool:
    session = await db.admin_sessions.find_one({"token": token, "active": True})
    if not session:
        return False
    created = datetime.fromisoformat(session['created_at'])
    if datetime.now(timezone.utc) - created > timedelta(minutes=30):
        await db.admin_sessions.update_one({"token": token}, {"$set": {"active": False}})
        return False
    return True

# ============== Admin Auth ==============

@api_router.post("/admin/login")
async def admin_login(login: AdminLogin):
    settings = await db.admin_settings.find_one({"type": "admin"})
    
    if settings and settings.get('admin_password_hash'):
        stored_hash = settings['admin_password_hash']
    else:
        stored_hash = hash_password(DEFAULT_PASSWORD)
    
    if hash_password(login.password) != stored_hash:
        raise HTTPException(status_code=401, detail="Falsches Passwort")
    
    token = secrets.token_urlsafe(32)
    await db.admin_sessions.insert_one({
        "token": token,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "active": True
    })
    
    return {"success": True, "token": token}

@api_router.get("/admin/verify")
async def verify_admin(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Session abgelaufen")
    return {"valid": True}

@api_router.post("/admin/logout")
async def admin_logout(token: str):
    await db.admin_sessions.update_one({"token": token}, {"$set": {"active": False}})
    return {"success": True}

@api_router.post("/admin/change-password")
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

@api_router.get("/admin/stats", response_model=DashboardStats)
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

@api_router.post("/admin/donations/increment")
async def increment_donations(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    await db.admin_settings.update_one(
        {"type": "donations"},
        {"$inc": {"count": 1}, "$set": {"type": "donations"}},
        upsert=True
    )
    return {"success": True}

# ============== Public Pages API ==============

@api_router.get("/pages")
async def get_public_pages():
    """Get all live pages for public display"""
    pages = await db.pages.find({"status": "live"}, {"_id": 0}).sort("order", 1).to_list(100)
    return pages

@api_router.get("/pages/{slug}")
async def get_page_by_slug(slug: str):
    """Get a single page by its slug"""
    page = await db.pages.find_one({"slug": slug, "status": "live"}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    return page

# ============== Pages CRUD ==============

@api_router.get("/admin/pages", response_model=List[PageModel])
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

@api_router.post("/admin/pages", response_model=PageModel)
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

@api_router.put("/admin/pages/{page_id}", response_model=PageModel)
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

@api_router.delete("/admin/pages/{page_id}")
async def delete_page(page_id: str, token: str, permanent: bool = False):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    if permanent:
        # Permanent delete
        result = await db.pages.delete_one({"id": page_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    else:
        # Soft delete - move to trash
        result = await db.pages.update_one(
            {"id": page_id},
            {"$set": {"status": "deleted", "deleted_at": datetime.now(timezone.utc).isoformat()}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Seite nicht gefunden")
    return {"success": True}

@api_router.post("/admin/pages/{page_id}/restore")
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

@api_router.get("/admin/pages/trash")
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

@api_router.post("/admin/pages/{page_id}/duplicate")
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

@api_router.post("/admin/pages/init-defaults")
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
<p>Diese Website dient ausschließlich privaten, nicht-kommerziellen Zwecken. Die Inhalte wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>

<h3>Urheberrecht</h3>
<p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>""",
            "status": "live",
            "order": 100
        },
        {
            "slug": "datenschutz",
            "title": "Datenschutzerklärung",
            "content": """<h2>Datenschutzerklärung</h2>

<h3>1. Datenschutz auf einen Blick</h3>
<p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>

<h3>2. Datenerfassung auf dieser Website</h3>
<p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br>
Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber (gltz.de).</p>

<h3>3. Hosting</h3>
<p>Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.</p>

<h3>4. Kontaktformular</h3>
<p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>

<h3>5. Cookies</h3>
<p>Diese Website verwendet Cookies. Diese kleinen Textdateien werden auf Ihrem Computer gespeichert und dienen dazu, unser Angebot nutzerfreundlicher und effektiver zu gestalten. Sie können die Speicherung von Cookies in Ihrem Browser deaktivieren.</p>

<h3>6. Ihre Rechte</h3>
<p>Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Kontaktieren Sie uns dazu per E-Mail.</p>""",
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

# ============== Gallery CRUD ==============

@api_router.get("/admin/gallery", response_model=List[GalleryImage])
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

@api_router.post("/admin/gallery")
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

@api_router.put("/admin/gallery/{image_id}")
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

@api_router.delete("/admin/gallery/{image_id}")
async def delete_gallery_image(image_id: str, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    result = await db.gallery_images.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bild nicht gefunden")
    return {"success": True}

# ============== Contacts ==============

@api_router.get("/admin/contacts", response_model=List[ContactSubmission])
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

@api_router.put("/admin/contacts/{contact_id}/status")
async def update_contact_status(contact_id: str, token: str, status: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    await db.contact_submissions.update_one({"id": contact_id}, {"$set": {"status": status}})
    return {"success": True}

@api_router.get("/admin/contacts/export")
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

# ============== News/Announcements ==============

@api_router.get("/news")
async def get_public_news():
    """Get all live news items for public display"""
    now = datetime.now(timezone.utc)
    news = await db.news.find({"status": "live"}, {"_id": 0}).sort("order", 1).to_list(20)
    
    # Filter by date if set
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

@api_router.get("/admin/news")
async def get_all_news(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    news = await db.news.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return news

@api_router.post("/admin/news")
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

@api_router.put("/admin/news/{news_id}")
async def update_news(news_id: str, news: NewsItemCreate, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    update_data = news.model_dump()
    await db.news.update_one({"id": news_id}, {"$set": update_data})
    return {"success": True}

@api_router.delete("/admin/news/{news_id}")
async def delete_news(news_id: str, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    await db.news.delete_one({"id": news_id})
    return {"success": True}

# ============== Blog Posts ==============

@api_router.get("/admin/posts", response_model=List[BlogPost])
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
        # Ensure publish_date exists
        if 'publish_date' not in p:
            p['publish_date'] = p.get('created_at', datetime.now(timezone.utc))
        result.append(BlogPost(**p))
    return result

@api_router.post("/admin/posts", response_model=BlogPost)
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

@api_router.put("/admin/posts/{post_id}", response_model=BlogPost)
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
    # Ensure publish_date is never None
    if 'publish_date' not in updated or updated['publish_date'] is None:
        updated['publish_date'] = updated.get('created_at', datetime.now(timezone.utc))
    return BlogPost(**updated)

@api_router.delete("/admin/posts/{post_id}")
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

@api_router.post("/admin/posts/{post_id}/restore")
async def restore_post(post_id: str, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    await db.blog_posts.update_one(
        {"id": post_id},
        {"$set": {"status": "draft", "deleted_at": None}}
    )
    return {"success": True}

@api_router.get("/admin/posts/trash")
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

# ============== Legal Texts ==============

@api_router.get("/admin/legal/{text_type}")
async def get_legal_text(text_type: str, token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    text = await db.legal_texts.find_one({"type": text_type}, {"_id": 0})
    if text:
        return text
    return {"type": text_type, "content": ""}

@api_router.put("/admin/legal/{text_type}")
async def update_legal_text(text_type: str, token: str, content: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    await db.legal_texts.update_one(
        {"type": text_type},
        {"$set": {"type": text_type, "content": content, "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True
    )
    return {"success": True}

# ============== Structured Page Content (Impressum, Datenschutz) ==============

@api_router.get("/page-content/impressum")
async def get_impressum_content():
    """Get impressum content for public display"""
    content = await db.page_content.find_one({"type": "impressum"}, {"_id": 0})
    if content:
        return content
    return ImpressumContent().model_dump()

@api_router.get("/admin/page-content/impressum")
async def get_admin_impressum_content(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    content = await db.page_content.find_one({"type": "impressum"}, {"_id": 0})
    if content:
        return content
    return ImpressumContent().model_dump()

@api_router.put("/admin/page-content/impressum")
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

@api_router.get("/page-content/datenschutz")
async def get_datenschutz_content():
    """Get datenschutz content for public display"""
    content = await db.page_content.find_one({"type": "datenschutz"}, {"_id": 0})
    if content:
        return content
    return DatenschutzContent().model_dump()

@api_router.get("/admin/page-content/datenschutz")
async def get_admin_datenschutz_content(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    content = await db.page_content.find_one({"type": "datenschutz"}, {"_id": 0})
    if content:
        return content
    return DatenschutzContent().model_dump()

@api_router.put("/admin/page-content/datenschutz")
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

# ============== Site Settings ==============

@api_router.get("/settings", response_model=SiteSettings)
async def get_site_settings():
    settings = await db.site_settings.find_one({"type": "main"}, {"_id": 0})
    if settings:
        return SiteSettings(**settings)
    return SiteSettings()

@api_router.post("/settings", response_model=SiteSettings)
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

# ============== Public Contact Form ==============

@api_router.post("/contact")
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

# ============== Public Gallery ==============

@api_router.get("/gallery")
async def get_public_gallery():
    images = await db.gallery_images.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    result = []
    for img in images:
        if isinstance(img.get('created_at'), str):
            img['created_at'] = datetime.fromisoformat(img['created_at'])
        result.append(img)
    return result

# ============== Public Blog ==============

@api_router.get("/blog")
async def get_public_blog(limit: int = 10):
    posts = await db.blog_posts.find({"status": "live"}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    result = []
    for p in posts:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
        result.append(p)
    return result

# ============== Seed Data ==============

@api_router.post("/seed")
async def seed_data():
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
    
    # Seed default pages if none exist
    existing_pages = await db.pages.count_documents({})
    if existing_pages == 0:
        default_pages = [
            {"id": str(uuid.uuid4()), "title": "Impressum", "slug": "impressum", "content": "Impressum Inhalt hier...", "status": "live", "order": 1, "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "Datenschutz", "slug": "datenschutz", "content": "Datenschutzerklärung hier...", "status": "live", "order": 2, "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "Über uns", "slug": "ueber-uns", "content": "Über uns Inhalt hier...", "status": "live", "order": 3, "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "Kontakt", "slug": "kontakt", "content": "Kontakt Inhalt hier...", "status": "live", "order": 4, "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "Schwangerschaft", "slug": "schwangerschaft", "content": "Schwangerschaft Inhalt hier...", "status": "draft", "order": 5, "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "Baby-Alltag", "slug": "baby-alltag", "content": "Baby-Alltag Inhalt hier...", "status": "draft", "order": 6, "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "Tipps", "slug": "tipps", "content": "Tipps Inhalt hier...", "status": "draft", "order": 7, "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "Reisen", "slug": "reisen", "content": "Reisen Inhalt hier...", "status": "draft", "order": 8, "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "Blog", "slug": "blog", "content": "Blog Übersicht hier...", "status": "live", "order": 9, "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "Twins-Art", "slug": "twins-art", "content": "Twins-Art Portfolio hier...", "status": "live", "order": 10, "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
            {"id": str(uuid.uuid4()), "title": "Spende", "slug": "spende", "content": "Spenden Seite hier...", "status": "live", "order": 11, "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
        ]
        await db.pages.insert_many(default_pages)
    
    return {"success": True}

# ============== Trash Cleanup (auto-delete after 30 days) ==============

@api_router.post("/admin/trash/cleanup")
async def cleanup_trash(token: str):
    if not await verify_admin_session(token):
        raise HTTPException(status_code=401, detail="Nicht autorisiert")
    
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    
    # Delete old pages
    pages_result = await db.pages.delete_many({
        "status": "deleted",
        "deleted_at": {"$lt": thirty_days_ago.isoformat()}
    })
    
    # Delete old posts
    posts_result = await db.blog_posts.delete_many({
        "status": "deleted", 
        "deleted_at": {"$lt": thirty_days_ago.isoformat()}
    })
    
    return {
        "success": True,
        "deleted_pages": pages_result.deleted_count,
        "deleted_posts": posts_result.deleted_count
    }

@api_router.post("/admin/trash/empty")
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

@api_router.get("/")
async def root():
    return {"message": "gltz.de API"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
