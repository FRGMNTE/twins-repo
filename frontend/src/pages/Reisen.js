import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plane, MapPin, Car, Luggage, Baby, CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { PageHero } from '../components/PageBackground';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DEFAULT_TRAVEL_TIPS = [
  { id: '1', icon: 'Luggage', title: 'Packliste für Zwillinge', items: ['Doppelte Windeln & Feuchttücher', 'Wechselkleidung', 'Lieblingsspielzeug', 'Snacks & Getränke'] },
  { id: '2', icon: 'Car', title: 'Autofahrten', items: ['Regelmäßige Pausen', 'Kindersitze korrekt installieren', 'Sonnenschutz', 'Unterhaltung'] },
  { id: '3', icon: 'Plane', title: 'Flugreisen', items: ['Frühzeitig am Flughafen', 'Buggy bis zum Gate', 'Druckausgleich', 'Reservesachen'] },
];

const DEFAULT_DESTINATIONS = [
  { name: 'Nordsee', desc: 'Familienfreundliche Strände', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
  { name: 'Bayern', desc: 'Berge & Bauernhöfe', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400' },
  { name: 'Holland', desc: 'Kurze Anreise, viel Spaß', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
];

const ICONS = { Luggage, Car, Plane, MapPin, Baby };

export default function Reisen() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API}/static-pages/reisen`);
        setContent(res.data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const heroLabel = content?.hero_label || 'Reisen';
  const heroTitle = content?.hero_title || 'Unterwegs mit Zwillingen';
  const heroDescription = content?.hero_description || 'Reisen mit zwei kleinen Kindern ist ein Abenteuer! Hier teilen wir unsere besten Tipps.';
  const travelTips = content?.sections?.length > 0 ? content.sections : DEFAULT_TRAVEL_TIPS;
  const ctaTitle = content?.cta_title || 'Wohin geht eure Reise?';
  const ctaLink = content?.cta_link || '/kontakt';
  const ctaLinkText = content?.cta_link_text || 'Eure Tipps teilen';
  
  // Background settings
  const bgEnabled = content?.background_enabled !== false;
  const bgType = content?.background_type || 'default';
  const bgUrl = content?.background_url || '';

  if (loading) {
    return (
      <main id="main-content" className="min-h-screen pt-20">
        <div className="container-width py-16 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen">
      <PageHero
        label={heroLabel}
        title={heroTitle}
        description={heroDescription}
        backgroundType={bgEnabled ? bgType : 'none'}
        backgroundUrl={bgUrl}
        overlay={0.5}
      />
      <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-width">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-sm font-medium text-primary uppercase tracking-wide">{heroLabel}</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">{heroTitle}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{heroDescription}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-width">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">Unsere Reisetipps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {travelTips.map((tip, index) => {
              const IconComponent = ICONS[tip.icon] || Plane;
              const items = tip.items || [];
              return (
                <motion.div key={tip.id || index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="p-6 rounded-2xl border border-border bg-card">
                  <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{tip.title}</h3>
                  {tip.description && <p className="text-muted-foreground mb-4">{tip.description}</p>}
                  {items.length > 0 && (
                    <ul className="space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          {typeof item === 'string' ? item : item.title || item.text}
                        </li>
                      ))}
                    </ul>
                  )}
                  {tip.link_url && <Link to={tip.link_url} className="inline-flex items-center gap-1 text-primary hover:underline mt-4 text-sm">{tip.link_text || 'Mehr'} <ArrowRight className="w-3 h-3" /></Link>}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-width">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">Beliebte Reiseziele</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {DEFAULT_DESTINATIONS.map((dest, index) => (
              <motion.div key={dest.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-white/80" />
                    <span className="text-white font-semibold">{dest.name}</span>
                  </div>
                  <p className="text-white/70 text-sm">{dest.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-width text-center">
          <Plane className="w-12 h-12 text-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">{ctaTitle}</h2>
          <Link to={ctaLink} className="btn-primary">{ctaLinkText} <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </main>
  );
}
