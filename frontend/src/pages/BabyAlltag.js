import { motion } from 'framer-motion';
import { Heart, Moon, Utensils, Play, Calendar, Bath, Smile, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BabyAlltag() {
  const topics = [
    {
      icon: Moon,
      title: 'Schlaf-Routinen',
      description: 'Wie wir beide Babys gleichzeitig zum Schlafen bringen und durchschlafen fördern.',
      tips: ['Feste Schlafenszeiten', 'Abendrituale', 'Getrennte oder gemeinsame Betten'],
    },
    {
      icon: Utensils,
      title: 'Füttern',
      description: 'Tandem-Stillen, Flasche geben und die ersten Breimahlzeiten mit zwei Babys.',
      tips: ['Stillkissen nutzen', 'Zeitversetzt füttern', 'Partner einbeziehen'],
    },
    {
      icon: Play,
      title: 'Spielideen',
      description: 'Altersgerechte Aktivitäten, die beide Zwillinge beschäftigen und fördern.',
      tips: ['Bodenspielzeit', 'Sensorische Erfahrungen', 'Vorlesen'],
    },
    {
      icon: Calendar,
      title: 'Tagesstruktur',
      description: 'Ein fester Rhythmus hilft der ganzen Familie – so gestalten wir unseren Tag.',
      tips: ['Morgenroutine', 'Mittagsschlaf', 'Abendritual'],
    },
    {
      icon: Bath,
      title: 'Pflege & Baden',
      description: 'Praktische Tipps für Wickeln, Baden und Anziehen von zwei Babys.',
      tips: ['Wickelstation organisieren', 'Zusammen baden', 'Kleidung vorbereiten'],
    },
    {
      icon: Smile,
      title: 'Selbstfürsorge',
      description: 'Warum Pausen wichtig sind und wie wir Zeit für uns finden.',
      tips: ['Hilfe annehmen', 'Kurze Auszeiten', 'Partner-Zeit'],
    },
  ];

  return (
    <main id="main-content" className="pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-sky-50 dark:from-slate-900 to-background relative overflow-hidden" data-testid="baby-alltag-page">
        <div className="absolute top-10 left-10 opacity-10">
          <Waves className="w-64 h-64 text-primary" />
        </div>
        <div className="container-width relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Heart className="w-16 h-16 text-[hsl(var(--twins-art))] mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
              Baby-Alltag
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Der Alltag mit Zwillingen ist eine Herausforderung – aber auch voller wunderbarer Momente. 
              Hier teilen wir, was bei uns funktioniert.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-card p-8 rounded-3xl"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-6">
                  <topic.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {topic.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {topic.description}
                </p>
                <ul className="space-y-2">
                  {topic.tips.map((tip) => (
                    <li key={tip} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="section-padding bg-card">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1744424705160-c2a32b5dc4e3?w=1200"
                alt="Glückliche Babys auf einer Decke liegend"
                className="w-full h-64 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Jeder Tag ist ein Abenteuer
                  </h3>
                  <p className="text-white/80">
                    Mit Zwillingen erlebt man alles doppelt – auch die Freude.
                  </p>
                </div>
              </div>
            </div>
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
              Brauchst du individuelle Tipps?
            </h2>
            <Link to="/kontakt" className="btn-primary">
              Schreib uns
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
