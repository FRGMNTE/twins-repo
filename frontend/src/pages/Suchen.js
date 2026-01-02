import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, FileText, Layers, Image, X, FolderOpen } from 'lucide-react';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { PageHero } from '../components/PageBackground';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Suchen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ pages: [], posts: [], gallery: [], static_pages: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults({ pages: [], posts: [], gallery: [], static_pages: [] });
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const res = await axios.get(`${API}/search?q=${encodeURIComponent(query.trim())}`);
        setResults(res.data);
      } catch (error) {
        console.error('Search error:', error);
        setResults({ pages: [], posts: [], gallery: [], static_pages: [] });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const totalResults = results.pages.length + results.posts.length + results.gallery.length + results.static_pages.length;

  return (
    <main id="main-content" className="min-h-screen">
      <PageHero
        label="Suche"
        title="Inhalte durchsuchen"
        description=""
        backgroundType="default"
        overlay={0.5}
      >
        {/* Search Input */}
        <div className="relative mt-8 max-w-xl">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Was suchst du? (z.B. Zwilling, Schlaf, Tipps...)"
            className="pl-12 pr-10 py-4 text-lg rounded-full border-2"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-secondary rounded-full"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </PageHero>
            
      {/* Results Section */}
      <section className="section-padding bg-background">
        <div className="container-width">
          {query.trim().length === 1 && (
            <p className="text-sm text-muted-foreground mb-4">
              Bitte mindestens 2 Zeichen eingeben.
            </p>
          )}
          
          {hasSearched && query.trim().length >= 2 && (
            <p className="text-sm text-muted-foreground mb-4">
              {loading ? 'Suche...' : `${totalResults} Ergebnis${totalResults !== 1 ? 'se' : ''} gefunden`}
            </p>
          )}

          {!hasSearched ? (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Gib einen Suchbegriff ein, um zu starten.</p>
            </div>
          ) : totalResults === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Keine Ergebnisse für &quot;{query}&quot; gefunden.</p>
              <p className="text-sm text-muted-foreground mt-2">Versuche einen anderen Suchbegriff.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Static Pages (Schwangerschaft, Alltag, etc.) */}
              {results.static_pages.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                    <FolderOpen className="w-5 h-5" /> Themenseiten ({results.static_pages.length})
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.static_pages.map((page) => (
                      <Link
                        key={page.page_id}
                        to={page.path}
                        className="p-5 rounded-xl border border-border hover:bg-secondary/50 hover:border-primary/30 transition-all group"
                      >
                        <h3 className="font-semibold text-foreground group-hover:text-primary mb-1">{page.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{page.description}</p>
                        <span className="text-xs text-primary mt-2 inline-block">{page.path}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Pages */}
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
                            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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
