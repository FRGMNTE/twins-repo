import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Tag, User, Clock } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API}/blog/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Beitrag nicht gefunden');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <main id="main-content" className="min-h-screen pt-20">
        <div className="container-width py-16 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main id="main-content" className="min-h-screen pt-20">
        <div className="container-width py-16 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Beitrag nicht gefunden</h1>
          <p className="text-muted-foreground mb-8">Der gewünschte Blogbeitrag existiert nicht.</p>
          <Link to="/blog" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zum Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen pt-20">
      {/* Hero with Image */}
      {post.image_url && (
        <section className="relative h-[40vh] min-h-[300px]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.image_url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        </section>
      )}

      {/* Content */}
      <section className={`section-padding bg-background ${!post.image_url ? 'pt-32' : '-mt-20 relative z-10'}`}>
        <div className="container-width">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {/* Back Link */}
            <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Zurück zum Blog
            </Link>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {post.category && (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  <Tag className="w-4 h-4" />
                  {post.category}
                </span>
              )}
              {post.publish_date && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publish_date).toLocaleDateString('de-DE', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              )}
              {post.author && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {post.content ? (
                <div 
                  className="text-foreground leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <p className="text-muted-foreground">Kein Inhalt verfügbar.</p>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-sm font-medium text-foreground mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-secondary text-sm text-muted-foreground rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share / CTA */}
            <div className="mt-12 p-6 rounded-2xl bg-secondary/50 border border-border text-center">
              <p className="text-muted-foreground mb-4">Hat dir dieser Beitrag gefallen?</p>
              <Link to="/kontakt" className="btn-primary">
                Schreib uns deine Gedanken
              </Link>
            </div>
          </motion.article>
        </div>
      </section>
    </main>
  );
}
