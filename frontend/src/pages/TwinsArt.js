import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import axios from 'axios';
import Lightbox from '../components/Lightbox';
import { useTheme } from '../context/ThemeContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function TwinsArt() {
  const [images, setImages] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTag, setSelectedTag] = useState('Alle');
  const { theme } = useTheme();

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
    <main id="main-content" className="pt-14">
      {/* Hero */}
      <section className="section-padding" data-testid="twins-art-hero">
        <div className="container-width text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-4 tracking-tight">
              Twins-Art
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Anonyme Familienkunst aus Liebe zu unseren Kindern.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      {allTags.length > 1 && (
        <section className="pb-8" data-testid="gallery-filters">
          <div className="container-width">
            <div className="flex flex-wrap justify-center gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                    selectedTag === tag
                      ? 'bg-foreground text-background'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
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

      {/* Gallery */}
      <section className="section-padding pt-0" data-testid="gallery-section">
        <div className="container-width">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => openLightbox(index)}
                data-testid={`gallery-item-${index}`}
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="section-padding bg-secondary/30" data-testid="support-section">
        <div className="container-width text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
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
            data-testid="paypal-support-btn"
          >
            <Heart className="w-4 h-4" />
            Unterstützen
          </a>

          <p className="text-[10px] text-muted-foreground mt-6 max-w-md mx-auto" data-testid="legal-disclaimer">
            Dies ist keine Spende im steuerlichen Sinne. Es erfolgt keine Gegenleistung. 
            100% freiwillige Unterstützung für unser Familienprojekt.
          </p>
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
