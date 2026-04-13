import { useRef, useEffect } from 'react'
import { useParticleEngine } from '../hooks/useParticleEngine'

export default function ParticleCanvas({ onEngineReady }) {
  const canvasRef = useRef(null)
  const { morphTo, stateRef } = useParticleEngine(canvasRef)

  useEffect(() => {
    if (onEngineReady) onEngineReady({ morphTo, stateRef })
  }, [morphTo, stateRef, onEngineReady])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ background: 'transparent' }}
      aria-label="Interactive particle canvas. Move your mouse to interact with particles."
      role="img"
    />
  )
}