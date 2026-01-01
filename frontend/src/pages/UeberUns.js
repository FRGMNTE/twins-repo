import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Users, Baby, Sparkles, ArrowRight } from 'lucide-react';

export default function UeberUns() {
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
            <span className="text-sm font-medium text-primary uppercase tracking-wide">Über uns</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">
              Eine Familie, zwei Herzen, doppeltes Glück
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Wir sind eine junge Familie vom Niederrhein und teilen hier unsere Erfahrungen 
              als Zwillingseltern – ehrlich, anonym und von Herzen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-6">Unsere Geschichte</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Als wir erfuhren, dass wir Zwillinge erwarten, war das ein Moment voller Freude 
                  und auch ein bisschen Aufregung. Plötzlich war alles doppelt: doppelte Vorfreude, 
                  doppelte Planung, doppelte Liebe.
                </p>
                <p>
                  Heute, einige Zeit später, möchten wir unsere Erfahrungen teilen. Nicht als 
                  Experten, sondern als Eltern, die verstehen, wie es ist, wenn man zwei kleine 
                  Menschen gleichzeitig durch die Welt begleitet.
                </p>
                <p>
                  Auf dieser Seite findest du unsere Tipps, Geschichten und auch die kleinen 
                  Kunstwerke unserer Zwillinge – M & O.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
                <img 
                  src="https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800" 
                  alt="Familie" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-primary/10 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary/30">
        <div className="container-width">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">Was uns wichtig ist</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Ehrlichkeit', desc: 'Wir teilen echte Erfahrungen – auch die schwierigen Momente.' },
              { icon: Users, title: 'Gemeinschaft', desc: 'Zwillingsfamilien unterstützen sich gegenseitig.' },
              { icon: Baby, title: 'Liebe', desc: 'Alles, was wir tun, kommt von Herzen.' },
              { icon: Sparkles, title: 'Kreativität', desc: 'Unsere Kinder inspirieren uns jeden Tag.' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-background border border-border"
              >
                <item.icon className="w-8 h-8 text-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container-width text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Begleite uns auf unserer Reise</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Entdecke unsere Tipps, lies unseren Blog oder schau dir die Kunstwerke unserer Zwillinge an.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/blog" className="btn-primary">
              Zum Blog <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/twins-art" className="btn-secondary">
              Twins-Art entdecken
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
