import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Moon, Utensils, Baby, Heart, Repeat, ArrowRight, Lightbulb } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DEFAULT_DAILY_ROUTINE = [
  { time: '06:00', activity: 'Aufwachen & erste Flasche/Stillen', icon: 'Moon' },
  { time: '08:00', activity: 'Frühstück & Spielzeit', icon: 'Utensils' },
  { time: '10:00', activity: 'Vormittags-Schläfchen', icon: 'Moon' },
  { time: '12:00', activity: 'Mittagessen & Wickeln', icon: 'Utensils' },
  { time: '14:00', activity: 'Nachmittags-Schläfchen', icon: 'Moon' },
  { time: '16:00', activity: 'Spielzeit & Spaziergang', icon: 'Baby' },
  { time: '18:00', activity: 'Abendessen & Baden', icon: 'Utensils' },
  { time: '19:30', activity: 'Gute-Nacht-Routine', icon: 'Moon' },
];

const SURVIVAL_TIPS = [
  { icon: Repeat, title: 'Synchronisieren', desc: 'Versuche, beide Babys gleichzeitig zu füttern und schlafen zu legen. Das spart Zeit und Energie.' },
  { icon: Clock, title: 'Routine etablieren', desc: 'Eine feste Tagesstruktur hilft allen – den Babys und den Eltern.' },
  { icon: Heart, title: 'Hilfe annehmen', desc: 'Scheue dich nicht, Hilfe von Familie und Freunden anzunehmen.' },
  { icon: Lightbulb, title: 'Praktisch denken', desc: 'Doppelte Ausstattung an strategischen Orten – Wickelstation oben und unten.' },
];

const ICONS = { Moon, Utensils, Baby, Clock, Heart, Repeat, Lightbulb };

export default function BabyAlltag() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API}/static-pages/baby-alltag`);
        setContent(res.data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Use content from DB or fallback to defaults
  const heroLabel = content?.hero_label || 'Baby-Alltag';
  const heroTitle = content?.hero_title || 'Leben mit Zwillingen';
  const heroDescription = content?.hero_description || 'Der Alltag mit zwei Babys ist intensiv, aber auch wunderschön. Hier zeigen wir, wie wir unseren Tag strukturieren und welche Tipps uns helfen.';
  const sections = content?.sections?.length > 0 ? content.sections : DEFAULT_DAILY_ROUTINE;
  const ctaTitle = content?.cta_title || 'Mehr praktische Tipps';
  const ctaDescription = content?.cta_description || 'Entdecke weitere hilfreiche Ratschläge für den Zwillingsalltag.';
  const ctaLink = content?.cta_link || '/tipps';
  const ctaLinkText = content?.cta_link_text || 'Zu den Tipps';

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
    <main id="main-content" className="min-h-screen pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wide">{heroLabel}</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">
              {heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Daily Routine */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-4">
            <Clock className="inline-block w-8 h-8 mr-2 -mt-1" />
            Unser Tagesablauf
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Ein typischer Tag mit unseren Zwillingen – natürlich ist jeder Tag anders, 
            aber diese Routine gibt uns Struktur.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
              
              {sections.map((item, index) => {
                const IconComponent = ICONS[item.icon] || Clock;
                const time = item.time || item.title?.split(' ')[0] || '';
                const activity = item.activity || item.description || item.title || '';
                
                return (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex items-center gap-6 py-4"
                  >
                    {/* Time Dot */}
                    <div className="w-16 shrink-0 text-right">
                      <span className="text-sm font-semibold text-foreground">{time}</span>
                    </div>
                    
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-full bg-background border-2 border-foreground/20 flex items-center justify-center z-10">
                      <IconComponent className="w-4 h-4 text-foreground" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-4 rounded-xl bg-secondary/30 border border-border">
                      <p className="text-foreground">{activity}</p>
                      {item.subtitle && <p className="text-sm text-muted-foreground mt-1">{item.subtitle}</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Survival Tips */}
      <section className="section-padding bg-secondary/30">
        <div className="container-width">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">Überlebenstipps</h2>
          
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {SURVIVAL_TIPS.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-background border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center shrink-0">
                    <tip.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container-width text-center">
          <Lightbulb className="w-12 h-12 text-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">{ctaTitle}</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {ctaDescription}
          </p>
          <Link to={ctaLink} className="btn-primary">
            {ctaLinkText} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
