import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, FileText, Layers, Image, ArrowRight, X } from 'lucide-react';
import axios from 'axios';
import { Input } from '../components/ui/input';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Suchen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ pages: [], posts: [], gallery: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ pages: [], posts: [], gallery: [] });
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const [pagesRes, postsRes, galleryRes] = await Promise.all([
          axios.get(`${API}/pages`),
          axios.get(`${API}/blog`),
          axios.get(`${API}/gallery`)
        ]);

        const q = query.toLowerCase();
        
        const filteredPages = pagesRes.data.filter(p => 
          p.title.toLowerCase().includes(q) || 
          (p.content && p.content.toLowerCase().includes(q))
        );
        
        const filteredPosts = postsRes.data.filter(p => 
          p.title.toLowerCase().includes(q) || 
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
        
        const filteredGallery = galleryRes.data.filter(g => 
          g.title.toLowerCase().includes(q) || 
          (g.tags && g.tags.some(t => t.toLowerCase().includes(q)))
        );

        setResults({
          pages: filteredPages,
          posts: filteredPosts,
          gallery: filteredGallery
        });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const totalResults = results.pages.length + results.posts.length + results.gallery.length;

  return (
    <main id="main-content" className="min-h-screen pt-20">
      {/* Search Hero */}
      <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wide">Suche</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">
              Was suchst du?
            </h1>
            
            {/* Search Input */}
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Suche nach Tipps, Beiträgen, Bildern..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-10 h-14 text-lg rounded-xl"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {hasSearched && (
              <p className="text-sm text-muted-foreground mt-4">
                {loading ? 'Suche...' : `${totalResults} Ergebnis${totalResults !== 1 ? 'se' : ''} gefunden`}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding bg-background">
        <div className="container-width">
          {!hasSearched ? (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Gib einen Suchbegriff ein, um zu starten.</p>
            </div>
          ) : totalResults === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Keine Ergebnisse für "{query}" gefunden.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Pages */}
              {results.pages.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                    <FileText className="w-5 h-5" /> Seiten ({results.pages.length})
                  </h2>
                  <div className="grid gap-4">
                    {results.pages.map((page) => (
                      <Link
                        key={page.id}
                        to={`/${page.slug}`}
                        className="p-4 rounded-xl border border-border hover:bg-secondary/50 transition-colors group"
                      >
                        <h3 className="font-semibold text-foreground group-hover:text-primary">{page.title}</h3>
                        <p className="text-sm text-muted-foreground">/{page.slug}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts */}
              {results.posts.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                    <Layers className="w-5 h-5" /> Blog-Beiträge ({results.posts.length})
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.posts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.id}`}
                        className="group"
                      >
                        {post.image_url && (
                          <div className="aspect-video rounded-xl overflow-hidden mb-3">
                            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span className="text-xs text-primary font-medium">{post.category}</span>
                        <h3 className="font-semibold text-foreground group-hover:text-primary">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {results.gallery.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                    <Image className="w-5 h-5" /> Galerie ({results.gallery.length})
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {results.gallery.map((img) => (
                      <Link
                        key={img.id}
                        to="/twins-art"
                        className="aspect-square rounded-xl overflow-hidden group"
                      >
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
