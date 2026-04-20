import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export const DarkModeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  const spring = { type: "spring", stiffness: 700, damping: 30 };
  const iconSpring = { type: "spring", stiffness: 250, damping: 12 };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative flex items-center
        w-16 h-8 rounded-full p-1
        cursor-pointer border-none outline-none
        focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
        ${isDark
          ? 'bg-gradient-to-r from-indigo-950 via-slate-800 to-slate-900'
          : 'bg-gradient-to-r from-sky-300 via-amber-200 to-orange-300'
        }
      `}
      style={{
        boxShadow: isDark
          ? 'inset 0 2px 4px rgba(0,0,0,0.4), 0 0 12px rgba(99,102,241,0.15)'
          : 'inset 0 2px 4px rgba(0,0,0,0.1), 0 0 12px rgba(251,191,36,0.25)',
        transition: 'box-shadow 0.5s ease'
      }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      id="dark-mode-toggle"
    >
      {/* Stars for dark mode */}
      {[
        { top: '22%', left: '14%', delay: 0, size: 2 },
        { top: '60%', left: '26%', delay: 0.4, size: 1.5 },
        { top: '18%', left: '38%', delay: 0.8, size: 1 },
        { top: '72%', left: '16%', delay: 0.2, size: 1.5 },
      ].map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: isDark ? [0.3, 1, 0.3] : 0,
            scale: isDark ? [0.8, 1.3, 0.8] : 0,
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Cloud puffs for light mode */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 12, height: 6, bottom: '22%', right: '14%',
          borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.45)'
        }}
        animate={{
          opacity: isDark ? 0 : [0.3, 0.6, 0.3],
          x: isDark ? 5 : [3, -2, 3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 8, height: 4, bottom: '48%', right: '22%',
          borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)'
        }}
        animate={{
          opacity: isDark ? 0 : [0.2, 0.5, 0.2],
          x: isDark ? -5 : [-2, 3, -2],
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      />

      {/* Sliding knob */}
      <motion.div
        className="w-6 h-6 rounded-full flex items-center justify-center relative z-10"
        style={{
          background: isDark
            ? 'linear-gradient(145deg, #c7d2fe, #a5b4fc)'
            : 'linear-gradient(145deg, #fefce8, #fde68a)',
          boxShadow: isDark
            ? '0 2px 10px rgba(99,102,241,0.5), inset 0 -1px 2px rgba(0,0,0,0.1)'
            : '0 2px 10px rgba(251,191,36,0.5), inset 0 -1px 2px rgba(0,0,0,0.05)',
        }}
        animate={{ x: isDark ? 32 : 0 }}
        transition={spring}
      >
        {/* Sun/Moon morphing SVG */}
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          style={{ overflow: 'visible' }}
          animate={{ rotate: isDark ? 40 : 0 }}
          transition={iconSpring}
        >
          <defs>
            <mask id="theme-moon-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <motion.circle
                fill="black"
                r="9"
                animate={{
                  cx: isDark ? 17 : 33,
                  cy: isDark ? 6 : 0,
                }}
                transition={iconSpring}
              />
            </mask>
          </defs>

          {/* Sun body → Moon crescent */}
          <motion.circle
            cx="12"
            cy="12"
            mask="url(#theme-moon-mask)"
            animate={{
              r: isDark ? 9 : 5,
              fill: isDark ? '#6366f1' : '#f59e0b',
            }}
            transition={iconSpring}
          />

          {/* Sun rays - scale away when dark */}
          <motion.g
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{
              opacity: isDark ? 0 : 1,
              scale: isDark ? 0 : 1,
            }}
            transition={iconSpring}
            style={{ transformOrigin: '12px 12px' }}
          >
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </motion.g>
        </motion.svg>
      </motion.div>
    </motion.button>
  );
};
