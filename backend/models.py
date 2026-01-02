"""Pydantic models for the gltz.de API"""
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone

# ============== Admin Models ==============

class AdminLogin(BaseModel):
    password: str

class AdminSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    admin_password_hash: Optional[str] = None
    session_timeout_minutes: int = 30

# ============== Site Settings ==============

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
    logoImage: Optional[str] = None
    defaultTheme: str = "light"
    paypalLink: str = "https://paypal.me/gltzfamily"
    donationText: str = "Projekt unterstützen"
    donationDisclaimer: str = "Dies ist keine Spende im steuerlichen Sinne. Es erfolgt keine Gegenleistung. 100% freiwillige Unterstützung für unser Familienprojekt."
    ga4Tag: Optional[str] = None
    metaDescription: str = "Zwillings-Tipps für junge Familien"
    autoReplyMessage: str = "Danke für deine Nachricht – wir melden uns in 24h!"
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
    footerText: str = "Unsere Reise mit Zwillingen. Anonyme Tipps für junge Familien."
    footerLinks: List[Dict[str, Any]] = []
    footerEmail: str = "gltz.de@gmail.com"
    socialLinks: List[Dict[str, Any]] = [
        {"id": "1", "platform": "facebook", "url": "https://www.facebook.com/people/%E0%B9%80%E0%B8%A1%E0%B8%B2%E0%B8%99%E0%B9%8C%E0%B9%80%E0%B8%97%E0%B8%B4%E0%B8%99-%E0%B9%82%E0%B8%AD%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B9%88%E0%B8%99/61584716588683/", "enabled": True},
        {"id": "2", "platform": "instagram", "url": "", "enabled": False},
        {"id": "3", "platform": "youtube", "url": "", "enabled": False},
        {"id": "4", "platform": "tiktok", "url": "", "enabled": False},
        {"id": "5", "platform": "twitter", "url": "", "enabled": False},
    ]
    socialFacebook: str = ""
    socialEmail: str = "gltz.de@gmail.com"
    teaserCards: List[Dict[str, Any]] = []
    ctaTitle: str = "Projekt unterstützen"
    ctaDescription: str = "Die Kunst bringt Freude, Einnahmen bleiben 100% in der Familie."
    ctaButtonText: str = "Unterstützen"

# ============== Page Models ==============

class PageModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    content: str = ""
    status: str = "draft"
    heroImage: Optional[str] = None
    metaTitle: Optional[str] = None
    metaDescription: Optional[str] = None
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = None

class PageCreate(BaseModel):
    title: str
    slug: str
    content: str = ""
    status: str = "draft"
    heroImage: Optional[str] = None
    metaTitle: Optional[str] = None
    metaDescription: Optional[str] = None

# ============== Gallery Models ==============

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

# ============== Contact Models ==============

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: Optional[str] = None
    email: str
    thema: str
    nachricht: str
    timestamp: datetime
    status: str = "neu"

class ContactFormInput(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    thema: str
    nachricht: str

# ============== News Models ==============

class NewsItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: Optional[str] = None
    image_url: str
    link_url: Optional[str] = None
    link_type: str = "internal"
    status: str = "draft"
    order: int = 0
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsItemCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    image_url: str
    link_url: Optional[str] = None
    link_type: str = "internal"
    status: str = "draft"
    order: int = 0

# ============== Landing Page Models ==============

class LandingPageSection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    type: str
    enabled: bool = True
    title: str = ""
    subtitle: str = ""
    content: str = ""
    background_type: str = "none"
    background_value: str = ""
    items: list = []
    settings: dict = {}

class LandingPageContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    hero_enabled: bool = True
    hero_label: str = "Willkommen bei unserer Familie"
    hero_title: str = "Das Zwillings-Abenteuer"
    hero_subtitle: str = "Ehrliche Einblicke in unser Leben mit zwei Babys"
    hero_description: str = "Wir teilen unsere Erfahrungen, Tipps und die kleinen Kunstwerke unserer Zwillinge M & O."
    hero_cta_text: str = "Unsere Geschichte"
    hero_cta_link: str = "/ueber-uns"
    hero_secondary_cta_text: str = ""
    hero_secondary_cta_link: str = ""
    hero_background_type: str = "none"
    hero_background_url: str = ""
    hero_video_autoplay: bool = True
    hero_video_loop: bool = True
    hero_video_muted: bool = True
    features_enabled: bool = True
    features_title: str = "Was dich hier erwartet"
    features_items: list = []
    news_enabled: bool = True
    news_title: str = "Aktuelles"
    news_autoplay_interval: int = 10
    categories_enabled: bool = True
    categories_title: str = "Entdecken"
    blog_enabled: bool = True
    blog_title: str = "Aus dem Blog"
    blog_subtitle: str = "Aktuelle Beiträge und Erfahrungen"
    blog_max_posts: int = 4
    cta_enabled: bool = True
    cta_title: str = "Möchtest du uns unterstützen?"
    cta_description: str = "Mit deiner Hilfe können wir dieses Projekt weiterführen."
    cta_button_text: str = "Unterstützen"
    cta_button_link: str = "/spende"
    custom_sections: list = []
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============== Blog Models ==============

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    category: str
    image_url: Optional[str] = None
    status: str = "draft"
    publish_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = None

class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    image_url: Optional[str] = None
    status: str = "draft"
    publish_date: Optional[str] = None

# ============== Dashboard Models ==============

class DashboardStats(BaseModel):
    total_contacts: int = 0
    unread_contacts: int = 0
    total_pages: int = 0
    total_gallery: int = 0
    total_posts: int = 0
    donations_count: int = 0

# ============== Legal Text Models ==============

class LegalText(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    type: str
    content: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ImpressumContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    provider_name: str = "John D. Gold"
    provider_street: str = "Schützenstraße 38"
    provider_city: str = "47829 Krefeld"
    provider_country: str = "Deutschland"
    provider_phone: str = "01575 731 2560"
    provider_email: str = "gltz.de@gmail.com"
    responsible_name: str = "John D. Gold"
    responsible_address: str = "Schützenstraße 38, 47829 Krefeld"
    liability_content: str = "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen."
    liability_links: str = "Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben."
    copyright_text: str = "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht."
    dispute_text: str = "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DatenschutzContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    responsible_name: str = "John D. Gold"
    responsible_address: str = "Schützenstraße 38, 47829 Krefeld"
    responsible_email: str = "gltz.de@gmail.com"
    intro_text: str = "Der Schutz deiner persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung informiert dich darüber, welche Daten wir erheben und wie wir sie verwenden."
    contact_form_text: str = "Wenn du uns über das Kontaktformular kontaktierst, werden Name, E-Mail, Thema und Nachricht erhoben."
    contact_form_purpose: str = "Zweck: Bearbeitung deiner Anfrage. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Speicherdauer: Bis zur Erledigung, maximal 2 Jahre."
    cookies_text: str = "Wir verwenden nur technisch notwendige Cookies für den Betrieb dieser Website (z.B. für Dark/Light Mode Einstellungen)."
    hosting_text: str = "Diese Website wird bei einem externen Dienstleister gehostet. Die Verarbeitung erfolgt auf Grundlage unserer berechtigten Interessen."
    rights_text: str = "Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch."
    paypal_text: str = "Wenn du unser Projekt über PayPal unterstützt, erfolgt die Datenverarbeitung durch PayPal gemäß deren Datenschutzbestimmungen."
    last_updated: str = "Dezember 2025"
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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

# ============== Static Page Models ==============

class StaticPageSection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    subtitle: str = ""
    description: str = ""
    image_url: str = ""
    link_url: str = ""
    link_text: str = ""
    items: list = []

class StaticPageContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    page_id: str
    hero_label: str = ""
    hero_title: str = ""
    hero_description: str = ""
    hero_image: str = ""
    sections: list[StaticPageSection] = []
    cta_title: str = ""
    cta_description: str = ""
    cta_link: str = ""
    cta_link_text: str = ""
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
