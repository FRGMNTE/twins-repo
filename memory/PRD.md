# gltz.de - Familienseite PRD

## Original Problem Statement
Erweitere die importierte Bolt.new-Seite "twinfamilypage.zip" zu einer vollständigen, produktiven gltz.de-Familienseite mit Apple-Style Design, Kontaktformular, Twins-Art Galerie mit PayPal-Unterstützungs-Button, Admin-Bereich und DSGVO-Konformität.

## User Personas
1. **Junge Zwillingseltern** - Suchen praktische Tipps und Erfahrungsaustausch
2. **Schwangere mit Zwillingen** - Brauchen Vorbereitung und emotionale Unterstützung
3. **Unterstützer/Fans** - Möchten das Familienprojekt finanziell unterstützen

## Core Requirements
- Apple-Style minimalistisches Design (hell/dunkel)
- Responsive Mobile-First Layout
- DSGVO-konform (Cookie-Banner, Datenschutz, Impressum)
- BITV 2.0 Barrierefreiheit (Alt-Texte, ARIA, Kontrast)
- Kontaktformular mit Backend-Speicherung
- Admin-Bereich mit Email-Code-Authentifizierung

## What's Been Implemented (Dezember 2025)

### Phase 1 - MVP Complete ✅
**Backend (FastAPI + MongoDB):**
- `/api/contact` - Kontaktformular Speicherung
- `/api/admin/request-code` - Admin-Login Code-Anforderung
- `/api/admin/verify-code` - Code-Verifizierung
- `/api/blog` - Blog-Posts CRUD
- `/api/gallery` - Galerie-Bilder
- `/api/seed` - Seed-Daten für Demo

**Frontend (React + Tailwind):**
- Home mit Hero, Teaser-Cards, Blog-Preview
- Schwangerschaft & Geburt Seite
- Baby-Alltag Seite
- Tipps & Hacks mit Filter
- Twins-Art Galerie mit Lightbox und Tags
- PayPal.me Unterstützungs-Button (paypal.me/gltzfamily)
- Funktionales Kontaktformular
- Admin-Bereich mit OTP-Login
- Dark/Light Mode Toggle
- Cookie-Banner (Opt-in)
- Impressum (John D. Gold, Schützenstraße 38, 47829 Krefeld)
- Datenschutz (DSGVO-konform)

**Rechtliche Hinweise:**
- Footer-Disclaimer: "Dies ist keine Spende im steuerlichen Sinne..."
- Twins-Art Seite mit prominentem Rechtstext
- Datenschutz mit PayPal-Hinweis

## Prioritized Backlog

### P0 - Critical (Next)
- [ ] Gmail/Sheets Integration für Kontaktformular (Pica)
- [ ] Email-Versand für Admin-Codes
- [ ] Custom Domain Setup (gltz.de)

### P1 - Important
- [ ] Blog-Beiträge Admin-Editor
- [ ] Galerie-Upload im Admin
- [ ] Google Analytics 4 Integration
- [ ] Facebook Pixel (mit Cookie-Consent)

### P2 - Nice to Have
- [ ] Newsletter-Anmeldung
- [ ] Kommentar-Funktion für Blog
- [ ] Social Sharing Buttons
- [ ] PWA Support
- [ ] Hostinger-Export ZIP

## Tech Stack
- **Frontend:** React 19, Tailwind CSS, Framer Motion, Shadcn/UI
- **Backend:** FastAPI, Motor (async MongoDB)
- **Database:** MongoDB
- **Hosting:** Emergent Platform

## Key Files
- `/app/backend/server.py` - API Endpoints
- `/app/frontend/src/App.js` - Router & Layout
- `/app/frontend/src/pages/` - Alle Seiten
- `/app/frontend/src/components/` - UI Komponenten
- `/app/frontend/src/context/ThemeContext.js` - Dark/Light Mode

## Admin Access
- Email: gltz.de@gmail.com
- Code wird in Backend-Logs angezeigt (später: Email-Versand)
- URL: /admin

## Kontakt
- John D. Gold
- Schützenstraße 38, 47829 Krefeld
- Tel: 01575 731 2560
- Email: gltz.de@gmail.com
