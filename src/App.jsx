import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ParticleCanvas from './components/ParticleCanvas'
import Navbar from './components/Navbar'
import ControlPanel from './components/ControlPanel'
import ScanlineOverlay from './components/ScanlineOverlay'
import BatmanLogo from './components/BatmanLogo'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [activeShape, setActiveShape] = useState('heart')
  const engineRef = useRef(null)

  const handleEngineReady = useCallback((engine) => {
    engineRef.current = engine
  }, [])

  const handleMorph = useCallback((shape, text) => {
    setActiveShape(shape)
    if (engineRef.current) {
      engineRef.current.morphTo(shape, text)
    }
  }, [])

  const bgColor = theme === 'dark' ? '#0a0a0f' : '#0e0e18'

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: bgColor }}
    >
      {/* Atmospheric background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,208,32,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,208,32,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          style={{
            width: '50vmin',
            height: '50vmin',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,208,32,0.04) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Particle Canvas — fills entire screen */}
      <div className="absolute inset-0">
        <ParticleCanvas onEngineReady={handleEngineReady} />
      </div>

      {/* Scanline CRT overlay */}
      <ScanlineOverlay />

      {/* Navbar */}
      <Navbar theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />

      {/* Center hint text (fades after interaction) */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingBottom: '160px' }}
      >
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BatmanLogo size={20} color="#f5d02044" />
        </motion.div>
        <p
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            color: 'rgba(245,208,32,0.2)',
            marginTop: '12px',
          }}
        >
          HOVER TO INTERACT · CLICK TO EXPLODE
        </p>
      </motion.div>

      {/* Corner decorations */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <div
          key={corner}
          aria-hidden="true"
          className={`pointer-events-none absolute ${
            corner.includes('top') ? 'top-16' : 'bottom-24'
          } ${corner.includes('left') ? 'left-4' : 'right-4'}`}
          style={{
            width: '20px',
            height: '20px',
            borderTop:    corner.includes('top')    ? '1px solid rgba(245,208,32,0.2)' : 'none',
            borderBottom: corner.includes('bottom') ? '1px solid rgba(245,208,32,0.2)' : 'none',
            borderLeft:   corner.includes('left')   ? '1px solid rgba(245,208,32,0.2)' : 'none',
            borderRight:  corner.includes('right')  ? '1px solid rgba(245,208,32,0.2)' : 'none',
          }}
        />
      ))}

      {/* Control Panel */}
      <ControlPanel onMorph={handleMorph} activeShape={activeShape} />
    </div>
  )
}