import { useTheme } from '../context/ThemeContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

/**
 * PageBackground - Wiederverwendbare Hintergrund-Komponente für alle Seiten
 * Unterstützt: Bild, Video, Theme-basierte Hintergründe
 */
export default function PageBackground({ 
  backgroundType = 'default', // 'none', 'default', 'image', 'video'
  backgroundUrl = '',
  overlay = 0.4, // 0-1 Opacity
  className = '',
  children 
}) {
  const { theme } = useTheme();
  const { settings } = useSiteSettings();

  // Default backgrounds from site settings
  const defaultLightBg = settings.lightBackground || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920';
  const defaultDarkBg = settings.darkBackground || 'https://images.unsplash.com/photo-1516572704891-60b47497c7b5?w=1920';

  // Determine which background to use
  const getBackgroundStyle = () => {
    if (backgroundType === 'none') {
      return {};
    }

    let bgUrl = backgroundUrl;
    
    if (backgroundType === 'default' || (!bgUrl && backgroundType === 'image')) {
      bgUrl = theme === 'dark' ? defaultDarkBg : defaultLightBg;
    }

    if (backgroundType === 'video') {
      return {}; // Video is handled separately
    }

    if (bgUrl) {
      return {
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }

    return {};
  };

  const isVideo = backgroundType === 'video' && backgroundUrl;
  const hasBackground = backgroundType !== 'none';

  return (
    <div className={`relative ${className}`}>
      {/* Background Layer */}
      {hasBackground && (
        <div className="fixed inset-0 -z-10">
          {isVideo ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={backgroundUrl} type="video/mp4" />
            </video>
          ) : (
            <div 
              className="absolute inset-0 w-full h-full"
              style={getBackgroundStyle()}
            />
          )}
          
          {/* Overlay */}
          {overlay > 0 && (
            <div 
              className={`absolute inset-0 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
              style={{ opacity: overlay }}
            />
          )}
        </div>
      )}
      
      {/* Content */}
      {children}
    </div>
  );
}

/**
 * PageHero - Hero-Sektion mit professionellem Hintergrund
 * Mit sanftem Gradient-Übergang wie bei der Landing Page
 */
export function PageHero({
  label,
  title,
  description,
  backgroundType = 'default',
  backgroundUrl = '',
  overlay = 0.5,
  gradientStrength = 'normal', // 'light', 'normal', 'strong'
  children
}) {
  const { theme } = useTheme();
  const { settings } = useSiteSettings();

  const defaultLightBg = settings.lightBackground || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920';
  const defaultDarkBg = settings.darkBackground || 'https://images.unsplash.com/photo-1516572704891-60b47497c7b5?w=1920';

  let bgUrl = backgroundUrl;
  if (backgroundType === 'default' || (!bgUrl && backgroundType !== 'none')) {
    bgUrl = theme === 'dark' ? defaultDarkBg : defaultLightBg;
  }

  const isVideo = backgroundType === 'video' && backgroundUrl;
  const hasBackground = backgroundType !== 'none' && bgUrl;

  // Gradient classes based on strength
  const getGradientClasses = () => {
    const baseGradient = theme === 'dark' 
      ? 'from-black via-black/60 to-background'
      : 'from-white via-white/60 to-background';
    
    switch (gradientStrength) {
      case 'light':
        return theme === 'dark'
          ? 'from-black/50 via-black/30 to-background'
          : 'from-white/50 via-white/30 to-background';
      case 'strong':
        return theme === 'dark'
          ? 'from-black/90 via-black/70 to-background'
          : 'from-white/90 via-white/70 to-background';
      default:
        return baseGradient;
    }
  };

  return (
    <section className="relative min-h-[50vh] flex items-center overflow-hidden">
      {/* Background */}
      {hasBackground && (
        <div className="absolute inset-0">
          {isVideo ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={backgroundUrl} type="video/mp4" />
            </video>
          ) : (
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${bgUrl})` }}
            />
          )}
          
          {/* Smooth Gradient Overlay - wie bei Landing Page */}
          <div 
            className={`absolute inset-0 bg-gradient-to-b ${getGradientClasses()}`}
            style={{ opacity: overlay > 0 ? 1 : 0 }}
          />
          
          {/* Additional fade at bottom for seamless transition */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
          />
        </div>
      )}

      {/* Content */}
      <div className="container-width relative z-10 py-20 pt-32">
        <div className="max-w-3xl">
          {label && (
            <span className="text-sm font-medium text-primary uppercase tracking-wide">
              {label}
            </span>
          )}
          {title && (
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
