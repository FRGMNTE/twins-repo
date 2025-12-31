import { motion } from 'framer-motion';

export default function Datenschutz() {
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
              Datenschutzerklärung
            </h1>

            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-3xl shadow-lg space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Datenschutz auf einen Blick
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit
                  Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Anonymität unserer Kinder
                </h2>
                <div className="bg-[#A8D5E2]/10 dark:bg-[#A8D5E2]/20 p-6 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    Der Schutz unserer Kinder hat oberste Priorität. Auf dieser Website
                    werden keine Gesichter, Namen oder spezifische Orte unserer Kinder
                    veröffentlicht. Alle geteilten Inhalte sind anonym und dienen
                    ausschließlich informativen Zwecken.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Datenerfassung auf unserer Website
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <div>
                    <h3 className="font-semibold mb-2">
                      Wer ist verantwortlich für die Datenerfassung?
                    </h3>
                    <p className="leading-relaxed">
                      Die Datenverarbeitung auf dieser Website erfolgt durch den
                      Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum
                      entnehmen.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Wie erfassen wir Ihre Daten?</h3>
                    <p className="leading-relaxed">
                      Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
                      mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in
                      ein Kontaktformular eingeben. Andere Daten werden automatisch beim
                      Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor
                      allem technische Daten (z.B. Internetbrowser, Betriebssystem oder
                      Uhrzeit des Seitenaufrufs).
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Cookies
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr
                  Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser
                  Angebot nutzerfreundlicher zu gestalten.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Sie können Ihren Browser so einstellen, dass Sie über das Setzen von
                  Cookies informiert werden und einzeln über deren Annahme entscheiden oder
                  die Annahme von Cookies für bestimmte Fälle oder generell ausschließen
                  können.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Kontaktformular
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre
                  Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen
                  Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von
                  Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne
                  Ihre Einwilligung weiter.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Social Media und Facebook
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Wir verlinken auf unsere Facebook-Seite. Wenn Sie diesem Link folgen,
                  verlassen Sie unsere Website und unterliegen den Datenschutzbestimmungen
                  von Facebook.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Facebook-Posts über unsere Familie erfolgen nur mit unserem ausdrücklichen
                  Consent und unter Wahrung der Anonymität unserer Kinder.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Ihre Rechte
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre
                  gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und
                  den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung,
                  Sperrung oder Löschung dieser Daten.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Kontakt
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Bei Fragen zum Datenschutz können Sie sich jederzeit unter den im
                  Impressum angegebenen Kontaktdaten an uns wenden.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
