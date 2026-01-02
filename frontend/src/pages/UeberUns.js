import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Users, Baby, Sparkles, ArrowRight, MapPin, Calendar } from 'lucide-react';
import axios from 'axios';
import { PageHero } from '../components/PageBackground';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function UeberUns() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API}/static-pages/ueber-uns`);
        setContent(res.data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const heroLabel = content?.hero_label || 'Über uns';
  const heroTitle = content?.hero_title || 'Eine Familie, zwei Herzen, doppeltes Glück';
  const heroDescription = content?.hero_description || 'Wir sind eine junge Familie vom Niederrhein und teilen hier unsere Erfahrungen als Zwillingseltern.';
  const sections = content?.sections || [];
  const ctaTitle = content?.cta_title || 'Möchtest du uns kennenlernen?';
  const ctaLink = content?.cta_link || '/kontakt';
  const ctaLinkText = content?.cta_link_text || 'Schreib uns';
  
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

      <section className="section-padding bg-background">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-semibold text-foreground mb-6">Unsere Geschichte</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {sections.length > 0 ? sections.map((section, i) => (
                  <div key={section.id || i}>
                    {section.title && <h3 className="font-semibold text-foreground mb-2">{section.title}</h3>}
                    <p>{section.description || section.subtitle}</p>
                    {section.image_url && <img src={section.image_url} alt={section.title} className="mt-4 rounded-xl" />}
                  </div>
                )) : (
                  <>
                    <p>Als wir erfuhren, dass wir Zwillinge erwarten, war das ein Moment voller Freude und auch ein bisschen Aufregung. Plötzlich war alles doppelt: doppelte Vorfreude, doppelte Planung, doppelte Liebe.</p>
                    <p>Heute, einige Zeit später, möchten wir unsere Erfahrungen teilen. Nicht als Experten, sondern als Eltern, die verstehen, wie es ist, wenn man zwei kleine Menschen gleichzeitig durch die Welt begleitet.</p>
                    <p>Auf dieser Seite findest du unsere Tipps, Geschichten und auch die kleinen Kunstwerke unserer Zwillinge – M & O.</p>
                  </>
                )}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/40 flex items-center justify-center">
                <div className="text-center">
                  <Baby className="w-16 h-16 text-foreground mx-auto mb-4" />
                  <p className="text-2xl font-bold text-foreground">M & O</p>
                  <p className="text-muted-foreground">Unsere Zwillinge</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-4 rounded-xl bg-card border border-border shadow-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">Niederrhein, DE</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-width">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">Warum diese Seite?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Ehrlich', desc: 'Wir teilen Höhen und Tiefen – ohne Filter.' },
              { icon: Users, title: 'Anonym', desc: 'Unsere Privatsphäre bleibt geschützt.' },
              { icon: Baby, title: 'Praktisch', desc: 'Tipps, die wirklich im Alltag helfen.' },
              { icon: Sparkles, title: 'Kreativ', desc: 'Auch die Kunst unserer Zwillinge.' },
            ].map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="p-6 rounded-xl bg-background border border-border text-center">
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-width text-center">
          <Heart className="w-12 h-12 text-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">{ctaTitle}</h2>
          <Link to={ctaLink} className="btn-primary">{ctaLinkText} <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </main>
  );
}
