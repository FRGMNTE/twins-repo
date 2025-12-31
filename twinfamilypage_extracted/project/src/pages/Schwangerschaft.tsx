import { motion } from 'framer-motion';
import { Briefcase, Home, Heart, CheckCircle } from 'lucide-react';

export default function Schwangerschaft() {
  const tips = [
    {
      icon: Briefcase,
      title: 'Kliniktasche',
      items: [
        '2x Windeln für Neugeborene',
        '2x Bodies in verschiedenen Größen',
        'Thermometer für beide Babys',
        'Doppelte Wickelausstattung',
        'Stillkissen und Fläschchen',
      ],
    },
    {
      icon: Home,
      title: 'Haus-Organisation',
      items: [
        'Helfer für erste Wochen einplanen',
        'Mahlzeiten vorkochen und einfrieren',
        'Kinderzimmer vorbereiten',
        'Besuchsplan erstellen',
        'Einkäufe im Voraus erledigen',
      ],
    },
    {
      icon: Heart,
      title: 'Emotionale Vorbereitung',
      items: [
        'Partnerschaft bewusst stärken',
        'Realistische Erwartungen setzen',
        'Auszeiten einplanen',
        'Support-Netzwerk aufbauen',
        'Ängste offen ansprechen',
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
              Schwangerschaft & Geburt
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Die Zeit vor der Geburt – doppelt spannend
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-3xl shadow-lg">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Bei Zwillingen zweimal Freude, doppelte Vorbereitung. Die Schwangerschaft
                mit Zwillingen ist eine besondere Zeit voller Vorfreude und
                Herausforderungen. Eine gute Vorbereitung macht den Unterschied.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Hier teilen wir unsere wichtigsten Erkenntnisse und praktischen Tipps, die
                uns geholfen haben, uns auf die Ankunft unserer Zwillinge vorzubereiten.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {tips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#A8D5E2]/10 dark:bg-[#A8D5E2]/20 rounded-2xl mb-6">
                  <tip.icon className="w-7 h-7 text-[#A8D5E2]" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {tip.title}
                </h3>
                <ul className="space-y-3">
                  {tip.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <CheckCircle className="w-5 h-5 text-[#A8D5E2] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
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
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-[#A8D5E2]/10 to-white dark:from-gray-800 dark:to-gray-900 p-8 sm:p-12 rounded-3xl border border-[#A8D5E2]/30">
              <p className="text-xl text-gray-900 dark:text-white font-medium text-center italic leading-relaxed">
                "Nehmt euch viel Zeit für die Vorbereitung – es lohnt sich! Eine gute
                Planung nimmt viel Stress aus den ersten Wochen."
              </p>
              <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
                – Unsere Erfahrung
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
