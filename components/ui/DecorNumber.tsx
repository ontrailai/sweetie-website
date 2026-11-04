/** Oversized background numeral, drawn as SVG so it's pure artwork (not text content). */
export function DecorNumber({ value, className = "", opacity = 0.1 }: { value: string; className?: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 110 84" className={`pointer-events-none w-auto overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <text x="0" y="68" fontSize="84" fontStyle="italic" fill="currentColor" opacity={opacity} style={{ fontFamily: "var(--font-serif)" }}>
        {value}
      </text>
    </svg>
  );
}
