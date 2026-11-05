/**
 * Spot illustrations for the v2 "hum drop" language: flat brand colours,
 * chunky Nero outlines, hard offset shadows and sticker stars. Honey tones
 * appear only as honey (in the spoon, the pour, the jar).
 * All decorative (aria-hidden); 100 × 100 viewBox each.
 */
import { STAR_PATH } from "./Star";

type P = { className?: string };

const NERO = "#262626";
const CANVAS = "#F6EDDD";
const PEACOCK = "#FF007C";
const LADYBUG = "#FF0000";
const JADE = "#308F32";
const FOREST = "#004832";
const HONEY = "#E6A52A";
const HONEY_DARK = "#9C620C";
const HONEY_LIGHT = "#FFF4C8";

function Sparkle({ x, y, s = 1, fill = CANVAS }: { x: number; y: number; s?: number; fill?: string }) {
  return <path d={STAR_PATH} fill={fill} transform={`translate(${x} ${y}) scale(${s * 0.5}) translate(-12 -12)`} />;
}

/** A spoon heaped with honey, one long drip falling off it. */
export function SpotSpoon({ className = "" }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g transform="rotate(-32 50 50)">
        <rect x="47" y="4" width="11" height="58" rx="5.5" fill={NERO} transform="translate(3 3)" />
        <rect x="47" y="4" width="11" height="58" rx="5.5" fill={CANVAS} stroke={NERO} strokeWidth="3" />
        <ellipse cx="55.5" cy="72" rx="20" ry="16" fill={NERO} />
        <ellipse cx="52.5" cy="69" rx="20" ry="16" fill={CANVAS} stroke={NERO} strokeWidth="3" />
        <path d="M36 67 C 40 58, 64 57, 69 66 C 70 76, 36 77, 36 67 Z" fill={HONEY} />
        <path d="M42 63 C 47 60, 55 60, 59 62" fill="none" stroke={HONEY_LIGHT} strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <path d="M45 84 C 44 89, 44 93, 46 96 C 48 99, 52 98, 52 94 C 52 90, 49 88, 48 82 Z" fill={HONEY} stroke={NERO} strokeWidth="2.5" strokeLinejoin="round" />
      <Sparkle x={20} y={22} s={1.1} />
      <Sparkle x={80} y={78} s={0.8} />
      <Sparkle x={84} y={18} s={0.55} />
    </svg>
  );
}

/** Paddle-out: a board riding a curling wave. */
export function SpotSurf({ className = "" }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M-4 70 C 10 40, 46 26, 66 42 C 80 54, 70 72, 56 66 C 48 62, 52 52, 60 54" fill="none" stroke={JADE} strokeWidth="12" strokeLinecap="round" />
      <path d="M-4 70 C 10 40, 46 26, 66 42 C 80 54, 70 72, 56 66 C 48 62, 52 52, 60 54" fill="none" stroke={CANVAS} strokeWidth="3" strokeLinecap="round" strokeDasharray="1 7" />
      <rect x="-4" y="76" width="108" height="30" fill={JADE} />
      <path d="M-4 76 Q 10 70 24 76 T 52 76 T 80 76 T 108 76" fill="none" stroke={CANVAS} strokeWidth="3" />
      <g transform="rotate(38 58 46)">
        <ellipse cx="61" cy="49" rx="9" ry="36" fill={NERO} />
        <ellipse cx="58" cy="46" rx="9" ry="36" fill={CANVAS} stroke={NERO} strokeWidth="3" />
        <rect x="55" y="11" width="6" height="70" fill={PEACOCK} />
        <ellipse cx="58" cy="46" rx="9" ry="36" fill="none" stroke={NERO} strokeWidth="3" />
      </g>
      <Sparkle x={20} y={20} s={0.9} fill={PEACOCK} />
    </svg>
  );
}

/** Sunrise: a Ladybug sun banded in Peacock, rising off the Pacific. */
export function SpotSunrise({ className = "" }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <clipPath id="spot-sun-clip">
          <rect x="0" y="0" width="100" height="64" />
        </clipPath>
      </defs>
      <g clipPath="url(#spot-sun-clip)">
        <circle cx="50" cy="64" r="34" fill={PEACOCK} />
        <circle cx="50" cy="64" r="26" fill={LADYBUG} stroke={NERO} strokeWidth="3" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x="20" y={46 + i * 6} width="60" height="2.6" fill={PEACOCK} />
        ))}
      </g>
      {Array.from({ length: 9 }, (_, i) => {
        const a = (Math.PI * (i + 1)) / 10;
        const x = 50 - Math.cos(a) * 42;
        const y = 64 - Math.sin(a) * 42;
        return <line key={i} x1={x} y1={y} x2={50 - Math.cos(a) * 48} y2={64 - Math.sin(a) * 48} stroke={CANVAS} strokeWidth="3.4" strokeLinecap="round" />;
      })}
      <rect x="6" y="64" width="88" height="3.4" rx="1.7" fill={CANVAS} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={18 + i * 9} y={73 + i * 7} width={64 - i * 18} height="3.4" rx="1.7" fill={CANVAS} opacity={1 - i * 0.25} />
      ))}
    </svg>
  );
}

/** Typographic: "hum." vibrating. */
export function SpotHum({ className = "" }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <g key={i} fill="none" stroke={CANVAS} strokeWidth="3" strokeLinecap="round" opacity={1 - i * 0.28}>
          <path d={`M${14 - i * 6} ${36 - i * 4} q ${-8 - i * 2} ${16 + i * 4} 0 ${32 + i * 8}`} />
          <path d={`M${86 + i * 6} ${36 - i * 4} q ${8 + i * 2} ${16 + i * 4} 0 ${32 + i * 8}`} />
        </g>
      ))}
      <text x="51.5" y="65.5" textAnchor="middle" fill={NERO} style={{ fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic", fontWeight: 700 }} fontSize="38" letterSpacing="-2">
        hum.
      </text>
      <text x="50" y="63" textAnchor="middle" fill={CANVAS} style={{ fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic", fontWeight: 700 }} fontSize="38" letterSpacing="-2">
        hum.
      </text>
      <Sparkle x={78} y={22} s={0.8} />
    </svg>
  );
}

/** The open jar, mid-pour, its lid flipping off. */
export function SpotPour({ className = "" }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="spot-pour" x1="0" x2="1">
          <stop offset="0" stopColor={HONEY_DARK} />
          <stop offset="0.45" stopColor={HONEY_LIGHT} />
          <stop offset="1" stopColor={HONEY} />
        </linearGradient>
      </defs>
      <path d="M45 -2 C 45 20, 44 30, 44.5 44 L 50.5 44 C 51 30, 50 20, 50 -2 Z" fill="url(#spot-pour)" />
      {/* jar */}
      <rect x="33" y="40" width="34" height="56" rx="6" fill={NERO} transform="translate(3 3)" />
      <rect x="33" y="40" width="34" height="56" rx="6" fill={CANVAS} fillOpacity="0.55" stroke={NERO} strokeWidth="3" />
      <rect x="36" y="50" width="28" height="43" rx="3.5" fill={HONEY} />
      <ellipse cx="47.5" cy="50" rx="8" ry="2.2" fill={HONEY_LIGHT} />
      <rect x="33" y="62" width="34" height="18" fill={PEACOCK} stroke={NERO} strokeWidth="3" />
      <path d={STAR_PATH} fill={CANVAS} transform="translate(50 71) scale(0.4) translate(-12 -12)" />
      <rect x="35" y="36" width="30" height="5" rx="2" fill={CANVAS} stroke={NERO} strokeWidth="2.5" />
      {/* lid */}
      <g transform="rotate(28 78 26)">
        <rect x="64" y="20" width="30" height="11" rx="3" fill={NERO} />
        <rect x="64" y="20" width="30" height="3" rx="1.5" fill="#4a4a4a" />
      </g>
      <path d="M70 40 l 6 -4 M73 46 l 8 -2" stroke={CANVAS} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Traceability: a hive pin on a dashed route. */
export function SpotPin({ className = "" }: P) {
  const hex = (x: number, y: number, r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      return `${(x + r * Math.cos(a)).toFixed(2)},${(y + r * Math.sin(a)).toFixed(2)}`;
    }).join(" ");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M8 88 C 26 70, 18 56, 40 60 S 64 86, 92 70" fill="none" stroke={FOREST} strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
      <ellipse cx="54" cy="84" rx="14" ry="4" fill={NERO} opacity="0.2" />
      <path d="M54 82 C 40 64, 32 54, 32 40 A 22 22 0 0 1 76 40 C 76 54, 68 64, 54 82 Z" fill={NERO} transform="translate(3 3)" />
      <path d="M54 82 C 40 64, 32 54, 32 40 A 22 22 0 0 1 76 40 C 76 54, 68 64, 54 82 Z" fill={PEACOCK} stroke={NERO} strokeWidth="3" strokeLinejoin="round" />
      <polygon points={hex(54, 40, 12)} fill={CANVAS} stroke={NERO} strokeWidth="3" />
      <polygon points={hex(54, 40, 5.5)} fill={HONEY} />
      <circle cx="14" cy="88" r="5" fill={JADE} stroke={NERO} strokeWidth="2.5" />
      <Sparkle x={84} y={20} s={0.75} fill={LADYBUG} />
    </svg>
  );
}
