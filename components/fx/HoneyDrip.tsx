/**
 * Honey-drip divider. Sits at the bottom edge of a coloured section
 * (absolute top-full, text-[section colour]) so the section drips into the
 * next. Strands stretch and drops fall (CSS only; motion-off = still).
 */
const STRANDS: [x: number, w: number, len: number, dur: number][] = [
  [40, 22, 70, 6.5],
  [150, 12, 36, 5],
  [250, 30, 110, 7.4],
  [380, 14, 30, 4.8],
  [470, 24, 84, 6.8],
  [610, 12, 44, 5.4],
  [720, 34, 128, 8],
  [860, 14, 40, 5.2],
  [960, 22, 76, 6.2],
  [1090, 12, 30, 4.6],
  [1190, 28, 104, 7.6],
  [1320, 16, 52, 5.8],
  [1410, 20, 66, 6.6],
];

function strand(x: number, w: number, len: number) {
  const r = w / 2;
  return `M${x - w * 1.4} 0 C ${x - w} ${len * 0.35}, ${x - r} ${len * 0.5}, ${x - r} ${len - r} A ${r} ${r} 0 0 0 ${x + r} ${len - r} C ${x + r} ${len * 0.5}, ${x + w} ${len * 0.35}, ${x + w * 1.4} 0 Z`;
}

export function HoneyDrip({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 140"
      preserveAspectRatio="xMidYMin slice"
      className={`pointer-events-none block w-full overflow-visible ${flip ? "-scale-y-100" : ""} ${className}`}
      aria-hidden="true"
    >
      <rect x="0" y="-2" width="1440" height="14" fill="currentColor" />
      {STRANDS.map(([x, w, len, dur], i) => (
        <g key={x}>
          <path className="drip-strand" d={strand(x, w, len)} fill="currentColor" style={{ ["--dur" as string]: `${dur}s`, ["--delay" as string]: `${-i * 0.7}s` }} />
          {len > 60 ? (
            <circle
              className="drip-drop"
              cx={x}
              cy={len + 8}
              r={w * 0.32}
              fill="currentColor"
              style={{ ["--dur" as string]: `${dur}s`, ["--delay" as string]: `${-i * 0.7}s` }}
            />
          ) : null}
        </g>
      ))}
    </svg>
  );
}
