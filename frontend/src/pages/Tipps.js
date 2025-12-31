import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ChevronRight, Trees } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Tipps() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Alle');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API}/blog?limit=20`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const categories = ['Alle', ...new Set(posts.map(p => p.category))];
  
  const filteredPosts = selectedCategory === 'Alle' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

  const tipsList = [
    {
      category: 'Organisation',
      title: 'Doppelte Wickelstation',
      description: 'Richte zwei Wickelstationen ein – eine im Wohnbereich, eine im Schlafzimmer. Spart endlose Wege.',
    },
    {
      category: 'Schlaf',
      title: 'Synchronisierter Schlafrhythmus',
      description: 'Wenn ein Baby aufwacht, wecke das andere zum Füttern. So synchronisieren sich die Schlafzyklen.',
    },
    {
      category: 'Füttern',
      title: 'Fütterungsprotokoll',
      description: 'Eine einfache App oder Tabelle hilft, den Überblick zu behalten: Wer hat wann wie viel getrunken?',
    },
    {
      category: 'Haushalt',
      title: 'Mahlzeiten vorbereiten',
      description: 'Koche am Wochenende vor und friere Portionen ein. Unter der Woche bleibt so mehr Zeit für die Babys.',
    },
    {
      category: 'Mental Health',
      title: 'Hilfe annehmen',
      description: 'Sag JA, wenn jemand Hilfe anbietet. Jede freie Stunde ist wertvoll – nutze sie für dich.',
    },
    {
      category: 'Unterwegs',
      title: 'Zwillingswagen-Hacks',
      description: 'Hänge einen Haken an den Wagen für Taschen und nutze Organizer für Windeln, Tücher und Snacks.',
    },
  ];

  return (
    <main id="main-content" className="pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-green-50 dark:from-slate-900 to-background relative overflow-hidden" data-testid="tipps-page">
        <div className="absolute bottom-10 right-10 opacity-10">
          <Trees className="w-64 h-64 text-primary" />
        </div>
        <div className="container-width relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Lightbulb className="w-16 h-16 text-[hsl(var(--warning))] mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
              Tipps & Hacks
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Praktische Lösungen für den Zwillingsalltag – von Eltern für Eltern. 
              Was bei uns funktioniert, kann auch dir helfen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Schnelle Tipps
            </h2>
            <p className="text-muted-foreground">
              Unsere Top-Hacks für den Alltag mit Zwillingen
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tipsList.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 rounded-2xl"
              >
                <span className="text-xs font-medium text-primary uppercase tracking-wide">
                  {tip.category}
                </span>
                <h3 className="text-lg font-semibold text-foreground mt-2 mb-3">
                  {tip.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tip.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      {posts.length > 0 && (
        <section className="section-padding bg-card">
          <div className="container-width">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Ausführliche Beiträge
              </h2>
              <p className="text-muted-foreground mb-8">
                Tiefergehende Artikel zu verschiedenen Themen
              </p>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-accent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="glass-card rounded-3xl overflow-hidden"
                >
                  {post.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
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
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <button className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
                      Weiterlesen <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container-width text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Hast du einen Tipp für uns?
            </h2>
            <p className="text-muted-foreground mb-6">
              Teile deine Erfahrungen – wir freuen uns über jeden Beitrag!
            </p>
            <Link to="/kontakt" className="btn-primary">
              Tipp einreichen
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
