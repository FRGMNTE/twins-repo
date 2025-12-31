import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, KeyRound, LogOut, Users, FileText, Image, Settings } from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [adminHint, setAdminHint] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      verifySession(token);
    }
  }, []);

  const verifySession = async (token) => {
    try {
      await axios.get(`${API}/admin/verify-session?token=${token}`);
      setIsAuthenticated(true);
      fetchContacts();
    } catch {
      localStorage.removeItem('admin_token');
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API}/contact`);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAdminHint('');

    try {
      const response = await axios.post(`${API}/admin/request-code`, { email });
      setStep('code');
      if (response.data.hint) {
        setAdminHint(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Fehler beim Senden des Codes');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/admin/verify-code`, { email, code });
      localStorage.setItem('admin_token', response.data.token);
      setIsAuthenticated(true);
      fetchContacts();
    } catch (error) {
      setError(error.response?.data?.detail || 'Ungültiger Code');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setStep('email');
    setEmail('');
    setCode('');
  };

  if (!isAuthenticated) {
    return (
      <main id="main-content" className="pt-20">
        <section className="section-padding bg-gradient-to-b from-card to-background min-h-[80vh] flex items-center">
          <div className="container-width">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto"
            >
              <div className="glass-card p-8 sm:p-12 rounded-3xl text-center">
                <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Admin-Bereich
                </h1>
                <p className="text-muted-foreground mb-8">
                  Melde dich mit deiner E-Mail an, um einen Bestätigungscode zu erhalten.
                </p>

                {step === 'email' ? (
                  <form onSubmit={handleRequestCode} className="space-y-4" data-testid="admin-email-form">
                    <div className="text-left">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        E-Mail-Adresse
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@gltz.de"
                          className="pl-10 bg-background/50"
                          required
                          data-testid="admin-email-input"
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full btn-primary"
                      data-testid="admin-request-code"
                    >
                      {loading ? 'Wird gesendet...' : 'Code anfordern'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6" data-testid="admin-code-form">
                    <div className="text-left">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bestätigungscode
                      </label>
                      <div className="flex justify-center">
                        <InputOTP
                          value={code}
                          onChange={setCode}
                          maxLength={6}
                          data-testid="admin-code-input"
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    {adminHint && (
                      <div className="p-3 bg-primary/10 rounded-xl text-sm text-primary">
                        <KeyRound className="w-4 h-4 inline mr-2" />
                        {adminHint}
                      </div>
                    )}

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}

                    <div className="space-y-3">
                      <Button
                        onClick={handleVerifyCode}
                        disabled={loading || code.length !== 6}
                        className="w-full btn-primary"
                        data-testid="admin-verify-code"
                      >
                        {loading ? 'Wird geprüft...' : 'Anmelden'}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => { setStep('email'); setCode(''); setError(''); }}
                        className="w-full"
                      >
                        Zurück
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="pt-20">
      <section className="section-padding bg-background" data-testid="admin-dashboard">
        <div className="container-width">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Admin-Dashboard
              </h1>
              <p className="text-muted-foreground">
                Willkommen zurück! Verwalte deine Inhalte.
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="btn-secondary"
              data-testid="admin-logout"
            >
              <LogOut className="w-4 h-4" />
              Abmelden
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl"
            >
              <Users className="w-8 h-8 text-primary mb-3" />
              <p className="text-3xl font-bold text-foreground">{contacts.length}</p>
              <p className="text-sm text-muted-foreground">Kontaktanfragen</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 rounded-2xl"
            >
              <FileText className="w-8 h-8 text-[hsl(var(--success))] mb-3" />
              <p className="text-3xl font-bold text-foreground">3</p>
              <p className="text-sm text-muted-foreground">Blog-Beiträge</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-2xl"
            >
              <Image className="w-8 h-8 text-[hsl(var(--twins-art))] mb-3" />
              <p className="text-3xl font-bold text-foreground">6</p>
              <p className="text-sm text-muted-foreground">Galerie-Bilder</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 rounded-2xl"
            >
              <Settings className="w-8 h-8 text-[hsl(var(--warning))] mb-3" />
              <p className="text-3xl font-bold text-foreground">5</p>
              <p className="text-sm text-muted-foreground">Seiten</p>
            </motion.div>
          </div>

          {/* Contact Submissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-3xl overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Kontaktanfragen
              </h2>
            </div>

            {contacts.length === 0 ? (
              <div className="p-12 text-center">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Noch keine Anfragen vorhanden</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {contacts.map((contact) => (
                  <div key={contact.id} className="p-6 hover:bg-accent/50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full capitalize">
                            {contact.thema}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(contact.timestamp).toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="font-medium text-foreground mb-1">
                          {contact.name || 'Anonym'} – {contact.email}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {contact.nachricht}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <a
                          href={`mailto:${contact.email}`}
                          className="btn-secondary text-sm"
                        >
                          Antworten
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
