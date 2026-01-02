import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lightbulb, Baby, Moon, ShoppingBag, Heart, Users, Car, Home, ChevronDown, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { PageHero } from '../components/PageBackground';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DEFAULT_TIP_CATEGORIES = [
  {
    id: 'schlafen',
    title: 'Schlafen',
    icon: 'Moon',
    tips: [
      { title: 'Gleicher Schlafrhythmus', content: 'Wecke das zweite Baby, wenn das erste wach wird – so synchronisieren sich die Schlafzeiten.' },
      { title: 'Getrennte Betten?', content: 'Am Anfang können Zwillinge zusammen schlafen – sie beruhigen sich gegenseitig.' },
    ]
  },
  {
    id: 'fuettern',
    title: 'Füttern',
    icon: 'Baby',
    tips: [
      { title: 'Tandem-Stillen', content: 'Mit einem Zwillingsstillkissen können beide Babys gleichzeitig gestillt werden.' },
    ]
  },
];

const ICONS = { Moon, Baby, ShoppingBag, Home, Car, Lightbulb, Heart, Users };

export default function Tipps() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API}/static-pages/tipps`);
        setContent(res.data);
        if (res.data?.sections?.length > 0) {
          setOpenCategory(res.data.sections[0].id);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        setOpenCategory('schlafen');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const heroLabel = content?.hero_label || 'Tipps & Tricks';
  const heroTitle = content?.hero_title || 'Praktische Ratschläge';
  const heroDescription = content?.hero_description || 'Gesammelte Weisheiten aus unserem Alltag mit Zwillingen – von Eltern für Eltern.';
  const categories = content?.sections?.length > 0 ? content.sections : DEFAULT_TIP_CATEGORIES;
  const ctaTitle = content?.cta_title || 'Hast du auch Tipps?';
  const ctaDescription = content?.cta_description || 'Wir freuen uns über Erfahrungen von anderen Zwillingseltern.';
  const ctaLink = content?.cta_link || '/kontakt';
  const ctaLinkText = content?.cta_link_text || 'Kontakt aufnehmen';
  
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
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-width">
          <div className="max-w-3xl mx-auto">
            {categories.map((category, index) => {
              const IconComponent = ICONS[category.icon] || Lightbulb;
              const tips = category.tips || category.items || [];
              return (
                <motion.div key={category.id || index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="mb-4">
                  <button onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)} className={`w-full flex items-center justify-between p-5 rounded-xl border transition-colors ${openCategory === category.id ? 'bg-foreground text-background border-foreground' : 'bg-card border-border hover:bg-secondary/50'}`}>
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5" />
                      <span className="font-semibold">{category.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${openCategory === category.id ? 'bg-background/20' : 'bg-secondary'}`}>{tips.length} Tipps</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${openCategory === category.id ? 'rotate-180' : ''}`} />
                  </button>
                  {openCategory === category.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border border-t-0 border-border rounded-b-xl overflow-hidden">
                      <div className="p-4 space-y-4">
                        {tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="p-4 rounded-lg bg-secondary/30">
                            <h4 className="font-semibold text-foreground mb-1">{tip.title}</h4>
                            <p className="text-sm text-muted-foreground">{tip.content || tip.description}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-width">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto text-center">
            <Users className="w-12 h-12 text-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-4">{ctaTitle}</h2>
            <p className="text-muted-foreground mb-8">{ctaDescription}</p>
            <Link to={ctaLink} className="btn-primary">{ctaLinkText} <ArrowRight className="w-4 h-4" /></Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
