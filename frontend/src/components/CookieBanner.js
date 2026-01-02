import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, Shield } from 'lucide-react';
import { Button } from './ui/button';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential-only');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          role="dialog"
          aria-label="Cookie-Einstellungen"
        >
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Main Banner */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-primary/10 items-center justify-center shrink-0">
                    <Cookie className="w-5 h-5 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      🍪 Cookie-Hinweis
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Wir nutzen nur <strong>technisch notwendige Cookies</strong> für den Betrieb dieser Website. 
                      Keine Werbung, kein Tracking.
                    </p>
                    
                    {/* Links */}
                    <div className="flex flex-wrap gap-3 mt-3 text-xs">
                      <Link to="/cookies" className="text-primary hover:underline inline-flex items-center gap-1">
                        <Cookie className="w-3 h-3" /> Cookie-Richtlinie
                      </Link>
                      <Link to="/datenschutz" className="text-primary hover:underline inline-flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Datenschutz
                      </Link>
                      <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        <Settings className="w-3 h-3" /> {showDetails ? 'Weniger' : 'Details'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details Panel */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid gap-3">
                          {/* Essential Cookies */}
                          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-foreground">Notwendige Cookies</p>
                              <p className="text-xs text-muted-foreground">Für Grundfunktionen wie Theme-Einstellung</p>
                            </div>
                            <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full">Immer aktiv</span>
                          </div>
                          
                          {/* Analytics */}
                          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg opacity-60">
                            <div>
                              <p className="text-sm font-medium text-foreground">Analyse-Cookies</p>
                              <p className="text-xs text-muted-foreground">Nicht verwendet</p>
                            </div>
                            <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">Deaktiviert</span>
                          </div>
                          
                          {/* Marketing */}
                          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg opacity-60">
                            <div>
                              <p className="text-sm font-medium text-foreground">Marketing-Cookies</p>
                              <p className="text-xs text-muted-foreground">Nicht verwendet</p>
                            </div>
                            <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">Deaktiviert</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button
                    onClick={handleAccept}
                    className="flex-1 bg-foreground text-background hover:bg-foreground/90"
                  >
                    Alle akzeptieren
                  </Button>
                  <Button
                    onClick={handleAcceptEssential}
                    variant="outline"
                    className="flex-1"
                  >
                    Nur notwendige
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
