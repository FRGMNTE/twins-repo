import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Users, Mail } from 'lucide-react';

export default function Datenschutz() {
  return (
    <main id="main-content" className="pt-20">
      <section className="section-padding bg-gradient-to-b from-card to-background" data-testid="datenschutz-page">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Datenschutzerklärung
              </h1>
              <p className="text-muted-foreground">
                Informationen zum Datenschutz gemäß DSGVO
              </p>
            </div>

            <div className="glass-card p-8 sm:p-12 rounded-3xl space-y-8">
              {/* Einleitung */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    1. Datenschutz auf einen Blick
                  </h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Der Schutz deiner persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung 
                  informiert dich darüber, welche Daten wir erheben und wie wir sie verwenden.
                </p>
                <p className="text-muted-foreground">
                  <strong>Verantwortlicher:</strong><br />
                  John D. Gold<br />
                  Schützenstraße 38<br />
                  47829 Krefeld<br />
                  E-Mail: gltz.de@gmail.com
                </p>
              </div>

              {/* Datenerfassung */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    2. Datenerfassung auf dieser Website
                  </h2>
                </div>

                <h3 className="text-lg font-medium text-foreground mb-2">Kontaktformular</h3>
                <p className="text-muted-foreground mb-4">
                  Wenn du uns über das Kontaktformular kontaktierst, werden folgende Daten erhoben:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                  <li>Name (optional)</li>
                  <li>E-Mail-Adresse (erforderlich)</li>
                  <li>Ausgewähltes Thema</li>
                  <li>Nachrichteninhalt</li>
                  <li>Zeitstempel der Anfrage</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  <strong>Zweck:</strong> Bearbeitung deiner Anfrage und Kontaktaufnahme.<br />
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) 
                  oder Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).<br />
                  <strong>Speicherdauer:</strong> Bis zur Erledigung deiner Anfrage, maximal 2 Jahre.
                </p>

                <h3 className="text-lg font-medium text-foreground mb-2">Cookies</h3>
                <p className="text-muted-foreground">
                  Wir verwenden nur technisch notwendige Cookies für den Betrieb dieser Website 
                  (z.B. für Dark/Light Mode Einstellungen und Cookie-Einwilligung). Es werden 
                  keine Tracking- oder Werbe-Cookies eingesetzt.
                </p>
              </div>

              {/* Hosting */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    3. Hosting und Server
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  Diese Website wird bei einem externen Dienstleister gehostet. Die personenbezogenen 
                  Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters 
                  gespeichert. Die Verarbeitung erfolgt auf Grundlage unserer berechtigten Interessen 
                  an einer effizienten und sicheren Bereitstellung unserer Website (Art. 6 Abs. 1 lit. f DSGVO).
                </p>
              </div>

              {/* Deine Rechte */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    4. Deine Rechte
                  </h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Du hast jederzeit folgende Rechte bezüglich deiner personenbezogenen Daten:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Auskunft:</strong> Du kannst Auskunft über deine gespeicherten Daten verlangen.</li>
                  <li><strong>Berichtigung:</strong> Du kannst die Berichtigung unrichtiger Daten verlangen.</li>
                  <li><strong>Löschung:</strong> Du kannst die Löschung deiner Daten verlangen ("Recht auf Vergessenwerden").</li>
                  <li><strong>Einschränkung:</strong> Du kannst die Einschränkung der Verarbeitung verlangen.</li>
                  <li><strong>Datenübertragbarkeit:</strong> Du kannst deine Daten in einem gängigen Format erhalten.</li>
                  <li><strong>Widerspruch:</strong> Du kannst der Verarbeitung deiner Daten widersprechen.</li>
                </ul>
              </div>

              {/* Kontakt für Datenschutz */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    5. Kontakt bei Datenschutzfragen
                  </h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Bei Fragen zum Datenschutz oder zur Ausübung deiner Rechte kannst du dich 
                  jederzeit an uns wenden:
                </p>
                <p className="text-muted-foreground">
                  E-Mail: <a href="mailto:gltz.de@gmail.com" className="text-primary hover:underline">gltz.de@gmail.com</a>
                </p>
                <p className="text-muted-foreground mt-4">
                  Du hast außerdem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde 
                  über unsere Verarbeitung personenbezogener Daten zu beschweren.
                </p>
              </div>

              {/* PayPal Hinweis */}
              <div className="p-4 bg-primary/5 rounded-xl">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Hinweis zu PayPal-Unterstützungen
                </h3>
                <p className="text-sm text-muted-foreground">
                  Wenn du unser Projekt über PayPal unterstützt, erfolgt die Datenverarbeitung 
                  durch PayPal (Europe) S.à.r.l. et Cie, S.C.A. gemäß deren Datenschutzbestimmungen. 
                  Wir erhalten von PayPal lediglich eine Bestätigung der Transaktion.
                </p>
              </div>

              {/* Stand */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Stand: Dezember 2025
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
