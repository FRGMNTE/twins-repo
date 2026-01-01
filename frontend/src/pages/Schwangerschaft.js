import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Calendar, AlertCircle, CheckCircle, Baby, ArrowRight, Clock, Activity } from 'lucide-react';

const TRIMESTER_INFO = [
  {
    title: '1. Trimester (1-12 Woche)',
    subtitle: 'Der aufregende Anfang',
    points: [
      'Frühe Ultraschalle zur Bestätigung der Zwillinge',
      'Häufigere Arzttermine als bei Einlings-Schwangerschaften',
      'Stärkere Morgenübelkeit möglich',
      'Wichtig: Folsäure und ausreichend Ruhe'
    ]
  },
  {
    title: '2. Trimester (13-26 Woche)',
    subtitle: 'Die goldene Phase',
    points: [
      'Mehr Energie, weniger Übelkeit',
      'Erste Kindsbewegungen spürbar',
      'Regelmäßige Kontrollen des Gebärmutterhalses',
      'Bauch wächst schneller als bei Einlingen'
    ]
  },
  {
    title: '3. Trimester (27-40 Woche)',
    subtitle: 'Der Endspurt',
    points: [
      'Wöchentliche CTG-Kontrollen',
      'Vorbereitung auf mögliche Frühgeburt',
      'Krankenhaustasche früh packen',
      'Zwillinge kommen oft früher (ca. 37. Woche)'
    ]
  }
];

const TIPS = [
  { icon: Heart, title: 'Ruhe gönnen', desc: 'Dein Körper arbeitet doppelt – gönne dir extra Pausen.' },
  { icon: Activity, title: 'Bewegung', desc: 'Leichte Bewegung wie Schwimmen oder Yoga hilft.' },
  { icon: Clock, title: 'Termine', desc: 'Alle Arzttermine wahrnehmen – sie sind wichtig.' },
  { icon: AlertCircle, title: 'Warnsignale', desc: 'Bei Auffälligkeiten sofort den Arzt kontaktieren.' },
];

export default function Schwangerschaft() {
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
            <span className="text-sm font-medium text-primary uppercase tracking-wide">Schwangerschaft</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">
              Zwillings-Schwangerschaft
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Eine Zwillingsschwangerschaft ist besonders – in jeder Hinsicht. Hier teilen wir 
              unsere Erfahrungen und geben Tipps für jedes Trimester.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trimester Timeline */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">
            <Calendar className="inline-block w-8 h-8 mr-2 -mt-1" />
            Die drei Trimester
          </h2>

          <div className="space-y-8">
            {TRIMESTER_INFO.map((trimester, index) => (
              <motion.div
                key={trimester.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="sticky top-24">
                      <span className="text-5xl font-bold text-foreground/10">{index + 1}</span>
                      <h3 className="text-xl font-semibold text-foreground -mt-4">{trimester.title}</h3>
                      <p className="text-primary text-sm mt-1">{trimester.subtitle}</p>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <div className="p-6 rounded-2xl border border-border bg-card">
                      <ul className="space-y-3">
                        {trimester.points.map((point) => (
                          <li key={point} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="section-padding bg-secondary/30">
        <div className="container-width">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">Wichtige Tipps</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIPS.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-background border border-border text-center"
              >
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <tip.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container-width text-center">
          <Baby className="w-12 h-12 text-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">Bereit für den Baby-Alltag?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Erfahre, wie das Leben mit Zwillingen nach der Geburt aussieht.
          </p>
          <Link to="/baby-alltag" className="btn-primary">
            Zum Baby-Alltag <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
