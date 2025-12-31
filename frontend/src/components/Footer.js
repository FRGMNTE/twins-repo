import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Footer() {
  const { settings } = useSiteSettings();
  
  return (
    <footer className="border-t border-border bg-background" data-testid="footer">
      <div className="container-width py-12">
        {/* Main Footer */}
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {settings.logoText || 'gltz.de'}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Unsere Reise mit Zwillingen. Anonyme Tipps für junge Familien.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
                Seiten
              </h4>
              <ul className="space-y-2">
                <li><Link to="/tipps" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Tipps</Link></li>
                <li><Link to="/twins-art" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Twins-Art</Link></li>
                <li><Link to="/kontakt" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Kontakt</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
                Rechtliches
              </h4>
              <ul className="space-y-2">
                <li><Link to="/impressum" className="text-xs text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-impressum">Impressum</Link></li>
                <li><Link to="/datenschutz" className="text-xs text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-datenschutz">Datenschutz</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
                Social
              </h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://www.facebook.com/people/%E0%B9%80%E0%B8%A1%E0%B8%B2%E0%B8%99%E0%B9%8C%E0%B9%80%E0%B8%97%E0%B8%B4%E0%B8%99-%E0%B9%82%E0%B8%AD%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B9%88%E0%B8%99/61584716588683/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="footer-facebook"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:gltz.de@gmail.com"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="footer-email"
                  >
                    E-Mail
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="py-4 border-t border-border mb-4">
          <p className="text-[10px] text-muted-foreground text-center">
            Hinweis zur Unterstützung: Dies ist keine Spende im steuerlichen Sinne. 
            Es erfolgt keine Gegenleistung. 100% freiwillige Unterstützung für unser Familienprojekt.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex justify-between items-center text-[10px] text-muted-foreground">
          <p>© {new Date().getFullYear()} gltz.de</p>
          <p>Made with love for families</p>
        </div>
      </div>
    </footer>
  );
}
