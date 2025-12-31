import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Kontakt() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    thema: '',
    nachricht: '',
  });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemaChange = (value) => {
    setFormData((prev) => ({ ...prev, thema: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      await axios.post(`${API}/contact`, formData);
      setStatus({
        type: 'success',
        message: 'Danke! Wir melden uns in 24h bei dir.',
      });
      setFormData({ name: '', email: '', thema: '', nachricht: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="main-content" className="pt-20">
      <section className="section-padding bg-gradient-to-b from-card to-background" data-testid="contact-page">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <MessageCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
              Frag uns!
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Fragen zu Zwillingen-Alltag? Brauchst du ein offenes Ohr? 
              Wir sind Eltern wie du – praxisnah und individuell.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-8 sm:p-12 rounded-3xl">
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                {/* Name (Optional) */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Name <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dein Name"
                    className="bg-background/50"
                    data-testid="contact-name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    E-Mail <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="deine@email.de"
                    className="bg-background/50"
                    aria-required="true"
                    data-testid="contact-email"
                  />
                </div>

                {/* Thema Dropdown */}
                <div>
                  <label
                    htmlFor="thema"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Thema <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={formData.thema}
                    onValueChange={handleThemaChange}
                    required
                  >
                    <SelectTrigger 
                      className="bg-background/50" 
                      aria-label="Wähle ein Thema"
                      data-testid="contact-thema"
                    >
                      <SelectValue placeholder="Bitte wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="schlaf">Schlaf & Routinen</SelectItem>
                      <SelectItem value="fuettern">Füttern & Ernährung</SelectItem>
                      <SelectItem value="tipps">Allgemeine Tipps</SelectItem>
                      <SelectItem value="shop">Twins-Art & Unterstützung</SelectItem>
                      <SelectItem value="sonstiges">Sonstiges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Nachricht */}
                <div>
                  <label
                    htmlFor="nachricht"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Nachricht <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="nachricht"
                    name="nachricht"
                    value={formData.nachricht}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Erzähl uns, wie wir dir helfen können..."
                    className="bg-background/50 resize-none"
                    aria-required="true"
                    data-testid="contact-nachricht"
                  />
                </div>

                {/* Privacy Notice */}
                <p className="text-xs text-muted-foreground">
                  Deine Daten werden nur für die Kontaktaufnahme genutzt. 
                  Mehr dazu in unserer{' '}
                  <a href="/datenschutz" className="text-primary hover:underline">
                    Datenschutzerklärung
                  </a>.
                </p>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.email || !formData.thema || !formData.nachricht}
                  className="w-full btn-primary"
                  data-testid="contact-submit"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Nachricht senden
                    </>
                  )}
                </Button>

                {/* Status Messages */}
                {status.type && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex items-center gap-3 ${
                      status.type === 'success'
                        ? 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                    data-testid="contact-status"
                  >
                    {status.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium">{status.message}</p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Response Time Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-primary/5 rounded-full">
              <Mail className="w-5 h-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                Durchschnittliche Antwortzeit: 24-48 Stunden
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
