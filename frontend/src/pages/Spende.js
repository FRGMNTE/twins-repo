import { motion } from 'framer-motion';
import { Heart, Gift, Coffee, Star, CheckCircle } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Spende() {
  const { settings } = useSiteSettings();

  return (
    <main id="main-content" className="min-h-screen pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-foreground" />
            </div>
            <span className="text-sm font-medium text-primary uppercase tracking-wide">Unterstützen</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">
              Unser Projekt unterstützen
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Diese Seite ist ein Herzensprojekt. Wenn dir unsere Tipps und Inhalte helfen, 
              freuen wir uns über eine kleine Unterstützung.
            </p>
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
              <h3 className="text-xl font-semibold text-foreground mb-4">Einmalige Unterstützung</h3>
              <p className="text-muted-foreground mb-6">
                Mit PayPal kannst du uns ganz einfach unterstützen – jeder Betrag hilft uns, 
                diese Seite weiterzuführen und zu verbessern.
              </p>
              
              <a
                href={settings.paypalLink || 'https://paypal.me/gltzfamily'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                <Heart className="w-4 h-4 mr-2" />
                Via PayPal unterstützen
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
            {[
              { icon: Coffee, title: 'Kaffee & Zeit', desc: 'Mehr Zeit für neue Inhalte und Tipps' },
              { icon: Star, title: 'Qualität', desc: 'Bessere Fotos und Gestaltung' },
              { icon: Heart, title: 'Motivation', desc: 'Weitermachen, weil es euch hilft' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-background border border-border text-center"
              >
                <item.icon className="w-8 h-8 text-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
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
