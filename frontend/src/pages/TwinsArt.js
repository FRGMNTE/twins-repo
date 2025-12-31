import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Palette, Lock } from 'lucide-react';
import axios from 'axios';
import Lightbox from '../components/Lightbox';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function TwinsArt() {
  const [images, setImages] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTag, setSelectedTag] = useState('Alle');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API}/gallery`);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      }
    };
    fetchImages();
  }, []);

  const allTags = ['Alle', ...new Set(images.flatMap(img => img.tags || []))];

  const filteredImages = selectedTag === 'Alle' 
    ? images 
    : images.filter(img => img.tags?.includes(selectedTag));

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <main id="main-content" className="pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-card to-background" data-testid="twins-art-hero">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Palette className="w-16 h-16 text-[hsl(var(--twins-art))] mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
              Twins-Art
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">
              Das Projekt: Anonyme Familienkunst aus Liebe zu unseren Kindern.
              Die Kunst bringt Freude, Einnahmen bleiben 100% in der Familie.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tags */}
      {allTags.length > 1 && (
        <section className="py-8 bg-background" data-testid="gallery-filters">
          <div className="container-width">
            <div className="flex flex-wrap justify-center gap-3">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    selectedTag === tag
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
                  data-testid={`filter-${tag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="section-padding bg-background" data-testid="gallery-section">
        <div className="container-width">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
                onClick={() => openLightbox(index)}
                data-testid={`gallery-item-${index}`}
              >
                <div className="glass-card rounded-3xl overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">{image.alt}</p>
                    {image.tags && image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {image.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="section-padding bg-card" data-testid="support-section">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-8 sm:p-12 rounded-3xl text-center">
              <Heart className="w-16 h-16 text-[hsl(var(--twins-art))] mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Unterstütze unser Familienprojekt
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Warum? Die Kunst bringt Freude, Einnahmen bleiben 100% in der Familie 
                und fördern die kreative Entwicklung unserer Kinder.
              </p>

              <a
                href="https://paypal.me/gltzfamily"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg"
                data-testid="paypal-support-btn"
              >
                <Heart className="w-5 h-5" />
                Projekt unterstützen
              </a>

              {/* Legal Disclaimer */}
              <div className="mt-8 p-4 bg-secondary/50 rounded-xl" data-testid="legal-disclaimer">
                <div className="flex items-start gap-3 text-left">
                  <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Dies ist keine Spende im steuerlichen Sinne. Es erfolgt KEINE Gegenleistung 
                    (keine Ware/Dienstleistung). 100% freiwillige Unterstützung für unser Familienprojekt.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && filteredImages.length > 0 && (
        <Lightbox
          images={filteredImages}
          currentIndex={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </main>
  );
}
