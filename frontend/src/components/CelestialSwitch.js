import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function CelestialSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full p-0.5 transition-all duration-300 ${
        isDark 
          ? 'bg-slate-700' 
          : 'bg-slate-200'
      }`}
      aria-label={isDark ? 'Zu Light Mode wechseln' : 'Zu Dark Mode wechseln'}
      data-testid="celestial-switch"
    >
      {/* Stars (Dark mode) */}
      {isDark && (
        <>
          <div className="absolute top-1.5 left-2 w-0.5 h-0.5 bg-white rounded-full opacity-80" />
          <div className="absolute top-3 left-3.5 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
          <div className="absolute bottom-1.5 left-2.5 w-0.5 h-0.5 bg-white rounded-full opacity-70" />
        </>
      )}

      {/* Toggle Circle */}
      <motion.div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isDark ? 'bg-slate-300' : 'bg-amber-400'
        }`}
        animate={{
          x: isDark ? 28 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          /* Moon */
          <div className="w-4 h-4 rounded-full bg-slate-200 relative">
            <div className="absolute top-0.5 left-1 w-1 h-1 bg-slate-300 rounded-full opacity-60" />
            <div className="absolute bottom-1 right-0.5 w-0.5 h-0.5 bg-slate-300 rounded-full opacity-40" />
          </div>
        ) : (
          /* Sun */
          <div className="w-4 h-4 rounded-full bg-amber-300" />
        )}
      </motion.div>
    </button>
  );
}
