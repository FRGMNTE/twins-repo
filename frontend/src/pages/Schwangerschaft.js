import { motion } from 'framer-motion';
import { Baby, Heart, Star, Clock, Package, CheckCircle, Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Schwangerschaft() {
  const sections = [
    {
      icon: Package,
      title: 'Kliniktasche',
      items: [
        'Doppelte Babykleidung (Größe 50-56)',
        'Bequeme Stillkleidung',
        'Snacks & Getränke',
        'Ladekabel & Kopfhörer',
        'Wichtige Dokumente',
      ],
    },
    {
      icon: Heart,
      title: 'Emotionale Vorbereitung',
      items: [
        'Realistische Erwartungen setzen',
        'Partner einbeziehen',
        'Hilfe annehmen lernen',
        'Austausch mit anderen Zwillingseltern',
        'Selbstfürsorge nicht vergessen',
      ],
    },
    {
      icon: Clock,
      title: 'Zeitplanung',
      items: [
        'Arzttermine frühzeitig planen',
        'Babyzimmer rechtzeitig einrichten',
        'Elternzeit beantragen',
        'Haushaltshilfe organisieren',
        'Mutterschutz einplanen',
      ],
    },
  ];

  return (
    <main id="main-content" className="pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-emerald-50 dark:from-slate-900 to-background relative overflow-hidden" data-testid="schwangerschaft-page">
        <div className="absolute top-10 right-10 opacity-10">
          <Mountain className="w-64 h-64 text-primary" />
        </div>
        <div className="container-width relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Baby className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
              Schwangerschaft & Geburt
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Die Schwangerschaft mit Zwillingen ist besonders – und besonders aufregend. 
              Hier teilen wir unsere Erfahrungen und praktische Tipps für die Vorbereitung.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-8 rounded-3xl"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-6">
                  <section.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="section-padding bg-card">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Star className="w-12 h-12 text-[hsl(var(--warning))] mx-auto mb-6" />
            <blockquote className="text-2xl sm:text-3xl font-semibold text-foreground mb-6 italic">
              "Zwei Herzen, die gleichzeitig schlagen – das ist das größte Geschenk."
            </blockquote>
            <p className="text-muted-foreground">
              – Unsere Erfahrung als Zwillingseltern
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container-width text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Hast du Fragen zur Zwillingsschwangerschaft?
            </h2>
            <Link to="/kontakt" className="btn-primary">
              Kontaktiere uns
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
