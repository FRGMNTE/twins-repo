import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, ChevronLeft, Calendar, Newspaper, Heart, Baby, Plane, Palette, Image } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Category cards with icons
const CATEGORY_CARDS = [
  { id: '1', title: 'Schwangerschaft', description: 'Zwillings-Schwangerschaft erleben', link: '/schwangerschaft', icon: Heart },
  { id: '2', title: 'Baby-Alltag', description: 'Routinen & Herausforderungen', link: '/baby-alltag', icon: Baby },
  { id: '3', title: 'Tipps & Tricks', description: 'Praktische Ratschläge', link: '/tipps', icon: ChevronRight },
  { id: '4', title: 'Reisen', description: 'Unterwegs mit Zwillingen', link: '/reisen', icon: Plane },
  { id: '5', title: 'M&O Portfolio', description: 'Unsere Kunstwerke', link: '/twins-art', icon: Palette },
];

export default function Home() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [landingContent, setLandingContent] = useState(null);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const { theme } = useTheme();
  const { settings } = useSiteSettings();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.post(`${API}/seed`);
        const [blogRes, newsRes, landingRes, galleryRes] = await Promise.all([
          axios.get(`${API}/blog?limit=4`),
          axios.get(`${API}/news`),
          axios.get(`${API}/landing-content`).catch(() => ({ data: null })),
          axios.get(`${API}/gallery`).catch(() => ({ data: [] }))
        ]);
        setBlogPosts(blogRes.data);
        setNewsItems(newsRes.data);
        setGalleryImages(galleryRes.data || []);
        if (landingRes.data) {
          setLandingContent(landingRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // News carousel auto-advance
  useEffect(() => {
    if (newsItems.length <= 1) return;
    const interval = landingContent?.news_autoplay_interval || 10;
    
    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [newsItems.length, landingContent?.news_autoplay_interval]);

  // Gallery carousel auto-advance (every 10 seconds)
  useEffect(() => {
    const carouselImages = getCarouselImages();
    if (carouselImages.length <= 1) return;
    const interval = landingContent?.gallery_autoplay_interval || 10;
    
    const timer = setInterval(() => {
      setCurrentGalleryIndex((prev) => (prev + 1) % carouselImages.length);
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [galleryImages, landingContent?.gallery_carousel_images, landingContent?.gallery_autoplay_interval]);

  // Get carousel images - either selected ones or all gallery images
  const getCarouselImages = useCallback(() => {
    if (landingContent?.gallery_carousel_images?.length > 0) {
      // Use selected images from admin
      const selectedIds = landingContent.gallery_carousel_images;
      return galleryImages.filter(img => selectedIds.includes(img.id));
    }
    // Default: use all gallery images
    return galleryImages;
  }, [galleryImages, landingContent?.gallery_carousel_images]);

  const nextNews = useCallback(() => {
    setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
  }, [newsItems.length]);

  const prevNews = useCallback(() => {
    setCurrentNewsIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  }, [newsItems.length]);

  const goToNews = useCallback((index) => {
    setCurrentNewsIndex(index);
  }, []);

  // Landing content values with fallbacks
  const lc = landingContent || {};
  const heroEnabled = lc.hero_enabled !== false;
  const featuresEnabled = lc.features_enabled !== false;
  const newsEnabled = lc.news_enabled !== false;
  const categoriesEnabled = lc.categories_enabled !== false;
  const blogEnabled = lc.blog_enabled !== false;
  const ctaEnabled = lc.cta_enabled !== false;

  return (
    <main id="main-content">
      {/* Hero Section - Professional Design */}
      {heroEnabled && (
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background with Parallax Effect or Video */}
        <div className="absolute inset-0">
          {lc.hero_background_type === 'video' && lc.hero_background_url ? (
            <video 
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay={lc.hero_video_autoplay !== false}
              loop={lc.hero_video_loop !== false}
              muted={lc.hero_video_muted !== false}
              playsInline
            >
              <source src={lc.hero_background_url} type="video/mp4" />
            </video>
          ) : theme === 'dark' ? (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-fixed"
              style={{ backgroundImage: `url(${lc.hero_background_type === 'image' && lc.hero_background_url ? lc.hero_background_url : (settings.darkBackground || 'https://images.unsplash.com/photo-1516572704891-60b47497c7b5?w=1920')})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
            </div>
          ) : (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-fixed"
              style={{ backgroundImage: `url(${lc.hero_background_type === 'image' && lc.hero_background_url ? lc.hero_background_url : (settings.lightBackground || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920')})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
            </div>
          )}
          {lc.hero_background_type === 'video' && (
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          )}
        </div>

        <div className="relative z-10 container-width text-center py-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/20 text-sm text-foreground mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {lc.hero_label || settings.heroLabel || 'Willkommen bei unserer Familie'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold text-foreground mb-6 tracking-tight"
          >
            {lc.hero_title || settings.heroTitle || 'gltz.de'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-muted-foreground mb-4 font-light"
          >
            {lc.hero_subtitle || settings.heroSubtitle || 'Unsere Reise mit Zwillingen'}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {lc.hero_description || settings.heroDescription || 'Anonyme Tipps, ehrliche Erfahrungen und kreative Momente – von einer Familie für Familien.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to={lc.hero_cta_link || "/ueber-uns"} className="btn-primary group">
              {lc.hero_cta_text || "Uns kennenlernen"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            {lc.hero_secondary_cta_text && (
              <Link to={lc.hero_secondary_cta_link || "/blog"} className="btn-secondary">
                {lc.hero_secondary_cta_text}
              </Link>
            )}
            {!lc.hero_secondary_cta_text && (
              <Link to="/blog" className="btn-secondary">
                Blog lesen
              </Link>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-foreground/50"
            />
          </div>
        </motion.div>
      </section>
      )}

      {/* News Carousel Section */}
      {newsEnabled && newsItems.length > 0 && (
        <section className="py-6 bg-foreground/5 border-y border-border">
          <div className="container-width">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground shrink-0">
                <Newspaper className="w-4 h-4" />
                <span className="hidden sm:inline">{lc.news_title || 'Aktuelles'}</span>
              </div>
              
              <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentNewsIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-4"
                  >
                    {newsItems[currentNewsIndex] && (
                      <Link 
                        to={newsItems[currentNewsIndex].link_url || '/blog'}
                        className="flex items-center gap-4 group flex-1 min-w-0"
                      >
                        {newsItems[currentNewsIndex].image_url && (
                          <img 
                            src={newsItems[currentNewsIndex].image_url} 
                            alt={newsItems[currentNewsIndex].title}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {newsItems[currentNewsIndex].title}
                          </p>
                          {newsItems[currentNewsIndex].subtitle && (
                            <p className="text-xs text-muted-foreground truncate">
                              {newsItems[currentNewsIndex].subtitle}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                      </Link>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              {newsItems.length > 1 && (
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={prevNews}
                    className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors"
                    aria-label="Vorherige Nachricht"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex gap-1">
                    {newsItems.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToNews(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === currentNewsIndex ? 'bg-foreground' : 'bg-foreground/30'
                        }`}
                        aria-label={`Nachricht ${idx + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button 
                    onClick={nextNews}
                    className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors"
                    aria-label="Nächste Nachricht"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-semibold text-foreground mb-4"
            >
              Entdecke unsere Welt
            </motion.h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Von der Schwangerschaft bis zum Alltag – hier teilen wir unsere Erfahrungen als Zwillingsfamilie.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORY_CARDS.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={card.link} className="block group h-full">
                    <div className="relative p-8 rounded-2xl border border-border bg-card hover:bg-secondary/50 transition-all duration-300 h-full overflow-hidden">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6 text-foreground" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {card.description}
                      </p>
                      
                      <span className="inline-flex items-center text-sm font-medium text-foreground group-hover:gap-2 transition-all">
                        Entdecken <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      {blogPosts.length > 0 && (
        <section className="section-padding bg-secondary/30">
          <div className="container-width">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-4xl font-semibold text-foreground mb-2"
                >
                  Aus dem Blog
                </motion.h2>
                <p className="text-muted-foreground">Aktuelle Beiträge und Erfahrungen</p>
              </div>
              <Link to="/blog" className="btn-ghost shrink-0">
                Alle Beiträge <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Featured Latest Post */}
            {blogPosts[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <Link to={`/blog/${blogPosts[0].id}`} className="group block">
                  <div className="grid md:grid-cols-2 gap-8 p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors">
                    {blogPosts[0].image_url && (
                      <div className="aspect-[16/10] rounded-xl overflow-hidden">
                        <img
                          src={blogPosts[0].image_url}
                          alt={blogPosts[0].title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-col justify-center">
                      <span className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wide mb-3">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Neuester Beitrag
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                        {blogPosts[0].title}
                      </h3>
                      {blogPosts[0].excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {blogPosts[0].excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        {blogPosts[0].category && (
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {blogPosts[0].category}
                          </span>
                        )}
                        {blogPosts[0].publish_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(blogPosts[0].publish_date).toLocaleDateString('de-DE')}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center text-sm font-medium text-foreground group-hover:text-primary">
                        Weiterlesen <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Other Posts Grid */}
            {blogPosts.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.slice(1).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/blog/${post.id}`} className="block">
                    {post.image_url && (
                      <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">
                        {post.category}
                      </span>
                      {post.publish_date && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.publish_date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </Link>
                </motion.article>
              ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery Carousel Section */}
      {(landingContent?.gallery_carousel_enabled !== false) && getCarouselImages().length > 0 && (
        <section className="section-padding bg-secondary/30">
          <div className="container-width">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary uppercase tracking-wide mb-4">
                <Image className="w-4 h-4" />
                {landingContent?.gallery_carousel_title || 'Galerie'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {landingContent?.gallery_carousel_subtitle || 'Einblicke in unseren Alltag'}
              </h2>
            </motion.div>

            {/* Carousel */}
            <div className="relative">
              <div className="aspect-[21/9] sm:aspect-[3/1] rounded-2xl overflow-hidden relative bg-secondary">
                <AnimatePresence mode="wait">
                  {getCarouselImages()[currentGalleryIndex] && (
                    <motion.img
                      key={currentGalleryIndex}
                      src={getCarouselImages()[currentGalleryIndex].url}
                      alt={getCarouselImages()[currentGalleryIndex].title || 'Galerie Bild'}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7 }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </AnimatePresence>

                {/* Caption Overlay */}
                {getCarouselImages()[currentGalleryIndex]?.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <p className="text-white font-medium text-lg">
                      {getCarouselImages()[currentGalleryIndex].title}
                    </p>
                    {getCarouselImages()[currentGalleryIndex].caption && (
                      <p className="text-white/80 text-sm mt-1">
                        {getCarouselImages()[currentGalleryIndex].caption}
                      </p>
                    )}
                  </div>
                )}

                {/* Navigation Arrows */}
                {getCarouselImages().length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentGalleryIndex((prev) => (prev - 1 + getCarouselImages().length) % getCarouselImages().length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                      aria-label="Vorheriges Bild"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentGalleryIndex((prev) => (prev + 1) % getCarouselImages().length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                      aria-label="Nächstes Bild"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Dots Indicator */}
              {getCarouselImages().length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {getCarouselImages().map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentGalleryIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentGalleryIndex 
                          ? 'bg-foreground w-8' 
                          : 'bg-foreground/30 hover:bg-foreground/50'
                      }`}
                      aria-label={`Bild ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Link to full gallery */}
            <div className="text-center mt-6">
              <Link 
                to="/twins-art" 
                className="inline-flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Alle Bilder ansehen <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Support CTA Section */}
      <section className="section-padding bg-gradient-to-b from-background to-secondary/20">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-foreground" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              {settings.ctaTitle || 'Projekt unterstützen'}
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {settings.ctaDescription || 'Unsere Inhalte sind kostenlos und werden es bleiben. Wenn dir unsere Tipps helfen, freuen wir uns über eine kleine Unterstützung.'}
            </p>
            
            <a
              href={settings.paypalLink || 'https://paypal.me/gltzfamily'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              <Heart className="w-4 h-4 mr-2" />
              {settings.ctaButtonText || 'Unterstützen'}
            </a>
            
            <p className="text-xs text-muted-foreground mt-4">
              {settings.donationDisclaimer || '100% freiwillig – keine Gegenleistung'}
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
