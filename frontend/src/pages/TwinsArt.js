import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, Grid, LayoutGrid, Filter, Heart } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORIES = ['Alle', 'Baby-Art', 'Abstrakt', 'Familie', 'Handabdrücke'];

export default function TwinsArt() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Alle');
  const [viewMode, setViewMode] = useState('grid'); // grid, masonry

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${API}/gallery`);
        setImages(res.data);
        setFilteredImages(res.data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (activeFilter === 'Alle') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => 
        img.tags && img.tags.some(tag => tag.toLowerCase().includes(activeFilter.toLowerCase()))
      ));
    }
  }, [activeFilter, images]);

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = '';
  };

  const navigateImage = (direction) => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    setSelectedImage(filteredImages[newIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateImage('next');
      if (e.key === 'ArrowLeft') navigateImage('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredImages]);

  return (
    <main id="main-content" className="min-h-screen pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wide">M&O Portfolio</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">
              Twins-Art Galerie
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Kleine Hände, große Kunst – hier zeigen wir die kreativen Werke unserer Zwillinge M & O. 
              Jedes Bild erzählt eine Geschichte.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & View Toggle */}
      <section className="py-6 border-b border-border sticky top-14 bg-background/95 backdrop-blur-sm z-30">
        <div className="container-width">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Filter className="w-4 h-4 text-muted-foreground self-center mr-2" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === cat
                      ? 'bg-foreground text-background'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                }`}
                title="Grid-Ansicht"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'masonry' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                }`}
                title="Masonry-Ansicht"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-background">
        <div className="container-width">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Keine Bilder gefunden.</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Standard Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(image)}
                >
                  <img
                    src={image.url}
                    alt={image.alt || image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium text-sm truncate">{image.title || 'Artwork'}</p>
                      {image.tags && image.tags.length > 0 && (
                        <p className="text-white/70 text-xs">{image.tags[0]}</p>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  {image.featured && (
                    <div className="absolute top-3 left-3">
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            /* Masonry Grid */
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative rounded-xl overflow-hidden cursor-pointer break-inside-avoid"
                  onClick={() => openLightbox(image)}
                >
                  <img
                    src={image.url}
                    alt={image.alt || image.title}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium text-sm truncate">{image.title || 'Artwork'}</p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Image Count */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            {filteredImages.length} Kunstwerk{filteredImages.length !== 1 ? 'e' : ''}
          </p>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={selectedImage.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-[90vw] max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.alt || selectedImage.title}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <h3 className="text-white font-semibold text-lg">{selectedImage.title || 'Artwork'}</h3>
                {selectedImage.caption && (
                  <p className="text-white/80 text-sm mt-1">{selectedImage.caption}</p>
                )}
                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedImage.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
