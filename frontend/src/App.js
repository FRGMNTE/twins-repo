import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/sonner';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Schwangerschaft from './pages/Schwangerschaft';
import BabyAlltag from './pages/BabyAlltag';
import Tipps from './pages/Tipps';
import TwinsArt from './pages/TwinsArt';
import Kontakt from './pages/Kontakt';
import Admin from './pages/Admin';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground transition-colors">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schwangerschaft" element={<Schwangerschaft />} />
            <Route path="/baby-alltag" element={<BabyAlltag />} />
            <Route path="/tipps" element={<Tipps />} />
            <Route path="/twins-art" element={<TwinsArt />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
          </Routes>
          <Footer />
          <CookieBanner />
          <Toaster position="top-center" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
