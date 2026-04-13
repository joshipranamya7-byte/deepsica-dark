// ─── Shape Sampling Utilities ────────────────────────────────────────────────

/**
 * Sample points from a heart shape
 */
export function sampleHeart(count, cx, cy, scale = 1) {
  const points = []
  for (let i = 0; i < count; i++) {
    const t = (Math.random() * Math.PI * 2)
    // Heart parametric: x=16sin³t, y=13cost-5cos2t-2cos3t-cos4t
    const x = cx + scale * 16 * Math.pow(Math.sin(t), 3)
    const y = cy - scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    // Add noise for particle texture
    const noise = (Math.random() - 0.5) * scale * 0.8
    points.push({
      tx: x + noise * 0.3,
      ty: y + noise * 0.3
    })
  }
  return points
}

/**
 * Sample points from a Batman logo path
 */
export function sampleBatman(count, cx, cy, scale = 1) {
  const points = []
  // Bat wing bezier approximation
  for (let i = 0; i < count; i++) {
    const t = Math.random()
    let x, y
    if (t < 0.5) {
      // Left wing
      const u = t * 2
      x = cx - scale * (5 + 45 * u * (1 - u) * 0.5 + 40 * Math.pow(u, 2))
      y = cy - scale * (20 * Math.sin(u * Math.PI) * 0.8)
    } else {
      // Right wing
      const u = (t - 0.5) * 2
      x = cx + scale * (5 + 45 * u * (1 - u) * 0.5 + 40 * Math.pow(u, 2))
      y = cy - scale * (20 * Math.sin(u * Math.PI) * 0.8)
    }
    points.push({ tx: x + (Math.random() - 0.5) * scale * 0.4, ty: y + (Math.random() - 0.5) * scale * 0.4 })
  }
  return points
}

/**
 * Sample text pixels from canvas
 */
export function sampleText(text, count, cx, cy, fontSize, fontFamily = 'Bebas Neue') {
  const offscreen = document.createElement('canvas')
  offscreen.width = 800
  offscreen.height = 200
  const ctx = offscreen.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.font = `${fontSize}px "${fontFamily}"`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 400, 100)

  const imageData = ctx.getImageData(0, 0, 800, 200)
  const pixels = []
  for (let y = 0; y < 200; y += 2) {
    for (let x = 0; x < 800; x += 2) {
      const idx = (y * 800 + x) * 4
      if (imageData.data[idx + 3] > 128) {
        pixels.push({ tx: cx + (x - 400), ty: cy + (y - 100) })
      }
    }
  }

  // Randomly sample `count` pixels
  const result = []
  for (let i = 0; i < count; i++) {
    const p = pixels[Math.floor(Math.random() * pixels.length)]
    if (p) result.push({ ...p })
  }
  return result
}

/**
 * Sample a star/burst shape
 */
export function sampleStar(count, cx, cy, outerR, innerR, points = 5) {
  const pts = []
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() > 0.5 ? outerR : innerR
    pts.push({
      tx: cx + Math.cos(angle) * r * (0.8 + Math.random() * 0.4),
      ty: cy + Math.sin(angle) * r * (0.8 + Math.random() * 0.4)
    })
  }
  return pts
}

/**
 * Random scatter positions (explosion / idle noise)
 */
export function sampleScatter(count, cx, cy, radius) {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() * radius
    return {
      tx: cx + Math.cos(angle) * r,
      ty: cy + Math.sin(angle) * r
    }
  })
}

/**
 * Lerp helper
 */
export const lerp = (a, b, t) => a + (b - a) * t

/**
 * Random between two values
 */
export const rand = (min, max) => min + Math.random() * (max - min)