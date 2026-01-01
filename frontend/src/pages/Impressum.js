import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Mail, Phone, MapPin, User, Scale, Link2, Copyright, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SECTION_ICONS = {
  provider: MapPin,
  responsible: User,
  liability: AlertCircle,
  links: Link2,
  copyright: Copyright,
  dispute: Scale,
};

export default function Impressum() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API}/page-content/impressum`);
        setContent(res.data);
      } catch (error) {
        console.error('Error fetching impressum content:', error);
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
              Impressum
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Angaben gemäß § 5 TMG – Hier findest du alle rechtlich erforderlichen Informationen über uns.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Provider Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Angaben zum Anbieter</h2>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <p className="font-medium text-foreground">{c.provider_name || 'John D. Gold'}</p>
                <p>{c.provider_street || 'Schützenstraße 38'}</p>
                <p>{c.provider_city || '47829 Krefeld'}</p>
                <p>{c.provider_country || 'Deutschland'}</p>
                
                <div className="flex items-center gap-2 pt-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href={`tel:${(c.provider_phone || '01575 731 2560').replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                    {c.provider_phone || '01575 731 2560'}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href={`mailto:${c.provider_email || 'gltz.de@gmail.com'}`} className="hover:text-primary transition-colors">
                    {c.provider_email || 'gltz.de@gmail.com'}
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Responsible Person */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Verantwortlich für den Inhalt</h2>
              </div>
              <p className="text-muted-foreground">{c.responsible_name || 'John D. Gold'}</p>
              <p className="text-muted-foreground">{c.responsible_address || 'Schützenstraße 38, 47829 Krefeld'}</p>
            </motion.div>

            {/* Liability for Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Haftung für Inhalte</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {c.liability_content || 'Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.'}
              </p>
            </motion.div>

            {/* Liability for Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Haftung für Links</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {c.liability_links || 'Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.'}
              </p>
            </motion.div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Copyright className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Urheberrecht</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {c.copyright_text || 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.'}
              </p>
            </motion.div>

            {/* Dispute Resolution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Streitschlichtung</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                <a 
                  href="https://ec.europa.eu/consumers/odr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {c.dispute_text || 'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'}
              </p>
            </motion.div>

          </div>
        </div>
      </section>
    </main>
  );
}
