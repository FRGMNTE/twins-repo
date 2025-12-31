# gltz.de - Familienseite PRD

## Original Problem Statement
Erweitere die importierte Bolt.new-Seite zu einer vollständigen, produktiven gltz.de-Familienseite mit Apple.com-Style minimalistischem Design, Admin-Bereich mit Customization-Optionen, Kontaktformular, Twins-Art Galerie mit PayPal-Unterstützungs-Button.

## User Personas
1. **Junge Zwillingseltern** - Suchen praktische Tipps und Erfahrungsaustausch
2. **Schwangere mit Zwillingen** - Brauchen Vorbereitung und emotionale Unterstützung
3. **Unterstützer/Fans** - Möchten das Familienprojekt finanziell unterstützen

## Core Requirements
- Apple.com-Style minimalistisches Design
- Celestial Switch: Sonne (hell) / Mond (dunkel)
- Admin-Bereich mit Customization (Farben, Schriften, Hintergründe, Überschriften)
- Responsive Mobile-First Layout
- DSGVO-konform (Cookie-Banner, Datenschutz, Impressum)
- Kontaktformular mit Backend-Speicherung

## What's Been Implemented (Dezember 2025)

### Phase 1 - MVP Complete ✅
**Design - Apple-Style Minimal:**
- Inter Font (SF Pro Display Style)
- Saubere schwarze/weiße Farbpalette
- Celestial Switch mit Sonne (gelb) und Mond (weiß)
- Berge bei Sonnenaufgang (hell) / Wald bei Nacht (dunkel)
- Minimaler Whitespace, cleane Typografie

**Admin Customization Panel:**
- Logo Text ändern
- Hero Überschrift, Untertitel, Beschreibung ändern
- Schriftart wählen (Inter, Manrope, Playfair Display, SF Pro)
- Primärfarbe mit Color Picker
- Hell-Modus Hintergrund (4 Presets + Custom URL)
- Dunkel-Modus Hintergrund (4 Presets + Custom URL)
- Settings werden in MongoDB gespeichert

**Backend (FastAPI + MongoDB):**
- `/api/settings` - GET/POST Site-Einstellungen
- `/api/contact` - Kontaktformular Speicherung
- `/api/admin/request-code` - Admin-Login Code-Anforderung
- `/api/admin/verify-code` - Code-Verifizierung
- `/api/blog` - Blog-Posts CRUD
- `/api/gallery` - Galerie-Bilder

**Frontend (React + Tailwind):**
- Home mit minimalistischem Hero
- Twins-Art Galerie mit Lightbox
- Funktionales Kontaktformular
- Admin-Bereich mit Tabs (Einstellungen, Kontakte)
- Dark/Light Mode Toggle
- Cookie-Banner (Opt-in)
- Impressum, Datenschutz

**Social Media:**
- Facebook: https://www.facebook.com/people/เมาน์เทิน-โอเชิ่น/61584716588683/

## Prioritized Backlog

### P0 - Critical (Next)
- [ ] Gmail/Sheets Integration für Kontaktformular
- [ ] Email-Versand für Admin-Codes
- [ ] Custom Domain Setup (gltz.de)

### P1 - Important
- [ ] Blog-Beiträge Admin-Editor
- [ ] Galerie-Upload im Admin
- [ ] Google Analytics 4 Integration

### P2 - Nice to Have
- [ ] Newsletter-Anmeldung
- [ ] Kommentar-Funktion für Blog
- [ ] PWA Support

## Tech Stack
- **Frontend:** React 19, Tailwind CSS, Framer Motion, Shadcn/UI
- **Backend:** FastAPI, Motor (async MongoDB)
- **Database:** MongoDB
- **Hosting:** Emergent Platform

## Admin Access
- Email: gltz.de@gmail.com
- URL: /admin
- Features: Settings (Texte, Farben, Schriften, Hintergründe), Kontakte

## Kontakt
- John D. Gold
- Schützenstraße 38, 47829 Krefeld
- Tel: 01575 731 2560
- Email: gltz.de@gmail.com
