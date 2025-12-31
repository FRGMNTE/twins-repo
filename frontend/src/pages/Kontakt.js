import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
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
import { Label } from '../components/ui/label';

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
    <main id="main-content" className="pt-14">
      <section className="section-padding" data-testid="contact-page">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-semibold text-foreground mb-4 tracking-tight">
              Kontakt
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Fragen zu Zwillingen-Alltag? Wir sind Eltern wie du.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-md mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-5" data-testid="contact-form">
              <div>
                <Label className="text-xs">Name <span className="text-muted-foreground">(optional)</span></Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Dein Name"
                  className="mt-1"
                  data-testid="contact-name"
                />
              </div>

              <div>
                <Label className="text-xs">E-Mail *</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="deine@email.de"
                  className="mt-1"
                  data-testid="contact-email"
                />
              </div>

              <div>
                <Label className="text-xs">Thema *</Label>
                <Select value={formData.thema} onValueChange={handleThemaChange} required>
                  <SelectTrigger className="mt-1" data-testid="contact-thema">
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

              <div>
                <Label className="text-xs">Nachricht *</Label>
                <Textarea
                  name="nachricht"
                  value={formData.nachricht}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Wie können wir dir helfen?"
                  className="mt-1 resize-none"
                  data-testid="contact-nachricht"
                />
              </div>

              <p className="text-[10px] text-muted-foreground">
                Deine Daten werden nur für die Kontaktaufnahme genutzt. 
                Mehr in unserer <a href="/datenschutz" className="underline">Datenschutzerklärung</a>.
              </p>

              <Button
                type="submit"
                disabled={isSubmitting || !formData.email || !formData.thema || !formData.nachricht}
                className="w-full"
                data-testid="contact-submit"
              >
                {isSubmitting ? 'Wird gesendet...' : <><Send className="w-4 h-4" /> Senden</>}
              </Button>

              {status.type && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                    status.type === 'success'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                  data-testid="contact-status"
                >
                  {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {status.message}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
