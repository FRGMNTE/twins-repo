import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';

const DEFAULT_FOOTER_LINKS = [
  { id: '1', label: 'Impressum', path: '/impressum', enabled: true },
  { id: '2', label: 'Datenschutz', path: '/datenschutz', enabled: true },
];

export default function Footer() {
  const { settings } = useSiteSettings();
  
  const footerLinks = (settings.footerLinks && settings.footerLinks.length > 0) 
    ? settings.footerLinks.filter(link => link.enabled) 
    : DEFAULT_FOOTER_LINKS;

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
              {settings.footerText || 'Unsere Reise mit Zwillingen. Anonyme Tipps für junge Familien.'}
            </p>
          </div>

          <div className="flex gap-12">
            {/* Dynamic Footer Links - Rechtliches */}
            {footerLinks.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
                  Rechtliches
                </h4>
                <ul className="space-y-2">
                  {footerLinks.map((link) => (
                    <li key={link.id}>
                      <Link 
                        to={link.path} 
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        data-testid={`footer-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Kontakt - nur E-Mail und Facebook */}
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
                Kontakt
              </h4>
              <ul className="space-y-2">
                {settings.socialEmail && (
                  <li>
                    <a 
                      href={`mailto:${settings.socialEmail}`}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="footer-email"
                    >
                      E-Mail
                    </a>
                  </li>
                )}
                {settings.socialFacebook && (
                  <li>
                    <a 
                      href={settings.socialFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="footer-facebook"
                    >
                      Facebook
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="py-4 border-t border-border mb-4">
          <p className="text-[10px] text-muted-foreground text-center">
            {settings.donationDisclaimer || 'Hinweis zur Unterstützung: Dies ist keine Spende im steuerlichen Sinne. Es erfolgt keine Gegenleistung. 100% freiwillige Unterstützung für unser Familienprojekt.'}
          </p>
        </div>

        {/* Copyright - mit geheimem Admin-Link */}
        <div className="flex justify-between items-center text-[10px] text-muted-foreground">
          <p>© {new Date().getFullYear()} <Link to="/admin" className="hover:text-foreground transition-colors" data-testid="secret-admin-link">{settings.logoText || 'gltz.de'}</Link></p>
          <p>Made with love for families</p>
        </div>
      </div>
    </footer>
  );
}
