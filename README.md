# gltz.de - Familien-Website

Eine moderne, responsive Familien-Website mit vollständigem Admin-Dashboard zur Verwaltung aller Inhalte.

## 🚀 Technologie-Stack

- **Frontend:** React 19, Tailwind CSS, Radix UI
- **Backend:** FastAPI (Python)
- **Datenbank:** MongoDB
- **Hosting:** Frontend auf Hostinger, Backend auf Railway

---

## 📦 Projekt-Struktur

```
/app
├── backend/
│   ├── main.py              # FastAPI Hauptanwendung
│   ├── database.py          # MongoDB Verbindung
│   ├── models.py            # Pydantic Datenmodelle
│   ├── requirements.txt     # Python Abhängigkeiten
│   ├── railway.toml         # Railway Konfiguration
│   ├── .env.example         # Umgebungsvariablen Vorlage
│   ├── routes/              # API Route-Module
│   │   ├── admin.py         # Admin Auth & Settings
│   │   ├── pages.py         # Seiten CRUD
│   │   ├── blog.py          # Blog CRUD
│   │   ├── gallery.py       # Galerie CRUD
│   │   ├── news.py          # News CRUD
│   │   ├── contacts.py      # Kontaktformular
│   │   ├── static_pages.py  # Statische Seiten
│   │   ├── landing.py       # Landing Page
│   │   └── search.py        # Suche & Seed
│   └── utils/
│       └── auth.py          # Authentifizierung
├── frontend/
│   ├── src/
│   │   ├── components/      # React Komponenten
│   │   ├── pages/           # Seiten-Komponenten
│   │   └── context/         # React Context
│   ├── public/
│   │   ├── index.html
│   │   └── .htaccess        # Apache Cache-Regeln
│   ├── package.json
│   └── .env.production.example
└── README.md
```

---

## 🛠️ Deployment-Anleitung

### Schritt 1: MongoDB Datenbank einrichten

**Option A: MongoDB Atlas (empfohlen)**
1. Erstelle einen kostenlosen Account auf [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Erstelle einen neuen Cluster (M0 Free Tier)
3. Erstelle einen Datenbank-Benutzer unter "Database Access"
4. Füge `0.0.0.0/0` zu den IP-Adressen unter "Network Access" hinzu
5. Kopiere den Connection String (MongoDB URI)

---

### Schritt 2: Backend auf Railway deployen

1. **GitHub Repository erstellen**
   - Pushe das Projekt zu GitHub (nur `/app/backend` Ordner)
   - Oder verwende "Save to GitHub" in Emergent

2. **Railway Projekt erstellen**
   - Gehe zu [railway.app](https://railway.app)
   - Erstelle ein neues Projekt → "Deploy from GitHub Repo"
   - Wähle dein Repository

3. **Umgebungsvariablen setzen**
   Gehe zu "Variables" und füge hinzu:
   ```
   MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/gltz_db
   DB_NAME=gltz_db
   CORS_ORIGINS=https://gltz.de,https://www.gltz.de
   SECRET_KEY=<dein-geheimer-schlüssel>
   ```

4. **Domain einrichten**
   - Unter "Settings" → "Networking" → "Generate Domain"
   - Oder eigene Domain verknüpfen

5. **Deployment überprüfen**
   - Railway baut und startet automatisch
   - Überprüfe die Logs auf Fehler
   - Test: `https://deine-domain.up.railway.app/health`

---

### Schritt 3: Frontend auf Hostinger deployen

1. **Build erstellen**
   ```bash
   cd frontend
   
   # .env.production erstellen
   echo "REACT_APP_API_URL=https://deine-backend-url.up.railway.app" > .env.production
   
   # Dependencies installieren und bauen
   yarn install
   yarn build
   ```

2. **Bei Hostinger hochladen**
   - Gehe zu Hostinger File Manager
   - Navigiere zu `public_html/`
   - Lösche vorhandene Dateien
   - Lade den Inhalt von `/frontend/build/` hoch
   - `.htaccess` nicht vergessen!

3. **SSL aktivieren**
   - Aktiviere SSL/HTTPS in Hostinger unter "SSL"
   - Force HTTPS aktivieren

---

### Schritt 4: Admin-Zugang

- **Admin-URL:** `https://gltz.de/admin`
- **Standard-Passwort:** `gltz2025`

⚠️ **Wichtig:** Ändere das Passwort nach dem ersten Login über das Admin-Dashboard!

---

## 🔧 Lokale Entwicklung

### Backend starten
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### Frontend starten
```bash
cd frontend
yarn install
yarn start
```

---

## 📋 API Endpunkte

| Endpunkt | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/settings` | GET | Website-Einstellungen |
| `/api/pages` | GET | Öffentliche Seiten |
| `/api/blog` | GET | Blog-Beiträge |
| `/api/gallery` | GET | Galerie-Bilder |
| `/api/news` | GET | News/Ankündigungen |
| `/api/search?q=` | GET | Inhalte durchsuchen |
| `/api/contact` | POST | Kontaktformular |
| `/api/admin/login` | POST | Admin-Login |

---

## 🔒 Sicherheit

- Passwörter werden mit SHA-256 gehasht
- Admin-Sessions laufen nach 30 Minuten ab
- CORS ist auf spezifische Domains beschränkt
- Alle Admin-Endpunkte erfordern Token-Authentifizierung

---

## 📝 Changelog

### Version 1.0.0
- Initiales Release
- Vollständiges Admin-Dashboard
- Blog, Galerie, News Management
- Dynamische Seiten-Verwaltung
- Kontaktformular mit Status-Tracking
- Responsive Design mit Dark/Light Mode
- Cookie-Banner (DSGVO-konform)
- Suchfunktion über alle Inhalte

---

## 🆘 Support

Bei Fragen oder Problemen:
- E-Mail: gltz.de@gmail.com

---

*Erstellt mit ❤️ für die Familie*
