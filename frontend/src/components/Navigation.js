import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import CelestialSwitch from './CelestialSwitch';
import { useSiteSettings } from '../context/SiteSettingsContext';

const DEFAULT_NAV_ITEMS = [
  { id: '1', label: 'Home', path: '/', enabled: true },
  { id: '2', label: 'Schwangerschaft', path: '/schwangerschaft', enabled: true },
  { id: '3', label: 'Baby-Alltag', path: '/baby-alltag', enabled: true },
  { id: '4', label: 'Tipps', path: '/tipps', enabled: true },
  { id: '5', label: 'Twins-Art', path: '/twins-art', enabled: true },
  { id: '6', label: 'Kontakt', path: '/kontakt', enabled: true },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();

  const navItems = (settings.navItems && settings.navItems.length > 0) 
    ? settings.navItems.filter(item => item.enabled) 
    : DEFAULT_NAV_ITEMS;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-lg"
        data-testid="skip-link"
      >
        Zum Hauptinhalt springen
      </a>

      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'glass border-b border-border' : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Hauptnavigation"
        data-testid="main-navigation"
      >
        <div className="container-width">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link
              to="/"
              className="text-lg font-semibold text-foreground hover:opacity-60 transition-opacity"
              aria-label="Startseite"
              data-testid="logo-link"
            >
              {settings.logoText || 'gltz.de'}
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`nav-link-${item.path.replace('/', '') || 'home'}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <CelestialSwitch />

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Menü öffnen"
                aria-expanded={isOpen}
                data-testid="mobile-menu-toggle"
              >
                {isOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden glass border-t border-border" data-testid="mobile-menu">
            <div className="container-width py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'text-foreground bg-secondary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
