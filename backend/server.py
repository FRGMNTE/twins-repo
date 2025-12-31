from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import secrets
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============== Models ==============

class ContactFormInput(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    thema: str
    nachricht: str

class ContactFormResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: Optional[str] = None
    email: str
    thema: str
    nachricht: str
    timestamp: datetime
    status: str = "neu"

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    category: str
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    published: bool = True

class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    image_url: Optional[str] = None

class AdminLoginRequest(BaseModel):
    email: EmailStr

class AdminVerifyRequest(BaseModel):
    email: EmailStr
    code: str

class GalleryImage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    alt: str
    tags: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============== Contact Form ==============

@api_router.post("/contact", response_model=ContactFormResponse)
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
    
    logging.info(f"Neue Kontaktanfrage von {form.email} - Thema: {form.thema}")
    
    return ContactFormResponse(
        id=contact_id,
        name=form.name,
        email=form.email,
        thema=form.thema,
        nachricht=form.nachricht,
        timestamp=timestamp,
        status="neu"
    )

@api_router.get("/contact", response_model=List[ContactFormResponse])
async def get_contact_submissions():
    submissions = await db.contact_submissions.find({}, {"_id": 0}).to_list(1000)
    result = []
    for sub in submissions:
        if isinstance(sub.get('timestamp'), str):
            sub['timestamp'] = datetime.fromisoformat(sub['timestamp'])
        result.append(ContactFormResponse(**sub))
    return result

# ============== Admin Auth ==============

ADMIN_EMAIL = "gltz.de@gmail.com"

@api_router.post("/admin/request-code")
async def request_admin_code(request: AdminLoginRequest):
    if request.email != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Nicht autorisiert")
    
    code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
    code_hash = hashlib.sha256(code.encode()).hexdigest()
    
    await db.admin_codes.delete_many({"email": request.email})
    await db.admin_codes.insert_one({
        "email": request.email,
        "code_hash": code_hash,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "used": False
    })
    
    logging.info(f"Admin-Code für {request.email}: {code}")
    
    return {
        "success": True,
        "message": f"Bestätigungscode wurde generiert. Code: {code}",
        "hint": "Der Code wird in den Server-Logs angezeigt und sollte an die E-Mail gesendet werden."
    }

@api_router.post("/admin/verify-code")
async def verify_admin_code(request: AdminVerifyRequest):
    if request.email != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Nicht autorisiert")
    
    code_hash = hashlib.sha256(request.code.encode()).hexdigest()
    
    stored = await db.admin_codes.find_one({
        "email": request.email,
        "code_hash": code_hash,
        "used": False
    })
    
    if not stored:
        raise HTTPException(status_code=401, detail="Ungültiger Code")
    
    created_at = datetime.fromisoformat(stored['created_at'])
    if (datetime.now(timezone.utc) - created_at).seconds > 600:
        raise HTTPException(status_code=401, detail="Code abgelaufen")
    
    await db.admin_codes.update_one(
        {"email": request.email, "code_hash": code_hash},
        {"$set": {"used": True}}
    )
    
    session_token = secrets.token_urlsafe(32)
    await db.admin_sessions.insert_one({
        "token": session_token,
        "email": request.email,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {
        "success": True,
        "token": session_token,
        "message": "Erfolgreich angemeldet"
    }

@api_router.get("/admin/verify-session")
async def verify_session(token: str):
    session = await db.admin_sessions.find_one({"token": token})
    if not session:
        raise HTTPException(status_code=401, detail="Ungültige Session")
    return {"valid": True, "email": session.get("email")}

# ============== Blog Posts ==============

@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts(limit: int = 3, published_only: bool = True):
    query = {"published": True} if published_only else {}
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    result = []
    for post in posts:
        if isinstance(post.get('created_at'), str):
            post['created_at'] = datetime.fromisoformat(post['created_at'])
        result.append(BlogPost(**post))
    return result

@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(post: BlogPostCreate):
    blog_post = BlogPost(
        title=post.title,
        excerpt=post.excerpt,
        content=post.content,
        category=post.category,
        image_url=post.image_url
    )
    
    doc = blog_post.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.blog_posts.insert_one(doc)
    return blog_post

@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post nicht gefunden")
    return {"success": True}

# ============== Gallery ==============

@api_router.get("/gallery", response_model=List[GalleryImage])
async def get_gallery_images():
    images = await db.gallery_images.find({}, {"_id": 0}).to_list(100)
    result = []
    for img in images:
        if isinstance(img.get('created_at'), str):
            img['created_at'] = datetime.fromisoformat(img['created_at'])
        result.append(GalleryImage(**img))
    return result

@api_router.post("/gallery", response_model=GalleryImage)
async def add_gallery_image(image: GalleryImage):
    doc = image.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.gallery_images.insert_one(doc)
    return image

# ============== Seed Data ==============

@api_router.post("/seed")
async def seed_data():
    existing_posts = await db.blog_posts.count_documents({})
    if existing_posts == 0:
        default_posts = [
            {
                "id": str(uuid.uuid4()),
                "title": "Schlaf-Routinen für Zwillinge",
                "excerpt": "Wie wir unsere Zwillinge gleichzeitig zum Schlafen bringen - unsere besten Tipps nach 6 Monaten.",
                "content": "Der Schlaf ist eine der größten Herausforderungen...",
                "category": "Schlaf",
                "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "published": True
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Tandem-Stillen leicht gemacht",
                "excerpt": "Praktische Positionen und Hilfsmittel für das gleichzeitige Stillen von zwei Babys.",
                "content": "Das Tandem-Stillen war anfangs eine Herausforderung...",
                "category": "Füttern",
                "image_url": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "published": True
            },
            {
                "id": str(uuid.uuid4()),
                "title": "10 Hacks für den Zwillingsalltag",
                "excerpt": "Von der Wickelstation bis zum Einkaufen - so meistern wir den Alltag mit Zwillingen.",
                "content": "Nach einem Jahr mit Zwillingen haben wir viel gelernt...",
                "category": "Tipps",
                "image_url": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "published": True
            }
        ]
        await db.blog_posts.insert_many(default_posts)
    
    existing_images = await db.gallery_images.count_documents({})
    if existing_images == 0:
        default_images = [
            {
                "id": str(uuid.uuid4()),
                "url": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600",
                "alt": "Bunte Kinderkunst - Handabdrücke in verschiedenen Farben",
                "tags": ["Baby-Art", "Handabdrücke", "Familie"],
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600",
                "alt": "Abstrakte Kindermalerei in lebhaften Farben",
                "tags": ["Abstrakt", "Malerei"],
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "url": "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600",
                "alt": "Kreative Familienmotive auf Papier",
                "tags": ["Familie", "Kreativ"],
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "url": "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600",
                "alt": "Fingermalerei von Kindern - abstrakte Formen",
                "tags": ["Baby-Art", "Fingermalerei"],
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "url": "https://images.unsplash.com/photo-1499892477393-f675706cbe6e?w=600",
                "alt": "Bunte Farbkleckse auf Leinwand",
                "tags": ["Abstrakt", "Farben"],
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "url": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600",
                "alt": "Kreative Kunstwerke von kleinen Händen",
                "tags": ["Baby-Art", "Kreativ", "Familie"],
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.gallery_images.insert_many(default_images)
    
    return {"success": True, "message": "Seed-Daten erstellt"}

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

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
