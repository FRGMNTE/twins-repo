import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import CelestialSwitch from './CelestialSwitch';
import { useSiteSettings } from '../context/SiteSettingsContext';

const DEFAULT_NAV_ITEMS = [
  { id: '1', label: 'Home', path: '/', enabled: true, children: [] },
  { id: '2', label: 'Über uns', path: '/ueber-uns', enabled: true, children: [] },
  { id: '3', label: 'Schwangerschaft', path: '/schwangerschaft', enabled: true, children: [] },
  { id: '4', label: 'Baby-Alltag', path: '/baby-alltag', enabled: true, children: [] },
  { id: '5', label: 'Tipps', path: '/tipps', enabled: true, children: [] },
  { id: '6', label: 'Reisen', path: '/reisen', enabled: true, children: [] },
  { id: '7', label: 'Blog', path: '/blog', enabled: true, children: [] },
  { id: '8', label: 'Suchen', path: '/suchen', enabled: true, children: [] },
  { id: '9', label: 'M&O Portfolio', path: '/mo-portfolio', enabled: true, children: [
    { id: '9-1', label: 'Twins-Art', path: '/twins-art', enabled: true }
  ]},
  { id: '10', label: 'Spende', path: '/spende', enabled: true, children: [] },
  { id: '11', label: 'Kontakt', path: '/kontakt', enabled: true, children: [] },
];

function NavDropdown({ item, location }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const enabledChildren = (item.children || []).filter(child => child.enabled);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  if (enabledChildren.length === 0) {
    return (
      <Link
        to={item.path}
        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
          location.pathname === item.path
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
          location.pathname === item.path || enabledChildren.some(c => location.pathname === c.path)
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 py-2 min-w-[160px] bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-lg z-50">
          {/* Parent link */}
          <Link
            to={item.path}
            className={`block px-4 py-2 text-xs font-medium transition-colors ${
              location.pathname === item.path
                ? 'text-foreground bg-secondary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
            onClick={() => setIsOpen(false)}
          >
            {item.label} (Übersicht)
          </Link>
          
          <div className="border-t border-border my-1" />
          
          {/* Children links */}
          {enabledChildren.map((child) => (
            <Link
              key={child.id}
              to={child.path}
              className={`block px-4 py-2 text-xs font-medium transition-colors ${
                location.pathname === child.path
                  ? 'text-foreground bg-secondary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState(null);
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
    setExpandedMobileItem(null);
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
              {settings.logoImage ? (
                <img src={settings.logoImage} alt={settings.logoText || 'Logo'} className="h-8 object-contain" />
              ) : (
                settings.logoText || 'gltz.de'
              )}
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavDropdown key={item.id} item={item} location={location} />
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
              {navItems.map((item) => {
                const enabledChildren = (item.children || []).filter(child => child.enabled);
                const hasChildren = enabledChildren.length > 0;

                return (
                  <div key={item.id}>
                    {hasChildren ? (
                      <>
                        <button
                          onClick={() => setExpandedMobileItem(expandedMobileItem === item.id ? null : item.id)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                            location.pathname === item.path || enabledChildren.some(c => location.pathname === c.path)
                              ? 'text-foreground bg-secondary'
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                          }`}
                        >
                          {item.label}
                          <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobileItem === item.id ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {expandedMobileItem === item.id && (
                          <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-4">
                            <Link
                              to={item.path}
                              className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                location.pathname === item.path
                                  ? 'text-foreground bg-secondary'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                              }`}
                            >
                              Übersicht
                            </Link>
                            {enabledChildren.map((child) => (
                              <Link
                                key={child.id}
                                to={child.path}
                                className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  location.pathname === child.path
                                    ? 'text-foreground bg-secondary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                }`}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                          location.pathname === item.path
                            ? 'text-foreground bg-secondary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
