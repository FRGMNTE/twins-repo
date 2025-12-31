import { motion } from 'framer-motion';
import { FileText, Mail, Phone, MapPin } from 'lucide-react';

export default function Impressum() {
  return (
    <main id="main-content" className="pt-20">
      <section className="section-padding bg-gradient-to-b from-card to-background" data-testid="impressum-page">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Impressum
              </h1>
              <p className="text-muted-foreground">
                Angaben gemäß § 5 TMG
              </p>
            </div>

            <div className="glass-card p-8 sm:p-12 rounded-3xl space-y-8">
              {/* Anbieter */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Angaben zum Anbieter
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground font-medium">John D. Gold</p>
                      <p className="text-muted-foreground">Schützenstraße 38</p>
                      <p className="text-muted-foreground">47829 Krefeld</p>
                      <p className="text-muted-foreground">Deutschland</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <a href="tel:+4915757312560" className="text-foreground hover:text-primary transition-colors">
                      01575 731 2560
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <a href="mailto:gltz.de@gmail.com" className="text-foreground hover:text-primary transition-colors">
                      gltz.de@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Verantwortlich */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Verantwortlich für den Inhalt
                </h2>
                <p className="text-muted-foreground">
                  John D. Gold<br />
                  Schützenstraße 38<br />
                  47829 Krefeld
                </p>
              </div>

              {/* Haftungsausschluss */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Haftungsausschluss
                </h2>
                
                <h3 className="text-lg font-medium text-foreground mb-2">Haftung für Inhalte</h3>
                <p className="text-muted-foreground mb-4">
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. 
                  Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können 
                  wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß 
                  § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen 
                  Gesetzen verantwortlich.
                </p>

                <h3 className="text-lg font-medium text-foreground mb-2">Haftung für Links</h3>
                <p className="text-muted-foreground mb-4">
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren 
                  Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden 
                  Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
                  Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                </p>

                <h3 className="text-lg font-medium text-foreground mb-2">Urheberrecht</h3>
                <p className="text-muted-foreground">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten 
                  unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche 
                  gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                  der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der 
                  schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </div>

              {/* Streitschlichtung */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Streitschlichtung
                </h2>
                <p className="text-muted-foreground">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                  <a 
                    href="https://ec.europa.eu/consumers/odr/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                  <br /><br />
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor 
                  einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
