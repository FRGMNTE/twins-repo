import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, LogOut, Users, FileText, Image, Settings, Palette, Type, ImageIcon, Save, Check } from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useSiteSettings } from '../context/SiteSettingsContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Modern)' },
  { value: 'Manrope', label: 'Manrope (Clean)' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegant)' },
  { value: 'SF Pro Display', label: 'SF Pro Display (Apple)' },
];

const BACKGROUND_PRESETS = {
  light: [
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920', label: 'Berge Schweiz' },
    { url: 'https://images.unsplash.com/photo-1758205563637-4bd20dc1badb?w=1920', label: 'Norwegen Fjord' },
    { url: 'https://images.unsplash.com/photo-1618220628839-0d71d7e4fdf2?w=1920', label: 'Neuseeland' },
    { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920', label: 'Wald & Berge' },
  ],
  dark: [
    { url: 'https://images.unsplash.com/photo-1516572704891-60b47497c7b5?w=1920', label: 'See Nacht' },
    { url: 'https://images.unsplash.com/photo-1588357952484-0ed2bc9a3b5a?w=1920', label: 'Sternennacht' },
    { url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920', label: 'Nordlichter' },
    { url: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=1920', label: 'Nacht Himmel' },
  ],
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [adminHint, setAdminHint] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const { settings, updateSettings, refetch } = useSiteSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

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

  const handleSaveSettings = async () => {
    setLoading(true);
    const success = await updateSettings(localSettings);
    setLoading(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      refetch();
    }
  };

  const updateLocalSetting = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <main id="main-content" className="pt-14">
        <section className="section-padding min-h-[80vh] flex items-center">
          <div className="container-width">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-sm mx-auto"
            >
              <div className="text-center mb-8">
                <Shield className="w-12 h-12 text-foreground mx-auto mb-4" />
                <h1 className="text-2xl font-semibold text-foreground mb-2">Admin</h1>
                <p className="text-sm text-muted-foreground">
                  Melde dich mit deiner E-Mail an.
                </p>
              </div>

              {step === 'email' ? (
                <form onSubmit={handleRequestCode} className="space-y-4" data-testid="admin-email-form">
                  <div>
                    <Label className="text-xs">E-Mail-Adresse</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@gltz.de"
                      className="mt-1"
                      required
                      data-testid="admin-email-input"
                    />
                  </div>

                  {error && <p className="text-xs text-destructive">{error}</p>}

                  <Button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full"
                    data-testid="admin-request-code"
                  >
                    {loading ? 'Wird gesendet...' : 'Code anfordern'}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4" data-testid="admin-code-form">
                  <div>
                    <Label className="text-xs">Bestätigungscode</Label>
                    <div className="flex justify-center mt-2">
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
                    <p className="text-xs text-muted-foreground bg-secondary p-2 rounded">{adminHint}</p>
                  )}
                  {error && <p className="text-xs text-destructive">{error}</p>}

                  <Button
                    onClick={handleVerifyCode}
                    disabled={loading || code.length !== 6}
                    className="w-full"
                    data-testid="admin-verify-code"
                  >
                    {loading ? 'Wird geprüft...' : 'Anmelden'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => { setStep('email'); setCode(''); setError(''); }}
                    className="w-full text-xs"
                  >
                    Zurück
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
    );
  }

  // Admin Dashboard
  return (
    <main id="main-content" className="pt-14">
      <section className="section-padding" data-testid="admin-dashboard">
        <div className="container-width">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Admin</h1>
              <p className="text-sm text-muted-foreground">Verwalte deine Website</p>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-xs" data-testid="admin-logout">
              <LogOut className="w-4 h-4 mr-1" /> Abmelden
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="settings" className="text-xs">
                <Settings className="w-4 h-4 mr-1" /> Einstellungen
              </TabsTrigger>
              <TabsTrigger value="contacts" className="text-xs">
                <Users className="w-4 h-4 mr-1" /> Kontakte ({contacts.length})
              </TabsTrigger>
            </TabsList>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Texte & Überschriften */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Type className="w-5 h-5 text-foreground" />
                    <h2 className="text-lg font-semibold">Texte & Überschriften</h2>
                  </div>

                  <div>
                    <Label className="text-xs">Logo Text</Label>
                    <Input
                      value={localSettings.logoText || ''}
                      onChange={(e) => updateLocalSetting('logoText', e.target.value)}
                      placeholder="gltz.de"
                      className="mt-1"
                      data-testid="settings-logo-text"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Hero Überschrift</Label>
                    <Input
                      value={localSettings.heroTitle || ''}
                      onChange={(e) => updateLocalSetting('heroTitle', e.target.value)}
                      placeholder="gltz.de"
                      className="mt-1"
                      data-testid="settings-hero-title"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Hero Untertitel</Label>
                    <Input
                      value={localSettings.heroSubtitle || ''}
                      onChange={(e) => updateLocalSetting('heroSubtitle', e.target.value)}
                      placeholder="Unsere Reise mit Zwillingen"
                      className="mt-1"
                      data-testid="settings-hero-subtitle"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Hero Beschreibung</Label>
                    <Input
                      value={localSettings.heroDescription || ''}
                      onChange={(e) => updateLocalSetting('heroDescription', e.target.value)}
                      placeholder="Anonyme Tipps für junge Familien"
                      className="mt-1"
                      data-testid="settings-hero-description"
                    />
                  </div>
                </div>

                {/* Schriftart & Farben */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-foreground" />
                    <h2 className="text-lg font-semibold">Schriftart & Farben</h2>
                  </div>

                  <div>
                    <Label className="text-xs">Schriftart</Label>
                    <Select
                      value={localSettings.fontFamily || 'Inter'}
                      onValueChange={(v) => updateLocalSetting('fontFamily', v)}
                    >
                      <SelectTrigger className="mt-1" data-testid="settings-font-family">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.map(font => (
                          <SelectItem key={font.value} value={font.value}>
                            <span style={{ fontFamily: font.value }}>{font.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Primärfarbe</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="color"
                        value={localSettings.primaryColor || '#1d1d1f'}
                        onChange={(e) => updateLocalSetting('primaryColor', e.target.value)}
                        className="w-10 h-10 rounded border cursor-pointer"
                        data-testid="settings-primary-color"
                      />
                      <Input
                        value={localSettings.primaryColor || '#1d1d1f'}
                        onChange={(e) => updateLocalSetting('primaryColor', e.target.value)}
                        placeholder="#1d1d1f"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Hintergründe */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="w-5 h-5 text-foreground" />
                    <h2 className="text-lg font-semibold">Hintergründe</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Light Background */}
                    <div>
                      <Label className="text-xs mb-2 block">Hell-Modus Hintergrund</Label>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {BACKGROUND_PRESETS.light.map((bg) => (
                          <button
                            key={bg.url}
                            onClick={() => updateLocalSetting('lightBackground', bg.url)}
                            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                              localSettings.lightBackground === bg.url 
                                ? 'border-foreground' 
                                : 'border-transparent hover:border-muted-foreground'
                            }`}
                          >
                            <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 text-[10px] text-white bg-black/50 px-1 rounded">
                              {bg.label}
                            </span>
                          </button>
                        ))}
                      </div>
                      <Input
                        value={localSettings.lightBackground || ''}
                        onChange={(e) => updateLocalSetting('lightBackground', e.target.value)}
                        placeholder="URL zum Bild"
                        className="text-xs"
                        data-testid="settings-light-bg"
                      />
                    </div>

                    {/* Dark Background */}
                    <div>
                      <Label className="text-xs mb-2 block">Dunkel-Modus Hintergrund</Label>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {BACKGROUND_PRESETS.dark.map((bg) => (
                          <button
                            key={bg.url}
                            onClick={() => updateLocalSetting('darkBackground', bg.url)}
                            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                              localSettings.darkBackground === bg.url 
                                ? 'border-foreground' 
                                : 'border-transparent hover:border-muted-foreground'
                            }`}
                          >
                            <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 text-[10px] text-white bg-black/50 px-1 rounded">
                              {bg.label}
                            </span>
                          </button>
                        ))}
                      </div>
                      <Input
                        value={localSettings.darkBackground || ''}
                        onChange={(e) => updateLocalSetting('darkBackground', e.target.value)}
                        placeholder="URL zum Bild"
                        className="text-xs"
                        data-testid="settings-dark-bg"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="lg:col-span-2 pt-4 border-t">
                  <Button
                    onClick={handleSaveSettings}
                    disabled={loading}
                    className="w-full sm:w-auto"
                    data-testid="save-settings"
                  >
                    {saveSuccess ? (
                      <><Check className="w-4 h-4 mr-1" /> Gespeichert</>
                    ) : (
                      <><Save className="w-4 h-4 mr-1" /> Einstellungen speichern</>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts">
              {contacts.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Noch keine Anfragen</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="p-4 border rounded-lg hover:bg-secondary/30 transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 bg-secondary rounded-full capitalize">
                              {contact.thema}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(contact.timestamp).toLocaleDateString('de-DE')}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {contact.name || 'Anonym'} – {contact.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {contact.nachricht}
                          </p>
                        </div>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-xs text-foreground hover:underline flex-shrink-0"
                        >
                          Antworten
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
