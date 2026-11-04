/**
 * Hand-drawn-style brand illustrations (inline SVG, brand colours only).
 * They stand in for the illustration assets in the design canvas.
 */
type P = { className?: string };

const NERO = "#262626";
const CANVAS = "#F6EDDD";
const PEACOCK = "#FF007C";
const HONEY = "#E6A52A";

export function Bee({ className = "" }: P) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden="true">
      <g className="bee-wings">
        <ellipse cx="50" cy="26" rx="18" ry="24" transform="rotate(-24 50 26)" fill={CANVAS} stroke={NERO} strokeWidth="3" />
        <ellipse cx="70" cy="24" rx="15" ry="21" transform="rotate(18 70 24)" fill={CANVAS} stroke={NERO} strokeWidth="3" />
      </g>
      <ellipse cx="60" cy="56" rx="36" ry="24" fill={HONEY} stroke={NERO} strokeWidth="3" />
      <path d="M44 34 Q38 56 44 78" fill="none" stroke={NERO} strokeWidth="8" strokeLinecap="round" />
      <path d="M62 32 Q56 56 62 80" fill="none" stroke={NERO} strokeWidth="8" strokeLinecap="round" />
      <path d="M95 52 L110 56 L95 61 Z" fill={NERO} />
      <circle cx="30" cy="52" r="3.4" fill={NERO} />
      <path d="M22 40 Q14 26 22 18" fill="none" stroke={NERO} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 38 Q28 22 38 16" fill="none" stroke={NERO} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 62 Q30 67 36 62" fill="none" stroke={NERO} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Sun({ className = "", color = CANVAS }: P & { color?: string }) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g className="spin-slow" style={{ transformOrigin: "50px 50px" }}>
        {rays.map((r) => (
          <rect key={r} x="47" y="2" width="6" height="16" rx="3" fill={color} transform={`rotate(${r} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="24" fill={color} />
    </svg>
  );
}

export function Wave({ className = "", color = CANVAS }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true">
      <path
        d="M4 44 C 20 44, 22 20, 44 18 C 64 16, 74 34, 62 40 C 54 44, 48 34, 56 30 M4 54 C 24 50, 40 56, 60 52 S 100 48, 116 54"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Sunset({ className = "", color = CANVAS }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={className} aria-hidden="true">
      <path d="M26 56 A 34 34 0 0 1 94 56 Z" fill={color} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={14 + i * 8} y={60 + i * 4} width={92 - i * 16} height="3" rx="1.5" fill={color} opacity={1 - i * 0.25} />
      ))}
    </svg>
  );
}

export function Dipper({ className = "" }: P) {
  return (
    <svg viewBox="0 0 80 160" className={className} aria-hidden="true">
      <rect x="35" y="4" width="10" height="92" rx="5" fill={NERO} />
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={20 + (i % 2) * 2} y={96 + i * 11} width={40 - (i % 2) * 4} height="9" rx="4.5" fill={HONEY} stroke={NERO} strokeWidth="2.5" />
        ))}
      </g>
      <path className="drip" d="M40 152 C 40 152, 34 160, 40 160 C 46 160, 40 152, 40 152 Z" fill={HONEY} stroke={NERO} strokeWidth="2" />
    </svg>
  );
}

export function Flower({ className = "", petal = PEACOCK, center = HONEY }: P & { petal?: string; center?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse key={i} cx="50" cy="26" rx="14" ry="22" fill={petal} stroke={NERO} strokeWidth="2.5" transform={`rotate(${i * 60} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="13" fill={center} stroke={NERO} strokeWidth="2.5" />
    </svg>
  );
}

export function Honeycomb({ className = "", color = NERO }: P & { color?: string }) {
  const hex = (x: number, y: number) => {
    const r = 12;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      return `${(x + r * Math.cos(a)).toFixed(2)},${(y + r * Math.sin(a)).toFixed(2)}`;
    }).join(" ");
    return <polygon key={`${x}-${y}`} points={pts} fill="none" stroke={color} strokeWidth="2.5" />;
  };
  const cells: [number, number][] = [
    [14, 14], [35, 14], [56, 14], [24.5, 32], [45.5, 32], [66.5, 32], [14, 50], [35, 50], [56, 50],
  ];
  return (
    <svg viewBox="0 0 82 66" className={className} aria-hidden="true">
      {cells.map(([x, y]) => hex(x, y))}
    </svg>
  );
}
