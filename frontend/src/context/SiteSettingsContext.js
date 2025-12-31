import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SiteSettingsContext = createContext();

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const defaultSettings = {
  heroTitle: 'gltz.de',
  heroSubtitle: 'Unsere Reise mit Zwillingen',
  heroDescription: 'Anonyme Tipps für junge Familien vom Niederrhein.',
  fontFamily: 'Inter',
  primaryColor: '#1d1d1f',
  lightBackground: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
  darkBackground: 'https://images.unsplash.com/photo-1516572704891-60b47497c7b5?w=1920',
  logoText: 'gltz.de',
};

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    // Apply font family
    document.documentElement.style.setProperty('--font-family', settings.fontFamily);
  }, [settings.fontFamily]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      if (response.data) {
        setSettings({ ...defaultSettings, ...response.data });
      }
    } catch (error) {
      console.log('Using default settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const merged = { ...settings, ...newSettings };
      await axios.post(`${API}/settings`, merged);
      setSettings(merged);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, loading, refetch: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
