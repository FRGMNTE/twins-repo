# gltz.de - Familienseite PRD

## Original Problem Statement
Erweitere die importierte Bolt.new-Seite zu einer vollständigen, produktiven gltz.de-Familienseite mit Apple.com-Style minimalistischem Design und professionellem Admin-Bereich mit vollständigem CMS.

## User Personas
1. **Junge Zwillingseltern** - Suchen praktische Tipps und Erfahrungsaustausch
2. **Schwangere mit Zwillingen** - Brauchen Vorbereitung und emotionale Unterstützung
3. **Unterstützer/Fans** - Möchten das Familienprojekt finanziell unterstützen
4. **Admin** - Verwaltet Inhalte, Galerie, Kontakte und Einstellungen

## Core Requirements
- Apple.com-Style minimalistisches Design
- Professioneller passwortgeschützter Admin-Bereich
- Vollständiges CMS (Seiten, Blog, Galerie)
- Kontakt-Management mit CSV-Export
- DSGVO-konform

## What's Been Implemented (Dezember 2025)

### Admin-Bereich - Vollständig ✅
**Login & Sicherheit:**
- Passwort-geschützter Zugang (Standard: gltz2025)
- 30-Minuten Session-Timeout
- Logout-Button

**Dashboard:**
- Quick-Stats (Kontakte, Seiten, Galerie, Spenden)
- Neueste Anfragen Timeline
- Quick-Action Buttons

**Seiten-Management (CRUD):**
- Neue Seite erstellen (Titel, URL-Slug, Inhalt, Status)
- Bearbeiten mit Hero-Bild
- Löschen mit Bestätigung
- Duplizieren

**Galerie-Management:**
- Bild hinzufügen per URL
- Titel, Alt-Text, Tags bearbeiten
- Featured-Bild markieren
- Löschen

**Kontakte:**
- Alle Anfragen mit Status (neu/gelesen/beantwortet)
- Filter und Suche
- CSV-Export
- Status ändern
- Direkt antworten per Email-Link

**Blog-Posts:**
- Erstellen (Titel, Excerpt, Inhalt, Kategorie, Bild)
- Status (Entwurf/Live)
- Bearbeiten und Löschen

**Einstellungen:**
- Website: Titel, Logo, Hero-Texte
- Design: Schriftart, Theme, Hintergründe
- Spenden: PayPal-Link, Button-Text, Disclaimer
- SEO: Meta-Description, GA4-Tag
- Auto-Save alle 30 Sekunden

### Frontend - Apple-Style ✅
- Minimalistisches Design
- Dark/Light Mode mit Celestial Switch
- Responsive Navigation
- Home mit Hero, Teaser-Cards, Blog-Preview
- Twins-Art Galerie mit Lightbox
- Kontaktformular
- Impressum, Datenschutz
- Cookie-Banner

## Tech Stack
- **Frontend:** React 19, Tailwind CSS, Framer Motion, Shadcn/UI
- **Backend:** FastAPI, Motor (async MongoDB)
- **Database:** MongoDB
- **Hosting:** Emergent Platform

## Admin Access
- **URL:** /admin
- **Passwort:** gltz2025 (änderbar)
- **Session:** 30 Minuten

## API Endpoints
- POST /api/admin/login - Login
- GET /api/admin/stats - Dashboard-Statistiken
- GET/POST/PUT/DELETE /api/admin/pages - Seiten CRUD
- GET/POST/PUT/DELETE /api/admin/gallery - Galerie CRUD
- GET/PUT /api/admin/contacts - Kontakte verwalten
- GET /api/admin/contacts/export - CSV Export
- GET/POST/PUT/DELETE /api/admin/posts - Blog CRUD
- GET/POST /api/settings - Website-Einstellungen

## Prioritized Backlog

### P0 - Critical (Next)
- [ ] Gmail/Sheets Integration für Kontaktformular
- [ ] Custom Domain Setup (gltz.de)

### P1 - Important
- [ ] Drag&Drop Bild-Upload
- [ ] Rich-Text-Editor für Inhalte
- [ ] Backup-Download als ZIP

### P2 - Nice to Have
- [ ] Google Analytics Integration
- [ ] Newsletter
- [ ] PWA Support

## Kontakt
- John D. Gold
- Schützenstraße 38, 47829 Krefeld
- Email: gltz.de@gmail.com
