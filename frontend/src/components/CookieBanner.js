import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { Button } from './ui/button';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      role="dialog"
      aria-label="Cookie-Einstellungen"
      data-testid="cookie-banner"
    >
      <div className="container-width">
        <div className="glass-card rounded-2xl p-6 sm:p-8 relative">
          <button
            onClick={handleDecline}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="Banner schließen"
            data-testid="cookie-close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
            </div>

            <div className="flex-grow pr-8 sm:pr-0">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Cookie-Einstellungen
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Wir verwenden nur technisch notwendige Cookies für die Funktion dieser Website. 
                Es werden keine Tracking- oder Analyse-Cookies eingesetzt. 
                Weitere Informationen findest du in unserer{' '}
                <a href="/datenschutz" className="text-primary hover:underline">
                  Datenschutzerklärung
                </a>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={handleAccept}
                className="btn-primary whitespace-nowrap"
                data-testid="cookie-accept"
              >
                Verstanden
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                className="btn-secondary whitespace-nowrap"
                data-testid="cookie-decline"
              >
                Ablehnen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
