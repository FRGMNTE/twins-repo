import { motion } from 'framer-motion';

export default function Impressum() {
  return (
    <main id="main-content" className="pt-20">
      <section className="py-20 sm:py-32 bg-gradient-to-br from-gray-50 via-white to-[#A8D5E2]/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-12">
              Impressum
            </h1>

            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-3xl shadow-lg space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Angaben gemäß § 5 TMG
                </h2>
                <div className="text-gray-700 dark:text-gray-300 space-y-2">
                  <p>Max Mustermann</p>
                  <p>Musterstraße 123</p>
                  <p>47803 Krefeld</p>
                  <p>Deutschland</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Kontakt
                </h2>
                <div className="text-gray-700 dark:text-gray-300 space-y-2">
                  <p>Telefon: +49 (0) 2151 123456</p>
                  <p>E-Mail: info@gltz.de</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
                </h2>
                <div className="text-gray-700 dark:text-gray-300 space-y-2">
                  <p>Max Mustermann</p>
                  <p>Musterstraße 123</p>
                  <p>47803 Krefeld</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Haftungsausschluss
                </h2>
                <div className="text-gray-700 dark:text-gray-300 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Haftung für Inhalte</h3>
                    <p className="leading-relaxed">
                      Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für
                      die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können
                      wir jedoch keine Gewähr übernehmen.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Haftung für Links</h3>
                    <p className="leading-relaxed">
                      Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren
                      Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
                      fremden Inhalte auch keine Gewähr übernehmen.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Urheberrecht</h3>
                    <p className="leading-relaxed">
                      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                      diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                      Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                      Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                      schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Datenschutz
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Die Nutzung unserer Webseite ist in der Regel ohne Angabe
                  personenbezogener Daten möglich. Soweit auf unseren Seiten
                  personenbezogene Daten erhoben werden, erfolgt dies stets auf
                  freiwilliger Basis. Weitere Informationen finden Sie in unserer{' '}
                  <a
                    href="/datenschutz"
                    className="text-[#A8D5E2] hover:underline font-medium"
                  >
                    Datenschutzerklärung
                  </a>
                  .
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
