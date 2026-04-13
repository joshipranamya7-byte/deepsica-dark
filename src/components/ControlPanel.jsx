import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BatmanLogo from './BatmanLogo'

const SHAPES = [
  { id: 'heart',   label: 'HEART',   icon: null,  batIcon: false },
  { id: 'batman',  label: 'BAT',     icon: null,  batIcon: true  },
  { id: 'text',    label: 'TEXT',    icon: '✦',   batIcon: false },
  { id: 'star',    label: 'BURST',   icon: '✦',   batIcon: false },
  { id: 'scatter', label: 'EXPLODE', icon: '⊹',   batIcon: false },
]

const PRESETS = ['GOTHAM', 'SHADOWS', 'DARKKNIGHT', 'VIGILANTE', 'ARKHAM']

export default function ControlPanel({ onMorph, activeShape }) {
  const [inputText, setInputText] = useState('AMAN BHOSADIWALA')
  const [particleCount, setParticleCount] = useState(3500)

  const handleTextMorph = () => {
    if (inputText.trim()) onMorph('text', inputText.trim())
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: 'linear-gradient(0deg, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.85) 80%, transparent 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(245,208,32,0.08)',
        padding: '20px 24px 28px',
      }}
    >
      {/* Shape buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {SHAPES.map((shape) => (
          <motion.button
            key={shape.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMorph(shape.id)}
            className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-300"
            style={{
              border: `1px solid ${activeShape === shape.id ? '#f5d020' : 'rgba(245,208,32,0.15)'}`,
              background: activeShape === shape.id ? 'rgba(245,208,32,0.12)' : 'rgba(255,255,255,0.02)',
              fontFamily: 'Rajdhani',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: activeShape === shape.id ? '#f5d020' : '#666688',
              boxShadow: activeShape === shape.id ? '0 0 20px rgba(245,208,32,0.2)' : 'none',
            }}
            aria-label={`Morph to ${shape.label} shape`}
          >
            {shape.batIcon
              ? <BatmanLogo size={14} color={activeShape === shape.id ? '#f5d020' : '#666688'} />
              : shape.icon && <span>{shape.icon}</span>
            }
            {shape.label}
          </motion.button>
        ))}
      </div>

      {/* Text input row */}
      <div className="flex gap-2 max-w-xl mx-auto mb-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value.toUpperCase().slice(0, 16))}
          onKeyDown={(e) => e.key === 'Enter' && handleTextMorph()}
          placeholder="TYPE ANYTHING..."
          maxLength={16}
          className="flex-1 px-4 py-2.5 rounded"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(245,208,32,0.2)',
            fontFamily: 'Bebas Neue',
            fontSize: '1.1rem',
            letterSpacing: '0.2em',
            color: '#f5d020',
            caretColor: '#f5d020',
          }}
          aria-label="Enter text to convert to particles"
        />
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleTextMorph}
          className="px-5 py-2.5 rounded"
          style={{
            background: 'linear-gradient(135deg, #f5d020, #c9a227)',
            fontFamily: 'Rajdhani',
            fontWeight: 700,
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            color: '#0a0a0f',
            border: 'none',
          }}
          aria-label="Render text as particles"
        >
          RENDER
        </motion.button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap justify-center gap-2">
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: '#444466', letterSpacing: '0.1em', alignSelf: 'center' }}>
          PRESETS:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => { setInputText(preset); onMorph('text', preset) }}
            className="px-2 py-1 rounded text-xs transition-colors duration-200 hover:text-yellow-300"
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              color: '#444466',
              border: '1px solid rgba(255,255,255,0.05)',
              background: 'transparent',
            }}
          >
            {preset}
          </button>
        ))}
      </div>
    </motion.div>
  )
}