import { motion } from 'framer-motion';
import { Moon, Baby, Smile, Clock } from 'lucide-react';

export default function BabyAlltag() {
  const routines = [
    {
      icon: Moon,
      title: 'Schlaf-Routinen',
      description: 'Sync-Bettchen ab Monat 3',
      result: '6h Nachtruhe möglich',
      tips: [
        'Beide Babys gleichzeitig hinlegen',
        'Gemeinsame Schlafzeiten etablieren',
        'Dunkles Zimmer und weißes Rauschen',
        'Konsistente Abendroutine',
      ],
    },
    {
      icon: Baby,
      title: 'Füttern',
      description: 'Flaschenkarussell-Methode',
      result: '10 Min pro Baby sparen',
      tips: [
        'Flaschen im Voraus vorbereiten',
        'Beide gleichzeitig füttern wenn möglich',
        'Feste Fütterungszeiten einhalten',
        'Rülpspausen synchronisieren',
      ],
    },
    {
      icon: Smile,
      title: 'Spielen',
      description: 'Altersgerechte Zwillings-Aktivitäten',
      result: 'Gemeinsame Entwicklung fördern',
      tips: [
        'Spiegel-Tunnel für Selbstwahrnehmung',
        'Duplo-Duets zum gemeinsamen Bauen',
        'Interaktive Spielzeuge teilen',
        'Soziale Interaktion ermöglichen',
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
              Baby-Alltag
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Zwillinge im Alltag – Routinen die funktionieren
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {routines.map((routine, index) => (
              <motion.div
                key={routine.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#A8D5E2]/10 dark:bg-[#A8D5E2]/20 rounded-2xl mb-6">
                  <routine.icon className="w-7 h-7 text-[#A8D5E2]" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {routine.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {routine.description}
                </p>
                <div className="bg-[#A8D5E2]/10 dark:bg-[#A8D5E2]/20 p-4 rounded-xl mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#A8D5E2]" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {routine.result}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {routine.tips.map((tip) => (
                    <li key={tip} className="text-sm text-gray-700 dark:text-gray-300">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-3xl shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Zwillinge-Ernährung: 10 Argumente
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Warum spezielle Zwillinge-Ernährung? Bei Zwillingen ist der
                Nährstoffbedarf in der Schwangerschaft und die Koordination nach der Geburt
                besonders wichtig.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Doppelter Kalorienbedarf in der Schwangerschaft',
                  'Synchrone Fütterungszeiten sparen Zeit',
                  'Angepasste Portionsgrößen 0-12 Monate',
                  'Gemeinsame Geschmacksentwicklung',
                  'Praktische Mengenplanung',
                  'Reduzierter Stress durch Routine',
                  'Bessere Nachtruhe durch Synchronisation',
                  'Effiziente Zubereitung',
                  'Gerechte Verteilung',
                  'Förderung der Geschwisterbindung',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl"
                  >
                    <span className="text-[#A8D5E2] font-bold">{index + 1}.</span>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
