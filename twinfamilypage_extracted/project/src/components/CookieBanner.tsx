import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('gltz-cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gltz-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('gltz-cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-2xl"
      role="dialog"
      aria-label="Cookie-Einwilligung"
      aria-describedby="cookie-description"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p id="cookie-description" className="text-sm text-gray-700 dark:text-gray-300">
            Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern und um
            anonyme Statistiken zu sammeln. Durch die Nutzung unserer Website stimmen Sie der
            Verwendung von Cookies gemäß unserer{' '}
            <a
              href="/datenschutz"
              className="text-[#A8D5E2] hover:underline font-medium"
            >
              Datenschutzerklärung
            </a>{' '}
            zu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Cookies ablehnen"
          >
            Ablehnen
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 text-sm font-medium text-white bg-[#A8D5E2] hover:bg-[#8BC5D4] rounded-lg transition-colors"
            aria-label="Cookies akzeptieren"
          >
            Akzeptieren
          </button>
          <button
            onClick={handleDecline}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Banner schließen"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
