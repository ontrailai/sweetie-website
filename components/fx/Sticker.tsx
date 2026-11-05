import type { ReactNode } from "react";
import { STAR_PATH } from "@/components/brand/Star";

/**
 * Round die-cut sticker with text running around the edge. Decorative by
 * default (pass `label` to expose it), the ring spins slowly.
 */
export function RoundSticker({
  text,
  className = "",
  bg = "#f6eddd",
  ink = "#262626",
  center,
  label,
  spin = true,
}: {
  text: string;
  className?: string;
  bg?: string;
  ink?: string;
  center?: ReactNode;
  label?: string;
  spin?: boolean;
}) {
  const id = `ring-${text.replace(/[^a-z0-9]/gi, "").slice(0, 16)}`;
  return (
    <div className={`aspect-square ${/\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative"} ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full drop-shadow-[4px_4px_0_#262626]">
        <circle cx="100" cy="100" r="97" fill={bg} stroke="#262626" strokeWidth="3" />
        <g className={spin ? "spin-slow" : undefined} style={{ transformOrigin: "100px 100px" }}>
          <defs>
            <path id={id} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
          </defs>
          <text fill={ink} fontSize="17" fontWeight="700" letterSpacing="4" style={{ fontFamily: "var(--font-mono)" }}>
            <textPath href={`#${id}`} startOffset="0" textLength={446} lengthAdjust="spacingAndGlyphs">
              {text}
            </textPath>
          </text>
        </g>
      </svg>
      <div className="absolute inset-[26%] grid place-items-center text-center">
        {center ?? (
          <svg viewBox="0 0 24 24" className="size-full" fill={ink}>
            <path d={STAR_PATH} />
          </svg>
        )}
      </div>
    </div>
  );
}
