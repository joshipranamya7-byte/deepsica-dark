import { useRef, useEffect, useCallback } from 'react'
import { sampleHeart, sampleBatman, sampleText, sampleStar, sampleScatter, lerp, rand } from '../utils/particleutils'

const PARTICLE_COUNT = 3500
const COLORS = {
  heart:  ['#f5d020', '#c9a227', '#ffec6e', '#e5b800'],
  batman: ['#00d4ff', '#0099bb', '#33e5ff', '#66edff'],
  text:   ['#e040fb', '#ba68c8', '#ce93d8', '#f8bbd0'],
  star:   ['#f5d020', '#00d4ff', '#e040fb'],
  scatter:['#444466', '#2a2a4a', '#333355'],
}

export function useParticleEngine(canvasRef) {
  const particlesRef = useRef([])
  const animRef      = useRef(null)
  const mouseRef     = useRef({ x: -9999, y: -9999, down: false })
  const stateRef     = useRef('heart') // 'heart' | 'batman' | 'text' | 'star' | 'scatter'
  const targetTextRef = useRef('DEEPSICA')

  // ─── Particle class ────────────────────────────────────────────────────────
  function createParticle(x, y, tx, ty, colorSet) {
    return {
      x,  y,
      tx, ty,
      vx: rand(-3, 3),
      vy: rand(-3, 3),
      alpha: rand(0.4, 1),
      size:  rand(1, 3),
      color: colorSet[Math.floor(Math.random() * colorSet.length)],
      // Stagger approach speed
      delay: rand(0, 0.5),
      speed: rand(0.04, 0.12),
    }
  }

  // ─── Spawn initial particles ───────────────────────────────────────────────
  const spawnParticles = useCallback((canvas, shape, text) => {
    const cx = canvas.width  / 2
    const cy = canvas.height / 2
    const scale = Math.min(canvas.width, canvas.height) / 500

    let targets
    let colorSet

    switch (shape) {
      case 'batman':
        targets  = sampleBatman(PARTICLE_COUNT, cx, cy, scale * 60)
        colorSet = COLORS.batman
        break
      case 'text':
        targets  = sampleText(text || targetTextRef.current, PARTICLE_COUNT, cx, cy, Math.max(60, scale * 100))
        colorSet = COLORS.text
        break
      case 'star':
        targets  = sampleStar(PARTICLE_COUNT, cx, cy, scale * 100, scale * 45)
        colorSet = COLORS.star
        break
      case 'scatter':
        targets  = sampleScatter(PARTICLE_COUNT, cx, cy, scale * 200)
        colorSet = COLORS.scatter
        break
      default: // heart
        targets  = sampleHeart(PARTICLE_COUNT, cx, cy, scale * 8)
        colorSet = COLORS.heart
    }

    particlesRef.current = targets.map((t, i) => {
      const existing = particlesRef.current[i]
      // If particle exists, morph from current position
      const sx = existing ? existing.x : rand(0, canvas.width)
      const sy = existing ? existing.y : rand(0, canvas.height)
      return createParticle(sx, sy, t.tx, t.ty, colorSet)
    })
    stateRef.current = shape
  }, [])

  // ─── Main render loop ──────────────────────────────────────────────────────
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext('2d')
    const mouse  = mouseRef.current

    // Fade trail
    ctx.fillStyle = 'rgba(10,10,15,0.18)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const mx = mouse.x
    const my = mouse.y
    const repelRadius = mouse.down ? 120 : 80
    const repelForce  = mouse.down ? 8   : 4

    for (const p of particlesRef.current) {
      if (p.delay > 0) { p.delay -= 0.016; continue }

      // ── Physics ──────────────────────────────────────────────
      const dx = mx - p.x
      const dy = my - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < repelRadius) {
        // Antigravity repulsion
        const force = (repelRadius - dist) / repelRadius
        const angle = Math.atan2(dy, dx)
        p.vx -= Math.cos(angle) * force * repelForce
        p.vy -= Math.sin(angle) * force * repelForce
      }

      // Spring towards target
      const tdx = p.tx - p.x
      const tdy = p.ty - p.y
      p.vx += tdx * p.speed
      p.vy += tdy * p.speed

      // Damping
      p.vx *= 0.88
      p.vy *= 0.88

      p.x += p.vx
      p.y += p.vy

      // ── Draw ─────────────────────────────────────────────────
      const distToTarget = Math.sqrt(tdx * tdx + tdy * tdy)
      const alpha = Math.min(1, p.alpha * (0.3 + 0.7 * (1 - Math.min(distToTarget / 200, 1))))

      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle   = p.color

      // Glow for particles near target
      if (distToTarget < 30) {
        ctx.shadowBlur  = 8
        ctx.shadowColor = p.color
      }

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    animRef.current = requestAnimationFrame(render)
  }, [canvasRef])

  // ─── Setup ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      spawnParticles(canvas, stateRef.current, targetTextRef.current)
    }

    resize()
    window.addEventListener('resize', resize)
    animRef.current = requestAnimationFrame(render)

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      mouseRef.current.x = clientX - rect.left
      mouseRef.current.y = clientY - rect.top
    }
    const onDown = () => { mouseRef.current.down = true  }
    const onUp   = () => { mouseRef.current.down = false }
    const onLeave = () => { mouseRef.current.x = -9999; mouseRef.current.y = -9999 }

    canvas.addEventListener('mousemove',  onMove)
    canvas.addEventListener('touchmove',  onMove, { passive: true })
    canvas.addEventListener('mousedown',  onDown)
    canvas.addEventListener('touchstart', onDown, { passive: true })
    canvas.addEventListener('mouseup',    onUp)
    canvas.addEventListener('touchend',   onUp)
    canvas.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
      canvas.removeEventListener('mousemove',  onMove)
      canvas.removeEventListener('touchmove',  onMove)
      canvas.removeEventListener('mousedown',  onDown)
      canvas.removeEventListener('touchstart', onDown)
      canvas.removeEventListener('mouseup',    onUp)
      canvas.removeEventListener('touchend',   onUp)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [canvasRef, render, spawnParticles])

  // ─── Public API ───────────────────────────────────────────────────────────
  const morphTo = useCallback((shape, text) => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (text) targetTextRef.current = text.toUpperCase()
    spawnParticles(canvas, shape, text)
  }, [canvasRef, spawnParticles])

  return { morphTo, stateRef }
}