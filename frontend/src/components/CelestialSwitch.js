import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function CelestialSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-20 h-10 rounded-full p-1 transition-all duration-500 overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-900' 
          : 'bg-gradient-to-r from-sky-300 via-sky-400 to-blue-400'
      }`}
      aria-label={isDark ? 'Zu Light Mode wechseln' : 'Zu Dark Mode wechseln'}
      data-testid="celestial-switch"
    >
      {/* Stars (Dark mode) */}
      {isDark && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{ animationDelay: '0s' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute top-4 left-6 w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
            style={{ animationDelay: '0.3s' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-3 left-4 w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{ animationDelay: '0.6s' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="absolute top-3 left-8 w-0.5 h-0.5 bg-blue-200 rounded-full animate-twinkle"
            style={{ animationDelay: '0.9s' }}
          />
        </>
      )}

      {/* Clouds (Light mode) */}
      {!isDark && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.6, x: 0 }}
            className="absolute top-2 left-2 w-4 h-2 bg-white rounded-full"
          />
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.4, x: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute bottom-2 left-4 w-3 h-1.5 bg-white rounded-full"
          />
        </>
      )}

      {/* Toggle Circle - Sun or Moon */}
      <motion.div
        layout
        className={`relative w-8 h-8 rounded-full flex items-center justify-center ${
          isDark ? 'bg-slate-200' : 'bg-yellow-300'
        }`}
        animate={{
          x: isDark ? 40 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          /* Moon with craters */
          <motion.div 
            initial={{ rotate: -30 }}
            animate={{ rotate: 0 }}
            className="relative w-full h-full rounded-full overflow-hidden"
          >
            <div className="absolute top-1 left-2 w-2 h-2 bg-slate-300 rounded-full opacity-60" />
            <div className="absolute bottom-2 right-1 w-1.5 h-1.5 bg-slate-300 rounded-full opacity-40" />
            <div className="absolute top-3 right-2 w-1 h-1 bg-slate-300 rounded-full opacity-50" />
          </motion.div>
        ) : (
          /* Sun with rays */
          <div className="relative">
            {/* Sun rays */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-3 bg-yellow-400 rounded-full"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-10px)`,
                    opacity: 0.8,
                  }}
                />
              ))}
            </motion.div>
            {/* Sun face */}
            <div className="w-5 h-5 bg-yellow-200 rounded-full shadow-inner" />
          </div>
        )}
      </motion.div>
    </button>
  );
}
