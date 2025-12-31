import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { Toaster } from './components/ui/sonner';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Kontakt from './pages/Kontakt';
import Admin from './pages/Admin';
import DynamicPage from './pages/DynamicPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <SiteSettingsProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground transition-colors">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/admin" element={<Admin />} />
              {/* All other pages are dynamic from database */}
              <Route path="/:slug" element={<DynamicPage />} />
            </Routes>
            <Footer />
            <CookieBanner />
            <Toaster position="top-center" />
          </div>
        </Router>
      </SiteSettingsProvider>
    </ThemeProvider>
  );
}

export default App;
