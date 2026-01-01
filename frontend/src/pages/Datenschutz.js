import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Users, Mail, Cookie, Server, CreditCard, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Datenschutz() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API}/page-content/datenschutz`);
        setContent(res.data);
      } catch (error) {
        console.error('Error fetching datenschutz content:', error);
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

  const RIGHTS_LIST = [
    { title: 'Auskunft', desc: 'Du kannst Auskunft über deine gespeicherten Daten verlangen.' },
    { title: 'Berichtigung', desc: 'Du kannst die Berichtigung unrichtiger Daten verlangen.' },
    { title: 'Löschung', desc: 'Du kannst die Löschung deiner Daten verlangen ("Recht auf Vergessenwerden").' },
    { title: 'Einschränkung', desc: 'Du kannst die Einschränkung der Verarbeitung verlangen.' },
    { title: 'Datenübertragbarkeit', desc: 'Du kannst deine Daten in einem gängigen Format erhalten.' },
    { title: 'Widerspruch', desc: 'Du kannst der Verarbeitung deiner Daten widersprechen.' },
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
            <span className="text-sm font-medium text-primary uppercase tracking-wide">Datenschutz</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">
              Datenschutzerklärung
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Informationen zum Datenschutz gemäß DSGVO – Deine Privatsphäre ist uns wichtig.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">1. Datenschutz auf einen Blick</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {c.intro_text || 'Der Schutz deiner persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung informiert dich darüber, welche Daten wir erheben und wie wir sie verwenden.'}
              </p>
              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-sm font-medium text-foreground mb-1">Verantwortlicher:</p>
                <p className="text-sm text-muted-foreground">
                  {c.responsible_name || 'John D. Gold'}<br />
                  {c.responsible_address || 'Schützenstraße 38, 47829 Krefeld'}<br />
                  E-Mail: {c.responsible_email || 'gltz.de@gmail.com'}
                </p>
              </div>
            </motion.div>

            {/* Data Collection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">2. Datenerfassung auf dieser Website</h2>
              </div>
              
              <h3 className="text-lg font-medium text-foreground mb-2">Kontaktformular</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {c.contact_form_text || 'Wenn du uns über das Kontaktformular kontaktierst, werden folgende Daten erhoben:'}
              </p>
              <ul className="space-y-2 mb-4">
                {['Name (optional)', 'E-Mail-Adresse (erforderlich)', 'Ausgewähltes Thema', 'Nachrichteninhalt', 'Zeitstempel der Anfrage'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">
                {c.contact_form_purpose || 'Zweck: Bearbeitung deiner Anfrage. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Speicherdauer: Bis zur Erledigung, maximal 2 Jahre.'}
              </p>
            </motion.div>

            {/* Cookies */}
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
                <h2 className="text-xl font-semibold text-foreground">3. Cookies</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {c.cookies_text || 'Wir verwenden nur technisch notwendige Cookies für den Betrieb dieser Website (z.B. für Dark/Light Mode Einstellungen und Cookie-Einwilligung). Es werden keine Tracking- oder Werbe-Cookies eingesetzt.'}
              </p>
            </motion.div>

            {/* Hosting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">4. Hosting und Server</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {c.hosting_text || 'Diese Website wird bei einem externen Dienstleister gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Die Verarbeitung erfolgt auf Grundlage unserer berechtigten Interessen an einer effizienten und sicheren Bereitstellung unserer Website (Art. 6 Abs. 1 lit. f DSGVO).'}
              </p>
            </motion.div>

            {/* Your Rights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">5. Deine Rechte</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {c.rights_text || 'Du hast jederzeit folgende Rechte bezüglich deiner personenbezogenen Daten:'}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {RIGHTS_LIST.map((right) => (
                  <div key={right.title} className="p-3 bg-secondary/50 rounded-xl">
                    <p className="font-medium text-foreground text-sm">{right.title}</p>
                    <p className="text-xs text-muted-foreground">{right.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact for Privacy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">6. Kontakt bei Datenschutzfragen</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Bei Fragen zum Datenschutz oder zur Ausübung deiner Rechte kannst du dich jederzeit an uns wenden:
              </p>
              <a 
                href={`mailto:${c.responsible_email || 'gltz.de@gmail.com'}`}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="w-4 h-4" />
                {c.responsible_email || 'gltz.de@gmail.com'}
              </a>
              <p className="text-sm text-muted-foreground mt-3">
                Du hast außerdem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde über unsere Verarbeitung personenbezogener Daten zu beschweren.
              </p>
            </motion.div>

            {/* PayPal Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-primary/30 bg-primary/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Hinweis zu PayPal-Unterstützungen</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {c.paypal_text || 'Wenn du unser Projekt über PayPal unterstützt, erfolgt die Datenverarbeitung durch PayPal (Europe) S.à.r.l. et Cie, S.C.A. gemäß deren Datenschutzbestimmungen. Wir erhalten von PayPal lediglich eine Bestätigung der Transaktion.'}
              </p>
            </motion.div>

            {/* Last Updated */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center pt-4"
            >
              <p className="text-sm text-muted-foreground">
                Stand: {c.last_updated || 'Dezember 2025'}
              </p>
            </motion.div>

          </div>
        </div>
      </section>
    </main>
  );
}
