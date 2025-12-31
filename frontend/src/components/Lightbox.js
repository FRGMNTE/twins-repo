import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Lightbox({ images, currentIndex, onClose, onNext, onPrev }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev]);

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Bildergalerie"
        data-testid="lightbox"
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          aria-label="Galerie schließen"
          data-testid="lightbox-close"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              aria-label="Vorheriges Bild"
              data-testid="lightbox-prev"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              aria-label="Nächstes Bild"
              data-testid="lightbox-next"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          </>
        )}

        <motion.div
          key={currentIndex}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-5xl max-h-[85vh] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentImage?.url}
            alt={currentImage?.alt}
            className="max-w-full max-h-[75vh] object-contain rounded-2xl"
          />
          <div className="mt-4 text-center">
            <p className="text-white/90 text-sm">{currentImage?.alt}</p>
            {currentImage?.tags && currentImage.tags.length > 0 && (
              <div className="flex justify-center gap-2 mt-2">
                {currentImage.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-white/10 text-white/80 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-white/50 text-xs mt-2">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
