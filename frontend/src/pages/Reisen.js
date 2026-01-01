import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plane, MapPin, Car, Luggage, Baby, CheckCircle, ArrowRight } from 'lucide-react';

const TRAVEL_TIPS = [
  {
    icon: Luggage,
    title: 'Packliste für Zwillinge',
    items: ['Doppelte Windeln & Feuchttücher', 'Wechselkleidung (mind. 2x pro Kind)', 'Lieblingsspielzeug & Schnuller', 'Snacks & Getränke', 'Erste-Hilfe-Set']
  },
  {
    icon: Car,
    title: 'Autofahrten',
    items: ['Regelmäßige Pausen einplanen', 'Kindersitze korrekt installieren', 'Sonnenschutz für Fenster', 'Unterhaltung für unterwegs', 'Snacks griffbereit halten']
  },
  {
    icon: Plane,
    title: 'Flugreisen',
    items: ['Frühzeitig am Flughafen sein', 'Buggy bis zum Gate mitnehmen', 'Druckausgleich bei Start/Landung', 'Reservesachen ins Handgepäck', 'Nachtflüge bevorzugen']
  },
];

const DESTINATIONS = [
  { name: 'Nordsee', desc: 'Familienfreundliche Strände', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
  { name: 'Bayern', desc: 'Berge & Bauernhöfe', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400' },
  { name: 'Holland', desc: 'Kurze Anreise, viel Spaß', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
];

export default function Reisen() {
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
            <span className="text-sm font-medium text-primary uppercase tracking-wide">Reisen</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">
              Unterwegs mit Zwillingen
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Reisen mit zwei kleinen Kindern ist ein Abenteuer! Hier teilen wir unsere besten 
              Tipps für entspannte Familienausflüge und Urlaube.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Travel Tips */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">Unsere Reisetipps</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {TRAVEL_TIPS.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card"
              >
                <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mb-4">
                  <tip.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{tip.title}</h3>
                <ul className="space-y-2">
                  {tip.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="section-padding bg-secondary/30">
        <div className="container-width">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-4">Beliebte Ziele für Familien</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Diese Reiseziele haben wir selbst getestet und können sie für Familien mit Zwillingen empfehlen.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {DESTINATIONS.map((dest, index) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
              >
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1 text-white/80 text-sm mb-1">
                    <MapPin className="w-3 h-3" />
                    {dest.name}
                  </div>
                  <p className="text-white font-medium">{dest.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container-width text-center">
          <Baby className="w-12 h-12 text-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">Mehr Tipps im Blog</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            In unserem Blog findest du ausführliche Reiseberichte und weitere Tipps für Familien.
          </p>
          <Link to="/blog" className="btn-primary">
            Zum Blog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
