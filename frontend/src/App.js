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
import UeberUns from './pages/UeberUns';
import Schwangerschaft from './pages/Schwangerschaft';
import BabyAlltag from './pages/BabyAlltag';
import Tipps from './pages/Tipps';
import Reisen from './pages/Reisen';
import Blog from './pages/Blog';
import Suchen from './pages/Suchen';
import Spende from './pages/Spende';
import TwinsArt from './pages/TwinsArt';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import Cookies from './pages/Cookies';
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
              <Route path="/ueber-uns" element={<UeberUns />} />
              <Route path="/schwangerschaft" element={<Schwangerschaft />} />
              <Route path="/baby-alltag" element={<BabyAlltag />} />
              <Route path="/tipps" element={<Tipps />} />
              <Route path="/reisen" element={<Reisen />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/suchen" element={<Suchen />} />
              <Route path="/spende" element={<Spende />} />
              <Route path="/twins-art" element={<TwinsArt />} />
              <Route path="/mo-portfolio" element={<TwinsArt />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/datenschutz" element={<Datenschutz />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/admin" element={<Admin />} />
              {/* Dynamic pages from database */}
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
