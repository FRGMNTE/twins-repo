import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Info, Shield, Settings, BarChart3, Megaphone, List, Trash2, Monitor, Mail } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Cookies() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API}/page-content/cookies`);
        setContent(res.data);
      } catch (error) {
        console.error('Error fetching cookies content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <main id="main-content" className="min-h-screen pt-20">
        <div className="container-width py-16 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  const c = content || {};

  const COOKIE_TYPES = [
    { 
      icon: Shield, 
      title: 'Technisch notwendig', 
      text: c.types_essential || 'Technisch notwendige Cookies sind für den Betrieb der Website erforderlich.',
      used: true
    },
    { 
      icon: Settings, 
      title: 'Funktional', 
      text: c.types_functional || 'Funktionale Cookies ermöglichen es der Website, sich an deine Einstellungen zu erinnern.',
      used: true
    },
    { 
      icon: BarChart3, 
      title: 'Analyse', 
      text: c.types_analytics || 'Wir verwenden derzeit KEINE Analyse-Cookies.',
      used: false
    },
    { 
      icon: Megaphone, 
      title: 'Marketing', 
      text: c.types_marketing || 'Wir verwenden KEINE Marketing- oder Werbe-Cookies.',
      used: false
    },
  ];

  return (
    <main id="main-content" className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wide">Rechtliches</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">
              Cookie-Richtlinie
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {c.intro_text || 'Diese Website verwendet Cookies, um dir die bestmögliche Nutzererfahrung zu bieten.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* What are Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Was sind Cookies?</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {c.what_are_cookies || 'Cookies sind kleine Textdateien, die auf deinem Gerät gespeichert werden, wenn du eine Website besuchst.'}
              </p>
            </motion.div>

            {/* Cookie Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <List className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Arten von Cookies</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {COOKIE_TYPES.map((type) => (
                  <div 
                    key={type.title} 
                    className={`p-4 rounded-xl border ${type.used ? 'border-green-500/30 bg-green-500/5' : 'border-border bg-secondary/30'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <type.icon className={`w-4 h-4 ${type.used ? 'text-green-500' : 'text-muted-foreground'}`} />
                      <h3 className="font-medium text-foreground text-sm">{type.title}</h3>
                      {type.used ? (
                        <span className="ml-auto text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full">Aktiv</span>
                      ) : (
                        <span className="ml-auto text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Nicht verwendet</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{type.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Our Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Unsere Cookies</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {c.our_cookies || 'Wir verwenden ausschließlich technisch notwendige und funktionale Cookies.'}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-foreground">Cookie</th>
                      <th className="text-left py-2 font-medium text-foreground">Zweck</th>
                      <th className="text-left py-2 font-medium text-foreground">Dauer</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-2 font-mono text-xs">cookie-consent</td>
                      <td className="py-2">Speichert deine Cookie-Einwilligung</td>
                      <td className="py-2">1 Jahr</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-xs">theme</td>
                      <td className="py-2">Speichert deine Theme-Einstellung (Hell/Dunkel)</td>
                      <td className="py-2">1 Jahr</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Manage Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Cookies verwalten</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {c.manage_cookies || 'Du kannst Cookies in deinem Browser jederzeit löschen oder blockieren.'}
              </p>
            </motion.div>

            {/* Browser Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Browser-Einstellungen</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {c.browser_settings || 'In den Einstellungen deines Browsers kannst du Cookies verwalten.'}
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-primary/30 bg-primary/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Fragen zu Cookies?</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Bei Fragen zu unserer Cookie-Richtlinie kannst du uns jederzeit kontaktieren:
              </p>
              <a 
                href={`mailto:${c.contact_email || 'gltz.de@gmail.com'}`}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="w-4 h-4" />
                {c.contact_email || 'gltz.de@gmail.com'}
              </a>
            </motion.div>

            {/* Last Updated */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center pt-4"
            >
              <p className="text-sm text-muted-foreground">
                Stand: {c.last_updated || 'Januar 2025'}
              </p>
            </motion.div>

          </div>
        </div>
      </section>
    </main>
  );
}
