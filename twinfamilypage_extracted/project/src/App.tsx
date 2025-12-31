import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Schwangerschaft from './pages/Schwangerschaft';
import BabyAlltag from './pages/BabyAlltag';
import Tipps from './pages/Tipps';
import Shop from './pages/Shop';
import Kontakt from './pages/Kontakt';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schwangerschaft" element={<Schwangerschaft />} />
            <Route path="/baby-alltag" element={<BabyAlltag />} />
            <Route path="/tipps" element={<Tipps />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
          </Routes>
          <Footer />
          <CookieBanner />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
