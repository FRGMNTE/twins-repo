import { motion } from 'framer-motion';
import { Mail, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function Kontakt() {
  const [formData, setFormData] = useState({
    thema: '',
    email: '',
    nachricht: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main id="main-content" className="pt-20">
      <section className="py-20 sm:py-32 bg-gradient-to-br from-gray-50 via-white to-[#A8D5E2]/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <MessageCircle className="w-16 h-16 text-[#A8D5E2] mx-auto mb-6" />
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Frag uns!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Fragen zu Zwillingen-Alltag? Brauchst du ein offenes Ohr? Wir sind Eltern wie
              du – praxisnah und individuell.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-3xl shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="thema"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                >
                  Thema
                </label>
                <select
                  id="thema"
                  name="thema"
                  value={formData.thema}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D5E2] focus:border-transparent transition-all"
                  aria-label="Wähle ein Thema"
                >
                  <option value="">Bitte wählen...</option>
                  <option value="schlaf">Schlaf & Routinen</option>
                  <option value="fuettern">Füttern & Ernährung</option>
                  <option value="tipps">Allgemeine Tipps</option>
                  <option value="shop">Shop & Produkte</option>
                  <option value="sonstiges">Sonstiges</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                >
                  E-Mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D5E2] focus:border-transparent transition-all"
                  placeholder="deine@email.de"
                  aria-label="Deine E-Mail-Adresse"
                />
              </div>

              <div>
                <label
                  htmlFor="nachricht"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                >
                  Nachricht
                </label>
                <textarea
                  id="nachricht"
                  name="nachricht"
                  value={formData.nachricht}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D5E2] focus:border-transparent transition-all resize-none"
                  placeholder="Erzähl uns, wie wir dir helfen können..."
                  aria-label="Deine Nachricht an uns"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#A8D5E2] hover:bg-[#8BC5D4] text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
                aria-label="Nachricht absenden"
              >
                <Send className="w-5 h-5" />
                Nachricht senden
              </button>

              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center"
                >
                  <p className="text-green-800 dark:text-green-300 font-medium">
                    Vielen Dank! Wir melden uns bald bei dir.
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-[#A8D5E2]/10 dark:bg-[#A8D5E2]/20 rounded-2xl">
              <Mail className="w-6 h-6 text-[#A8D5E2]" />
              <p className="text-gray-700 dark:text-gray-300">
                Durchschnittliche Antwortzeit: 24-48 Stunden
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
