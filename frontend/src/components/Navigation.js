import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mountain, Waves } from 'lucide-react';
import CelestialSwitch from './CelestialSwitch';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/schwangerschaft', label: 'Schwangerschaft' },
    { path: '/baby-alltag', label: 'Baby-Alltag' },
    { path: '/tipps', label: 'Tipps' },
    { path: '/twins-art', label: 'Twins-Art' },
    { path: '/kontakt', label: 'Kontakt' },
  ];

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
        data-testid="skip-link"
      >
        Zum Hauptinhalt springen
      </a>

      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass shadow-sm'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Hauptnavigation"
        data-testid="main-navigation"
      >
        <div className="container-width">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo with Watermark Symbol */}
            <Link
              to="/"
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-foreground hover:opacity-70 transition-opacity"
              aria-label="gltz.de Startseite"
              data-testid="logo-link"
            >
              {/* Watermark Symbol - Mountain & Wave combined */}
              <div className="relative w-10 h-10 flex items-center justify-center" data-testid="logo-watermark">
                <svg 
                  viewBox="0 0 40 40" 
                  className="w-10 h-10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Mountain */}
                  <path 
                    d="M5 28L15 12L20 20L25 14L35 28" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-primary"
                  />
                  {/* Wave */}
                  <path 
                    d="M5 32C8 30 11 34 14 32C17 30 20 34 23 32C26 30 29 34 32 32C35 30 37 32 38 32" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    className="text-primary opacity-70"
                  />
                  {/* Sun/Moon circle */}
                  <circle 
                    cx="30" 
                    cy="10" 
                    r="4" 
                    className="fill-current text-secondary dark:text-sky-400"
                  />
                </svg>
              </div>
              <span>gltz.de</span>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                  }`}
                  data-testid={`nav-link-${link.path.replace('/', '') || 'home'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <CelestialSwitch />

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-accent/10 transition-colors"
                aria-label="Menü öffnen"
                aria-expanded={isOpen}
                data-testid="mobile-menu-toggle"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden glass border-t border-border" data-testid="mobile-menu">
            <div className="container-width py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
