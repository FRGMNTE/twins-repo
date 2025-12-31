import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Home() {
  const [blogPosts, setBlogPosts] = useState([]);
  const { theme } = useTheme();
  const { settings } = useSiteSettings();

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

  const teasers = [
    {
      title: 'Schwangerschaft',
      description: 'Vorbereitung auf Zwillinge',
      link: '/schwangerschaft',
    },
    {
      title: 'Baby-Alltag',
      description: 'Routinen & Tipps',
      link: '/baby-alltag',
    },
    {
      title: 'Twins-Art',
      description: 'Familienkunst',
      link: '/twins-art',
    },
  ];

  return (
    <main id="main-content">
      {/* Hero Section - Apple Style Minimal */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        data-testid="hero-section"
      >
        {/* Background */}
        <div className="absolute inset-0">
          {theme === 'dark' ? (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${settings.darkBackground || 'https://images.unsplash.com/photo-1516572704891-60b47497c7b5?w=1920'})`,
              }}
            >
              <div className="absolute inset-0 bg-background/60" />
            </div>
          ) : (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${settings.lightBackground || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920'})`,
              }}
            >
              <div className="absolute inset-0 bg-background/70" />
            </div>
          )}
        </div>

        <div className="relative z-10 container-width text-center py-32">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-semibold text-foreground mb-6 tracking-tight"
            data-testid="hero-title"
          >
            {settings.heroTitle || 'gltz.de'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl sm:text-2xl text-muted-foreground mb-4"
          >
            {settings.heroSubtitle || 'Unsere Reise mit Zwillingen'}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-muted-foreground mb-12 max-w-xl mx-auto"
          >
            {settings.heroDescription || 'Anonyme Tipps für junge Familien vom Niederrhein.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/tipps" className="btn-primary" data-testid="hero-cta">
              Tipps entdecken
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/twins-art" className="btn-secondary">
              Twins-Art ansehen
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Teaser Grid - Apple Style */}
      <section className="section-padding bg-background" data-testid="teaser-section">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teasers.map((teaser, index) => (
              <motion.div
                key={teaser.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link 
                  to={teaser.link} 
                  className="block group"
                  data-testid={`teaser-card-${index}`}
                >
                  <div className="glass-card p-8 rounded-2xl h-full transition-all duration-200 hover:bg-secondary/50">
                    <h3 className="text-2xl font-semibold text-foreground mb-2">
                      {teaser.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {teaser.description}
                    </p>
                    <span className="text-sm text-foreground flex items-center gap-1 group-hover:gap-2 transition-all">
                      Mehr erfahren <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section - Minimal */}
      {blogPosts.length > 0 && (
        <section className="section-padding bg-secondary/30" data-testid="blog-teaser-section">
          <div className="container-width">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
                Neueste Tipps
              </h2>
              <p className="text-muted-foreground">
                Aus unserem Familienleben
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  data-testid={`blog-post-${index}`}
                >
                  {post.image_url && (
                    <div className="aspect-video rounded-xl overflow-hidden mb-4">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mt-1 mb-2 group-hover:text-muted-foreground transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                </motion.article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/tipps" className="btn-ghost" data-testid="view-all-tips">
                Alle Tipps <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container-width text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Projekt unterstützen
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Die Kunst bringt Freude, Einnahmen bleiben 100% in der Familie.
          </p>
          <a
            href="https://paypal.me/gltzfamily"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            data-testid="paypal-cta"
          >
            Unterstützen
          </a>
        </div>
      </section>
    </main>
  );
}
