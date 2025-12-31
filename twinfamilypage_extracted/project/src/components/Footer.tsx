import { Link } from 'react-router-dom';
import { Facebook, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              gltz.de
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Unsere Reise mit Zwillingen. Anonyme Tipps für junge Familien vom Niederrhein.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Rechtliches
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/impressum"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#A8D5E2] transition-colors"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  to="/datenschutz"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#A8D5E2] transition-colors"
                >
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Folge uns
            </h3>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#A8D5E2] transition-colors"
              aria-label="Besuche unsere Facebook-Seite"
            >
              <Facebook className="w-5 h-5" />
              <span>Facebook Twins-Seite</span>
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Mehr Alltagstipps und Updates
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 gltz.de – Alle Rechte vorbehalten
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              Erstellt mit <Heart className="w-4 h-4 text-red-500" /> für Familien
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
