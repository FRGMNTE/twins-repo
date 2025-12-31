import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Button } from '../components/ui/button';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API}/pages/${slug}`);
        setPage(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Seite nicht gefunden');
        } else {
          setError('Fehler beim Laden der Seite');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <main id="main-content" className="min-h-screen pt-20">
        <div className="container-width py-16">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main id="main-content" className="min-h-screen pt-20">
        <div className="container-width py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-3xl font-semibold text-foreground mb-4">{error}</h1>
            <p className="text-muted-foreground mb-8">
              Die angeforderte Seite existiert nicht oder wurde noch nicht veröffentlicht.
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück zur Startseite
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen pt-20">
      {/* Hero Section */}
      {page.heroImage && (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={page.heroImage} 
            alt={page.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <div className="container-width py-12 md:py-16">
        <motion.article 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Page Title */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {page.title}
            </h1>
            {page.metaDescription && (
              <p className="text-lg text-muted-foreground">
                {page.metaDescription}
              </p>
            )}
            {page.updated_at && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                <Calendar className="w-3 h-3" />
                Zuletzt aktualisiert: {new Date(page.updated_at).toLocaleDateString('de-DE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            )}
          </header>

          {/* Page Content */}
          <div 
            className="prose prose-neutral dark:prose-invert max-w-none
              prose-headings:text-foreground prose-headings:font-semibold
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground
              prose-li:marker:text-muted-foreground
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
              prose-code:text-foreground prose-code:bg-secondary prose-code:px-1 prose-code:rounded
              prose-pre:bg-secondary prose-pre:border prose-pre:border-border"
            dangerouslySetInnerHTML={{ __html: formatContent(page.content) }}
          />
        </motion.article>
      </div>
    </main>
  );
}

// Helper function to format content (supports basic HTML and Markdown-like syntax)
function formatContent(content) {
  if (!content) return '';
  
  // If content already contains HTML tags, return as-is
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content;
  }
  
  // Basic Markdown-like formatting
  let formatted = content
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');
  
  // Wrap in paragraph if not already wrapped
  if (!formatted.startsWith('<')) {
    formatted = '<p>' + formatted + '</p>';
  }
  
  return formatted;
}
