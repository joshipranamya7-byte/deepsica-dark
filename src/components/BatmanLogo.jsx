// Minimal sleek Batman SVG logo component
export default function BatmanLogo({ size = 40, color = '#f5d020', glow = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 100 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Batman logo"
      style={glow ? { filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 20px ${color}66)` } : {}}
    >
      {/* Body/wings */}
      <path
        d="M50 55 
           C38 55 20 45 8 28 
           C16 30 24 26 28 18 
           C32 10 38 4 50 4 
           C62 4 68 10 72 18 
           C76 26 84 30 92 28 
           C80 45 62 55 50 55Z"
        fill={color}
      />
      {/* Ear tips */}
      <path d="M30 18 L22 2 L36 14Z" fill={color} />
      <path d="M70 18 L78 2 L64 14Z" fill={color} />
      {/* Body cutout */}
      <path
        d="M50 48 C40 48 28 40 22 30 C28 32 36 30 40 24 C43 18 46 15 50 15 C54 15 57 18 60 24 C64 30 72 32 78 30 C72 40 60 48 50 48Z"
        fill="#0a0a0f"
      />
    </svg>
  )
}