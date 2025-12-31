import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, Baby, Heart, Lightbulb, Palette, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Home() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.post(`${API}/seed`);
        const response = await axios.get(`${API}/blog?limit=3`);
        setBlogPosts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleScrollToContent = () => {
    document.getElementById('teaser-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const teasers = [
    {
      icon: Baby,
      title: 'Schwangerschaft & Geburt',
      description: 'Kliniktaschen, Haus-Organisation, emotionale Vorbereitung für Zwillinge',
      link: '/schwangerschaft',
    },
    {
      icon: Heart,
      title: 'Baby-Alltag',
      description: 'Schlaf-Routinen, Füttern, Spielideen – was bei uns funktioniert',
      link: '/baby-alltag',
    },
    {
      icon: Lightbulb,
      title: 'Tipps & Hacks',
      description: '10 praktische Lösungen für Zwillingseltern – Mental Load bis Haushalt',
      link: '/tipps',
    },
  ];

  return (
    <main id="main-content">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        data-testid="hero-section"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.pexels.com/photos/12529917/pexels-photo-12529917.jpeg)',
            backgroundPosition: 'center 40%'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="relative z-10 container-width text-center py-32">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground mb-6 tracking-tight"
            data-testid="hero-title"
          >
            gltz.de – Unsere Reise mit Zwillingen
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Anonyme Tipps für junge Familien vom Niederrhein. Von Schwangerschaft bis
            Kleinkindalltag – praxisnah & ehrlich
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={handleScrollToContent}
            className="btn-primary"
            aria-label="Zu den Tipps scrollen"
            data-testid="hero-cta"
          >
            Tipps entdecken
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </motion.button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </div>
      </section>

      {/* Teaser Section */}
      <section id="teaser-section" className="section-padding bg-background" data-testid="teaser-section">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Was dich erwartet
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Praxisnahe Tipps aus unserem Zwillingsalltag
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teasers.map((teaser, index) => (
              <motion.div
                key={teaser.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link 
                  to={teaser.link} 
                  className="block h-full"
                  data-testid={`teaser-card-${index}`}
                >
                  <div className="glass-card p-8 rounded-3xl h-full">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 group-hover:bg-primary/20 transition-colors">
                      <teaser.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {teaser.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {teaser.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Twins Art Preview */}
      <section className="section-padding bg-card" data-testid="twins-art-preview">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Palette className="w-16 h-16 text-[hsl(var(--twins-art))] mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Twins-Art
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Anonyme Familienkunst aus Liebe zu unseren Kindern. 
              Unterstütze unser Familienprojekt.
            </p>

            <div className="relative w-full max-w-3xl mx-auto mb-8 rounded-3xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/5447092/pexels-photo-5447092.jpeg"
                alt="Kunstmaterialien - Pinsel und Farben für Kinderkunst"
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>

            <Link
              to="/twins-art"
              className="btn-primary"
              data-testid="twins-art-cta"
            >
              Zur Galerie
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Blog Teaser */}
      {blogPosts.length > 0 && (
        <section className="section-padding bg-background" data-testid="blog-teaser-section">
          <div className="container-width">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Neueste Tipps
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Aktuelle Beiträge aus unserem Familienleben
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="glass-card rounded-3xl overflow-hidden"
                  data-testid={`blog-post-${index}`}
                >
                  {post.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mt-2 mb-3">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/tipps" className="btn-secondary" data-testid="view-all-tips">
                Alle Tipps ansehen
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
