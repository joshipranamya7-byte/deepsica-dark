import { motion } from 'framer-motion'
import BatmanLogo from './BatmanLogo'

export default function Navbar({ theme, onToggleTheme }) {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4"
      style={{
        background: 'linear-gradient(180deg, rgba(10,10,15,0.95) 0%, transparent 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(245,208,32,0.1)',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <BatmanLogo size={36} color="#f5d020" glow />
        <div>
          <span
            className="glow-yellow"
            style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', letterSpacing: '0.1em', color: '#f5d020' }}
          >
            DEEPSICA
          </span>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: '#555577', letterSpacing: '0.2em' }}>
            DARK EDITION
          </div>
        </div>
      </div>

      {/* Status + theme toggle */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#555577' }}>
            PARTICLE ENGINE LIVE
          </span>
        </div>

        <button
          onClick={onToggleTheme}
          className="px-3 py-1.5 rounded transition-all duration-300 hover:scale-105"
          style={{
            border: '1px solid rgba(245,208,32,0.3)',
            fontFamily: 'Rajdhani',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#f5d020',
            letterSpacing: '0.1em',
            background: 'rgba(245,208,32,0.05)',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀ LIGHT' : '🌑 DARK'}
        </button>
      </div>
    </motion.nav>
  )
}