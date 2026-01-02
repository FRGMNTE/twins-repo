import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Gift, Coffee, Star, CheckCircle } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import axios from 'axios';
import { PageHero } from '../components/PageBackground';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Spende() {
  const { settings } = useSiteSettings();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API}/static-pages/spende`);
        setContent(res.data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const heroLabel = content?.hero_label || 'Unterstützen';
  const heroTitle = content?.hero_title || 'Unser Projekt unterstützen';
  const heroDescription = content?.hero_description || 'Diese Seite ist ein Herzensprojekt. Wenn dir unsere Tipps und Inhalte helfen, freuen wir uns über eine kleine Unterstützung.';
  const sections = content?.sections || [];
  const ctaTitle = content?.cta_title || 'Einmalige Unterstützung';
  const ctaDescription = content?.cta_description || 'Mit PayPal kannst du uns ganz einfach unterstützen – jeder Betrag hilft uns, diese Seite weiterzuführen.';
  const ctaLink = content?.cta_link || settings.paypalLink || 'https://paypal.me/gltzfamily';
  const ctaLinkText = content?.cta_link_text || 'Via PayPal unterstützen';

  const supportBenefits = sections.length > 0 ? sections : [
    { id: '1', title: 'Kaffee & Zeit', description: 'Mehr Zeit für neue Inhalte und Tipps', icon: 'Coffee' },
    { id: '2', title: 'Qualität', description: 'Bessere Fotos und Gestaltung', icon: 'Star' },
    { id: '3', title: 'Motivation', description: 'Weitermachen, weil es euch hilft', icon: 'Heart' },
  ];

  const ICONS = { Coffee, Star, Heart, Gift, CheckCircle };
  
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-foreground" />
            </div>
            <span className="text-sm font-medium text-primary uppercase tracking-wide">{heroLabel}</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">{heroTitle}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{heroDescription}</p>
          </motion.div>
        </div>
      </section>

      {/* How to Support */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground text-center mb-8">So kannst du uns unterstützen</h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-border bg-card text-center"
            >
              <Gift className="w-12 h-12 text-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-4">{ctaTitle}</h3>
              <p className="text-muted-foreground mb-6">{ctaDescription}</p>
              
              <a
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                <Heart className="w-4 h-4 mr-2" />
                {ctaLinkText}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Your Support Does */}
      <section className="section-padding bg-secondary/30">
        <div className="container-width">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Was deine Unterstützung bewirkt</h2>
          
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {supportBenefits.map((item, index) => {
              const IconComponent = ICONS[item.icon] || Heart;
              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-background border border-border text-center"
                >
                  <IconComponent className="w-8 h-8 text-foreground mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description || item.subtitle}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Legal Notice */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto p-6 rounded-xl bg-secondary/50 border border-border"
          >
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Wichtiger Hinweis
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {settings.donationDisclaimer || 'Dies ist keine Spende im steuerlichen Sinne. Es erfolgt keine Gegenleistung. Die Unterstützung ist zu 100% freiwillig und dient ausschließlich der Förderung unseres privaten Familienprojekts.'}
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
