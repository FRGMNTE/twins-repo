import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Moon, Utensils, Baby, Heart, Repeat, ArrowRight, Lightbulb } from 'lucide-react';

const DAILY_ROUTINE = [
  { time: '06:00', activity: 'Aufwachen & erste Flasche/Stillen', icon: Moon },
  { time: '08:00', activity: 'Frühstück & Spielzeit', icon: Utensils },
  { time: '10:00', activity: 'Vormittags-Schläfchen', icon: Moon },
  { time: '12:00', activity: 'Mittagessen & Wickeln', icon: Utensils },
  { time: '14:00', activity: 'Nachmittags-Schläfchen', icon: Moon },
  { time: '16:00', activity: 'Spielzeit & Spaziergang', icon: Baby },
  { time: '18:00', activity: 'Abendessen & Baden', icon: Utensils },
  { time: '19:30', activity: 'Gute-Nacht-Routine', icon: Moon },
];

const SURVIVAL_TIPS = [
  {
    icon: Repeat,
    title: 'Synchronisieren',
    desc: 'Versuche, beide Babys gleichzeitig zu füttern und schlafen zu legen. Das spart Zeit und Energie.',
  },
  {
    icon: Clock,
    title: 'Routine etablieren',
    desc: 'Eine feste Tagesstruktur hilft allen – den Babys und den Eltern.',
  },
  {
    icon: Heart,
    title: 'Hilfe annehmen',
    desc: 'Scheue dich nicht, Hilfe von Familie und Freunden anzunehmen.',
  },
  {
    icon: Lightbulb,
    title: 'Praktisch denken',
    desc: 'Doppelte Ausstattung an strategischen Orten – Wickelstation oben und unten.',
  },
];

export default function BabyAlltag() {
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
            <span className="text-sm font-medium text-primary uppercase tracking-wide">Baby-Alltag</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">
              Leben mit Zwillingen
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Der Alltag mit zwei Babys ist intensiv, aber auch wunderschön. 
              Hier zeigen wir, wie wir unseren Tag strukturieren und welche Tipps uns helfen.
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
              
              {DAILY_ROUTINE.map((item, index) => (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex items-center gap-6 py-4"
                >
                  {/* Time Dot */}
                  <div className="w-16 shrink-0 text-right">
                    <span className="text-sm font-semibold text-foreground">{item.time}</span>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full bg-background border-2 border-foreground/20 flex items-center justify-center z-10">
                    <item.icon className="w-4 h-4 text-foreground" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-4 rounded-xl bg-secondary/30 border border-border">
                    <p className="text-foreground">{item.activity}</p>
                  </div>
                </motion.div>
              ))}
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
          <h2 className="text-2xl font-semibold text-foreground mb-4">Mehr praktische Tipps</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Entdecke weitere hilfreiche Ratschläge für den Zwillingsalltag.
          </p>
          <Link to="/tipps" className="btn-primary">
            Zu den Tipps <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
