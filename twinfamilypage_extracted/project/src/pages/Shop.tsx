import { motion } from 'framer-motion';
import { Heart, ShoppingBag, CreditCard, Palette } from 'lucide-react';

export default function Shop() {
  const artworks = [
    {
      title: 'Bunte Handabdrücke',
      description: 'Limitierte Edition - Kreative Zwillings-Handabdrücke',
      image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800',
      price: '29,99 €',
    },
    {
      title: 'Abstrakte Farbwelten',
      description: 'Originale Kunstwerke unserer Zwillinge',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800',
      price: '34,99 €',
    },
    {
      title: 'Familienmotive',
      description: 'Gemeinsam geschaffene Meisterwerke',
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=800',
      price: '39,99 €',
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
            <Palette className="w-16 h-16 text-[#A8D5E2] mx-auto mb-6" />
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Twins-Art-Shop
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Limitierte Kunstwerke unserer Zwillinge unterstützen Familienprojekte. Alle
              Einnahmen bleiben in der Familie und fördern die kreative Entwicklung unserer
              Kinder.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {artworks.map((artwork, index) => (
              <motion.div
                key={artwork.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={artwork.image}
                    alt={`${artwork.title} - Kunstwerk von Kindern mit kreativen Motiven`}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {artwork.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {artwork.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#A8D5E2]">
                      {artwork.price}
                    </span>
                    <button
                      className="px-4 py-2 bg-[#A8D5E2] hover:bg-[#8BC5D4] text-white font-medium rounded-full transition-colors"
                      aria-label={`${artwork.title} kaufen`}
                    >
                      Kaufen
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-3xl shadow-lg text-center">
              <ShoppingBag className="w-16 h-16 text-[#A8D5E2] mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Unterstütze unsere Familie
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Mit jedem Kauf oder jeder Spende unterstützt ihr direkt unsere Familie und
                ermöglicht es uns, mehr Zeit mit unseren Zwillingen zu verbringen und ihre
                kreative Entwicklung zu fördern.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://paypal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#A8D5E2] hover:bg-[#8BC5D4] text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 w-full sm:w-auto justify-center"
                  aria-label="Mit PayPal spenden"
                >
                  <Heart className="w-5 h-5" />
                  Spenden via PayPal
                </a>
                <button
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-full border-2 border-[#A8D5E2] transition-all duration-300 transform hover:scale-105 w-full sm:w-auto justify-center"
                  aria-label="Print bestellen mit Stripe"
                >
                  <CreditCard className="w-5 h-5" />
                  Print bestellen (Stripe)
                </button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                Alle Transaktionen sind sicher und werden über etablierte
                Zahlungsdienstleister abgewickelt.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
