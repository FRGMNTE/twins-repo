import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const DEFAULT_FOOTER_LINKS = [
  { id: '1', label: 'Impressum', path: '/impressum', enabled: true },
  { id: '2', label: 'Datenschutz', path: '/datenschutz', enabled: true },
  { id: '3', label: 'Cookies', path: '/cookies', enabled: true },
];

const SOCIAL_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  tiktok: () => <span className="text-xs font-bold">TT</span>,
};

const SOCIAL_NAMES = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  twitter: 'X (Twitter)',
};

export default function Footer() {
  const { settings } = useSiteSettings();
  
  // Ensure Cookies link is always present
  const baseLinks = (settings.footerLinks && settings.footerLinks.length > 0) 
    ? settings.footerLinks.filter(link => link.enabled) 
    : DEFAULT_FOOTER_LINKS;
  
  // Add Cookies if not present
  const hasCookies = baseLinks.some(link => link.path === '/cookies');
  const footerLinks = hasCookies ? baseLinks : [...baseLinks, { id: '3', label: 'Cookies', path: '/cookies', enabled: true }];

  const enabledSocialLinks = (settings.socialLinks || []).filter(link => link.enabled && link.url);
  const footerEmail = settings.footerEmail || settings.socialEmail || '';

  return (
    <footer className="border-t border-border bg-background" data-testid="footer">
      <div className="container-width py-12">
        {/* Main Footer */}
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {settings.logoImage ? (
                <img src={settings.logoImage} alt={settings.logoText || 'Logo'} className="h-6 object-contain" />
              ) : (
                settings.logoText || 'gltz.de'
              )}
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
                    <li key={link.id} className="leading-tight">
                      <Link 
                        to={link.path} 
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-block"
                        data-testid={`footer-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Kontakt - nur E-Mail */}
            {footerEmail && (
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
                  Kontakt
                </h4>
                <ul className="space-y-2">
                  <li className="leading-tight">
                    <a 
                      href={`mailto:${footerEmail}`}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-block"
                      data-testid="footer-email"
                    >
                      E-Mail
                    </a>
                  </li>
                </ul>
              </div>
            )}

            {/* Social Links - Nur Icon ODER Text (konfigurierbar) */}
            {enabledSocialLinks.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
                  Social Media
                </h4>
                <ul className="space-y-2">
                  {enabledSocialLinks.map((link) => {
                    const IconComponent = SOCIAL_ICONS[link.platform] || Facebook;
                    const platformName = SOCIAL_NAMES[link.platform] || link.platform;
                    const showIcon = link.displayMode !== 'text';
                    const showText = link.displayMode !== 'icon';

                    return (
                      <li key={link.id} className="leading-tight">
                        <a 
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                          data-testid={`footer-${link.platform}`}
                        >
                          {showIcon && <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />}
                          {showText && <span>{platformName}</span>}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
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
