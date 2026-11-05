"use client";

import { type Batch, getProduct } from "@/lib/catalog";

/**
 * Illustrated (not-to-scale) San Diego County: coast → inland valleys →
 * mountains → desert, with a hive pin per batch. Pin positions are
 * PLACEHOLDERS until real beekeeper areas are confirmed (lib/catalog.ts).
 * Pins are real buttons when `onSelect` is passed.
 */

// TODO(batches): replace with real (approximate, privacy-safe) hive areas.
export const PIN_POS: Record<string, { x: number; y: number }> = {
  wildflower: { x: 27, y: 36 },
  "avocado-blossom": { x: 41, y: 21 },
  "vanilla-bean": { x: 33, y: 63 },
  cinnamon: { x: 55, y: 47 },
  "bee-pollen": { x: 47, y: 75 },
  "guarana-salt": { x: 66, y: 31 },
};

const OUTLINE =
  "M70 30 L560 30 L560 410 L118 410 C 112 380, 92 360, 96 330 C 100 300, 80 285, 84 255 C 88 220, 62 200, 66 170 C 70 140, 50 120, 56 92 C 60 70, 48 52, 70 30 Z";

export function CountyMap({
  batches,
  selected,
  onSelect,
  className = "",
  compact = false,
  children,
  caption,
}: {
  batches: Batch[];
  selected?: string | null;
  onSelect?: (code: string) => void;
  className?: string;
  compact?: boolean;
  /** Extra overlays (e.g. market pins) positioned inside the map box. */
  children?: React.ReactNode;
  caption?: React.ReactNode;
}) {
  return (
    <figure className={`relative ${className}`}>
      <div className="relative aspect-[600/440] w-full overflow-hidden rounded-[28px] border-2 border-nero shadow-[8px_8px_0_0_#262626]" style={{ background: "#262626" }}>
        <svg viewBox="0 0 600 440" className="absolute inset-0 size-full" aria-hidden="true">
          <defs>
            <clipPath id="county-clip">
              <path d={OUTLINE} />
            </clipPath>
            <pattern id="coast-dots" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="1.6" fill="#262626" opacity="0.25" />
            </pattern>
          </defs>
          {/* ocean waves */}
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${6 + (i % 2) * 14} ${40 + i * 44} q 10 -8 20 0 t 20 0`} fill="none" stroke="#f6eddd" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
          ))}
          <g clipPath="url(#county-clip)">
            {/* coast */}
            <rect x="0" y="0" width="230" height="440" fill="#f6eddd" />
            <rect x="0" y="0" width="230" height="440" fill="url(#coast-dots)" />
            {/* inland valleys */}
            <path d="M200 0 C 230 120, 190 260, 240 440 L 380 440 C 340 300, 380 140, 340 0 Z" fill="#308f32" />
            {/* mountains */}
            <path d="M330 0 C 370 140, 330 300, 370 440 L 470 440 C 440 300, 480 140, 450 0 Z" fill="#004832" />
            {[
              [370, 120], [400, 200], [380, 290], [420, 350], [410, 80],
            ].map(([x, y]) => (
              <path key={`${x}-${y}`} d={`M${x! - 18} ${y! + 14} L${x} ${y! - 14} L${x! + 18} ${y! + 14} Z`} fill="none" stroke="#f6eddd" strokeWidth="2.5" strokeLinejoin="round" opacity="0.7" />
            ))}
            {/* desert */}
            <path d="M440 0 C 480 140, 440 300, 460 440 L 600 440 L 600 0 Z" fill="#ffd36b" />
            {[
              [500, 100], [530, 220], [490, 320], [540, 380],
            ].map(([x, y]) => (
              <path key={`d${x}`} d={`M${x! - 22} ${y} q 22 -16 44 0`} fill="none" stroke="#262626" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
            ))}
          </g>
          <path d={OUTLINE} fill="none" stroke="#262626" strokeWidth="4" />
          {!compact ? (
            <g style={{ fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.14em" }} fontSize="11">
              <text x="120" y="400" fill="#262626">COAST</text>
              <text x="250" y="400" fill="#f6eddd">VALLEYS</text>
              <text x="372" y="400" fill="#f6eddd">MOUNTAINS</text>
              <text x="490" y="400" fill="#262626">DESERT</text>
              <text x="14" y="425" fill="#f6eddd" opacity="0.8">PACIFIC</text>
            </g>
          ) : null}
        </svg>

        {/* pins */}
        {batches.map((b) => {
          const p = getProduct(b.productSlug);
          const pos = PIN_POS[b.productSlug];
          if (!p || !pos) return null;
          const isSel = selected === b.code;
          const pin = (
            <>
              <span aria-hidden="true" className="pulse-pin absolute inset-0 rounded-full" style={{ background: p.jar.labelColor }} />
              <span
                aria-hidden="true"
                className={`relative grid size-full place-items-center rounded-full border-2 border-nero font-serif text-[13px] font-bold shadow-[0_3px_0_0_#262626] transition-transform duration-300 ease-[var(--ease-pop)] ${isSel ? "scale-125" : ""}`}
                style={{ background: p.jar.labelColor, color: p.jar.labelText }}
              >
                {p.number}
              </span>
            </>
          );
          const pos2 = { left: `${pos.x}%`, top: `${pos.y}%` };
          return onSelect ? (
            <button
              key={b.code}
              type="button"
              onClick={() => onSelect(b.code)}
              aria-pressed={isSel}
              aria-label={`Hive pin for batch ${b.code}, No. ${p.number} ${p.name} (placeholder location)`}
              className="ring-duo absolute size-10 -translate-x-1/2 -translate-y-1/2 rounded-full hover:z-10 focus-visible:z-10"
              style={pos2}
            >
              {pin}
            </button>
          ) : (
            <span key={b.code} className="absolute size-8 -translate-x-1/2 -translate-y-1/2" style={pos2}>
              {pin}
            </span>
          );
        })}
        {children}
      </div>
      <figcaption className={`mt-3 flex flex-wrap items-center gap-2 text-[13px] ${compact ? "sr-only" : ""}`}>
        <span className="tbd-tag">Placeholder</span> {caption ?? "Illustrated, not to scale. Hive pins are placeholders until real beekeeper areas are confirmed."}
      </figcaption>
    </figure>
  );
}
