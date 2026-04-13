// CRT scanline + vignette overlay for atmosphere
export default function ScanlineOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    >
      {/* Scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
        }}
      />
      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />
      {/* Top chromatic aberration line */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #00d4ff44, #f5d02044, #e040fb44)',
        }}
      />
    </div>
  )
}