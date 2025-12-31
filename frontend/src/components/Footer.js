import { Link } from 'react-router-dom';
import { Heart, Mountain, Waves, Facebook, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border" data-testid="footer">
      <div className="container-width py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="w-6 h-6 text-primary" />
              <Waves className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">gltz.de</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-4">
              Unsere Reise mit Zwillingen – von den Bergen bis zum Meer. 
              Anonyme Tipps für junge Familien vom Niederrhein.
            </p>
            <p className="font-handwriting text-lg text-primary">
              Mountain & Ocean Journey
            </p>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
              Rechtliches
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/impressum"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="footer-impressum"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  to="/datenschutz"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="footer-datenschutz"
                >
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
              Kontakt
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:gltz.de@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                data-testid="footer-email"
              >
                <Mail className="w-4 h-4" />
                gltz.de@gmail.com
              </a>
              <a
                href="https://www.facebook.com/people/%E0%B9%80%E0%B8%A1%E0%B8%B2%E0%B8%99%E0%B9%8C%E0%B9%80%E0%B8%97%E0%B8%B4%E0%B8%99-%E0%B9%82%E0%B8%AD%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B9%88%E0%B8%99/61584716588683/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                aria-label="Besuche unsere Facebook-Seite Mountain Ocean"
                data-testid="footer-facebook"
              >
                <Facebook className="w-4 h-4" />
                Mountain Ocean
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Legal Notice for Support */}
        <div className="pt-8 border-t border-border mb-8">
          <div className="p-4 bg-muted/30 rounded-xl">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              <strong>Hinweis zur Unterstützung:</strong> Dies ist keine Spende im steuerlichen Sinne. 
              Es erfolgt KEINE Gegenleistung (keine Ware/Dienstleistung). 
              100% freiwillige Unterstützung für unser Familienprojekt.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} gltz.de – Alle Rechte vorbehalten
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Erstellt mit <Heart className="w-3 h-3 text-red-500" aria-hidden="true" /> für Familien
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
