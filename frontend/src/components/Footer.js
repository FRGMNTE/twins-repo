import { Link } from 'react-router-dom';
import { Heart, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border" data-testid="footer">
      <div className="container-width py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-foreground mb-4">gltz.de</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Unsere Reise mit Zwillingen. Anonyme Tipps für junge Familien vom Niederrhein. 
              Von Schwangerschaft bis Kleinkindalltag – praxisnah & ehrlich.
            </p>
          </div>

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
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                aria-label="Besuche unsere Facebook-Seite"
                data-testid="footer-facebook"
              >
                <Facebook className="w-4 h-4" />
                Folge uns auf Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
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
