/**
 * Honey-drip edge. Place it at the bottom of a coloured section
 * (absolute, top-full) in the same colour so the section drips into the next.
 */
const DRIPS: [x: number, w: number, len: number, dur: number][] = [
  [60, 14, 34, 6],
  [170, 10, 22, 5],
  [290, 18, 52, 7],
  [430, 9, 18, 4.6],
  [560, 15, 40, 6.4],
  [700, 11, 26, 5.2],
  [820, 20, 60, 7.6],
  [965, 10, 20, 4.8],
  [1080, 16, 44, 6.8],
  [1210, 12, 28, 5.6],
  [1340, 17, 48, 7.2],
];

function dripPath(x: number, w: number, len: number) {
  const r = w * 0.5;
  return `M${x - w} 0 C ${x - w} ${len * 0.55}, ${x - r} ${len * 0.62}, ${x - r} ${len} A ${r} ${r} 0 0 0 ${x + r} ${len} C ${x + r} ${len * 0.62}, ${x + w} ${len * 0.55}, ${x + w} 0 Z`;
}

export function Drip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="xMidYMin slice" className={`pointer-events-none block ${className}`} aria-hidden="true">
      <rect x="0" y="-1" width="1440" height="9" fill="currentColor" />
      {DRIPS.map(([x, w, len, dur]) => (
        <path key={x} className="drip" d={dripPath(x, w, len)} fill="currentColor" style={{ animationDuration: `${dur}s`, animationDelay: `${-x / 300}s` }} />
      ))}
    </svg>
  );
}
