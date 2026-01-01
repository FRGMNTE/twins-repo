import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lightbulb, Baby, Moon, ShoppingBag, Heart, Users, Car, Home, ChevronDown, ArrowRight } from 'lucide-react';

const TIP_CATEGORIES = [
  {
    id: 'schlafen',
    title: 'Schlafen',
    icon: Moon,
    tips: [
      { title: 'Gleicher Schlafrhythmus', content: 'Wecke das zweite Baby, wenn das erste wach wird – so synchronisieren sich die Schlafzeiten.' },
      { title: 'Getrennte Betten?', content: 'Am Anfang können Zwillinge zusammen schlafen – sie beruhigen sich gegenseitig. Später empfehlen sich getrennte Schlafplätze.' },
      { title: 'Nacht-Routine', content: 'Eine feste Abendroutine (Bad, Massage, Flasche, Lied) hilft beiden Babys beim Einschlafen.' },
      { title: 'Tag-Nacht-Unterschied', content: 'Tags hell und lebendig, nachts dunkel und ruhig – so lernen Babys den Unterschied.' },
    ]
  },
  {
    id: 'fuettern',
    title: 'Füttern',
    icon: Baby,
    tips: [
      { title: 'Tandem-Stillen', content: 'Mit einem Zwillingsstillkissen können beide Babys gleichzeitig gestillt werden – spart Zeit!' },
      { title: 'Flasche vorbereiten', content: 'Bereite Flaschen für die Nacht schon abends vor. Pulver abgemessen, Wasser in Thermoskanne.' },
      { title: 'Fütterungsprotokoll', content: 'Notiere, welches Baby wann und wie viel getrunken hat – das hilft, den Überblick zu behalten.' },
      { title: 'Gleichzeitig füttern', content: 'Mit etwas Übung kann man beide Babys gleichzeitig mit der Flasche füttern.' },
    ]
  },
  {
    id: 'ausstattung',
    title: 'Ausstattung',
    icon: ShoppingBag,
    tips: [
      { title: 'Doppelt kaufen?', content: 'Nicht alles muss doppelt sein: Ein Wickeltisch reicht, aber zwei Babyschalen sind Pflicht.' },
      { title: 'Zwillingswagen', content: 'Ein Seite-an-Seite-Wagen ist breiter, aber wendiger. Tandem-Wagen sind schmaler, aber länger.' },
      { title: 'Second Hand', content: 'Babykleidung und viele Artikel können gebraucht gekauft werden – Babys wachsen schnell!' },
      { title: 'Wickelstationen', content: 'Richte mehrere Wickelstationen ein – eine im Kinderzimmer, eine im Wohnbereich.' },
    ]
  },
  {
    id: 'organisation',
    title: 'Organisation',
    icon: Home,
    tips: [
      { title: 'Hilfe annehmen', content: 'Sage Ja, wenn jemand Hilfe anbietet. Ob Kochen, Putzen oder Baby-Aufsicht – alles hilft!' },
      { title: 'Meal Prep', content: 'Koche vor und friere Portionen ein. In stressigen Phasen ist schnelles Essen Gold wert.' },
      { title: 'Online bestellen', content: 'Windeln, Feuchttücher, Babymilch – bestelle Verbrauchsartikel online im Abo.' },
      { title: 'Notfall-Plan', content: 'Habe einen Plan B: Wer kann einspringen, wenn ein Elternteil krank wird?' },
    ]
  },
  {
    id: 'unterwegs',
    title: 'Unterwegs',
    icon: Car,
    tips: [
      { title: 'Wickeltasche', content: 'Packe die Tasche immer sofort nach der Rückkehr wieder – so bist du jederzeit startklar.' },
      { title: 'Timing', content: 'Plane Ausflüge zwischen Schläfchen und Mahlzeiten. Ausgeruhte und satte Babys sind zufriedener.' },
      { title: 'Tragen & Wagen', content: 'Ein Baby in der Trage, eines im Wagen – so hast du Hände frei und bist flexibler.' },
      { title: 'Notfall-Kit', content: 'Immer dabei: Extra-Kleidung, Snacks, Wasser, Spielzeug, Medikamente.' },
    ]
  },
];

export default function Tipps() {
  const [openCategory, setOpenCategory] = useState('schlafen');

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
            <span className="text-sm font-medium text-primary uppercase tracking-wide">Tipps & Tricks</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">
              Praktische Ratschläge
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Gesammelte Weisheiten aus unserem Alltag mit Zwillingen – von Eltern für Eltern.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tips Accordion */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <div className="max-w-3xl mx-auto">
            {TIP_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="mb-4"
              >
                <button
                  onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
                  className={`w-full flex items-center justify-between p-5 rounded-xl border transition-colors ${
                    openCategory === category.id
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card border-border hover:bg-secondary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="w-5 h-5" />
                    <span className="font-semibold">{category.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      openCategory === category.id ? 'bg-background/20' : 'bg-secondary'
                    }`}>
                      {category.tips.length} Tipps
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${
                    openCategory === category.id ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {openCategory === category.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border border-t-0 border-border rounded-b-xl overflow-hidden"
                  >
                    <div className="p-4 space-y-4">
                      {category.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="p-4 rounded-lg bg-secondary/30">
                          <h4 className="font-semibold text-foreground mb-1">{tip.title}</h4>
                          <p className="text-sm text-muted-foreground">{tip.content}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="section-padding bg-secondary/30">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <Users className="w-12 h-12 text-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-4">Hast du auch Tipps?</h2>
            <p className="text-muted-foreground mb-8">
              Wir freuen uns über Erfahrungen von anderen Zwillingseltern. 
              Schreib uns deine besten Tipps!
            </p>
            <Link to="/kontakt" className="btn-primary">
              Kontakt aufnehmen <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
