import { motion } from 'framer-motion';
import { Utensils, Apple, Calendar, Users, Cake, Brain } from 'lucide-react';

export default function Tipps() {
  const tipCards = [
    {
      icon: Utensils,
      title: 'Tischmanieren',
      description: 'Kauen spielerisch beibringen',
      content: [
        'Mit gutem Beispiel vorangehen',
        'Gemeinsame Mahlzeiten zelebrieren',
        'Spielerische Übungen integrieren',
        'Geduld und positive Verstärkung',
      ],
    },
    {
      icon: Apple,
      title: 'Wählerische Esser',
      description: 'Neue Speisen ohne Druck einführen',
      content: [
        'Keine Zwänge beim Probieren',
        'Vielfalt anbieten ohne Erwartungen',
        'Kreative Präsentation nutzen',
        'Gemeinsam neue Gerichte entdecken',
      ],
    },
    {
      icon: Calendar,
      title: 'Familienkost',
      description: 'Von Brei zu Löffel – Tabelle für Zwillinge',
      content: [
        'Monat 6-8: Einführung Brei',
        'Monat 8-10: Fingerfood beginnen',
        'Monat 10-12: Familienkost anpassen',
        'Ab Monat 12: Gemeinsame Mahlzeiten',
      ],
    },
    {
      icon: Users,
      title: 'Betreuung',
      description: 'Kita vs. Tagesmutter – Vor- und Nachteile',
      content: [
        'Kita: Sozialisation und Struktur',
        'Tagesmutter: Individuelle Betreuung',
        'Kosten und Verfügbarkeit prüfen',
        'Probezeiten nutzen für Entscheidung',
      ],
    },
    {
      icon: Cake,
      title: 'Geburtstags-Hacks',
      description: 'Doppelter Spaß, halbe Arbeit',
      content: [
        'Gemeinsame Themenpartys planen',
        'Einladungen früh versenden',
        'Helfer für die Organisation einbinden',
        'Zeitversetzt feiern als Option',
      ],
    },
    {
      icon: Brain,
      title: 'Mental Load',
      description: 'Zeitmanagement Zwillings-Papa/Mama',
      content: [
        'Aufgaben klar verteilen',
        'Wochenplan gemeinsam erstellen',
        'Zeit für sich selbst einplanen',
        'Hilfe annehmen ohne Schuldgefühle',
      ],
    },
  ];

  return (
    <main id="main-content" className="pt-20">
      <section className="py-20 sm:py-32 bg-gradient-to-br from-gray-50 via-white to-[#A8D5E2]/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Tipps & Ratgeber
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Praktische Lösungen für den Zwillingsalltag
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tipCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#A8D5E2]/10 dark:bg-[#A8D5E2]/20 rounded-2xl mb-6">
                  <card.icon className="w-7 h-7 text-[#A8D5E2]" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-[#A8D5E2] font-medium mb-6">{card.description}</p>
                <ul className="space-y-3">
                  {card.content.map((item) => (
                    <li
                      key={item}
                      className="text-gray-700 dark:text-gray-300 leading-relaxed"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-4xl mx-auto mt-16"
          >
            <div className="bg-gradient-to-br from-[#A8D5E2]/10 to-white dark:from-gray-800 dark:to-gray-900 p-8 sm:p-12 rounded-3xl border border-[#A8D5E2]/30">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Unser wichtigster Tipp
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                Perfektionismus ablegen und Prioritäten setzen. Bei Zwillingen ist es
                unmöglich, alles gleichzeitig zu schaffen. Konzentriert euch auf das
                Wesentliche und feiert die kleinen Erfolge.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
