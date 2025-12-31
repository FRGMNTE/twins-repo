import { motion } from 'framer-motion';
import { ArrowDown, Baby, Heart, Lightbulb, ShoppingBag, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const handleScrollToContent = () => {
    document.getElementById('teaser-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const teasers = [
    {
      icon: Baby,
      title: 'Schwangerschaft & Geburt',
      description:
        'Kliniktaschen, Haus-Organisation, emotionale Vorbereitung für Zwillinge',
      link: '/schwangerschaft',
    },
    {
      icon: Heart,
      title: 'Baby-Alltag',
      description: 'Schlaf-Routinen, Füttern, Spielideen – was bei uns funktioniert',
      link: '/baby-alltag',
    },
    {
      icon: Lightbulb,
      title: 'Tipps & Hacks',
      description:
        '10 praktische Lösungen für Zwillingseltern – Mental Load bis Haushalt',
      link: '/tipps',
    },
  ];

  return (
    <main id="main-content">
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-[#A8D5E2]/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2000')] bg-cover bg-center opacity-5 dark:opacity-10"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            gltz.de – Unsere Reise mit Zwillingen
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Anonyme Tipps für junge Familien vom Niederrhein. Von Schwangerschaft bis
            Kleinkindalltag – praxisnah & ehrlich
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={handleScrollToContent}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#A8D5E2] hover:bg-[#8BC5D4] text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105"
            aria-label="Zu den Tipps scrollen"
          >
            Tipps entdecken
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </motion.button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown className="w-6 h-6 text-gray-400 dark:text-gray-600" />
          </motion.div>
        </div>
      </section>

      <section id="teaser-section" className="py-20 sm:py-32 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Was dich erwartet
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Praxisnahe Tipps aus unserem Zwillingsalltag
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teasers.map((teaser, index) => (
              <motion.div
                key={teaser.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link to={teaser.link} className="block">
                  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 hover:border-[#A8D5E2] dark:hover:border-[#A8D5E2] transition-all duration-300 h-full">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#A8D5E2]/10 dark:bg-[#A8D5E2]/20 rounded-2xl mb-6 group-hover:bg-[#A8D5E2]/20 dark:group-hover:bg-[#A8D5E2]/30 transition-colors">
                      <teaser.icon className="w-8 h-8 text-[#A8D5E2]" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                      {teaser.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {teaser.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-gradient-to-br from-[#A8D5E2]/5 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <ShoppingBag className="w-16 h-16 text-[#A8D5E2] mx-auto mb-6" />
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Twins-Art-Shop
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Limitierte Kunstwerke unserer Zwillinge unterstützen Familienprojekte. Alle
              Einnahmen bleiben in der Familie.
            </p>

            <div className="relative w-full max-w-2xl mx-auto mb-8 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=2000"
                alt="Kunstwerke von Kindern - bunte Handabdrücke und kreative Motive"
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://paypal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#A8D5E2] hover:bg-[#8BC5D4] text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105"
                aria-label="Mit PayPal spenden"
              >
                <Heart className="w-5 h-5" />
                Spenden (PayPal)
              </a>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-full border-2 border-[#A8D5E2] transition-all duration-300 transform hover:scale-105"
                aria-label="Kunstdrucke im Shop bestellen"
              >
                <CreditCard className="w-5 h-5" />
                Prints bestellen
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
