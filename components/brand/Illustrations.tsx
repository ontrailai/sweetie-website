/**
 * The Sweet Bee bee, in brand colours only: a Canvas body with chunky Nero
 * stripes, a Peacock blush and clear wings. The v1 gold bee and its
 * sun / flower / wave / dipper / honeycomb set are retired; spot
 * illustrations for the v2 language live in ./Spots.
 */
import { useId } from "react";

type P = { className?: string };

/** Warm wing / glint white: the bee flies over honey, so no pure #fff. */
const GLINT = "#FFF6E2";

const NERO = "#262626";
const CANVAS = "#F6EDDD";
const PEACOCK = "#FF007C";

export function Bee({ className = "", flying = false }: P & { flying?: boolean }) {
  const clip = `bee-body-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 120 90" className={`overflow-visible ${className}`} aria-hidden="true">
      {flying ? (
        <>
          {/* motion-blur ghosts at the ends of the stroke */}
          <ellipse cx="50" cy="30" rx="17" ry="22" transform="rotate(-48 56 44)" fill={GLINT} fillOpacity="0.22" />
          <ellipse cx="72" cy="28" rx="15" ry="20" transform="rotate(40 64 44)" fill={GLINT} fillOpacity="0.22" />
          <g className="bee-wing bee-wing-back">
            <ellipse cx="50" cy="26" rx="18" ry="24" transform="rotate(-24 50 26)" fill={GLINT} fillOpacity="0.85" stroke={NERO} strokeWidth="3" />
            <path d="M46 14 Q50 24 48 34" fill="none" stroke={NERO} strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g className="bee-wing bee-wing-front">
            <ellipse cx="70" cy="24" rx="15" ry="21" transform="rotate(18 70 24)" fill={GLINT} fillOpacity="0.85" stroke={NERO} strokeWidth="3" />
          </g>
        </>
      ) : (
        <g className="bee-wings">
          <ellipse cx="50" cy="26" rx="18" ry="24" transform="rotate(-24 50 26)" fill={GLINT} fillOpacity="0.82" stroke={NERO} strokeWidth="3" />
          <ellipse cx="70" cy="24" rx="15" ry="21" transform="rotate(18 70 24)" fill={GLINT} fillOpacity="0.82" stroke={NERO} strokeWidth="3" />
          <path d="M46 14 Q50 24 48 34" fill="none" stroke={NERO} strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      {/* hard sticker shadow */}
      <ellipse cx="63" cy="59" rx="36" ry="24" fill={NERO} />
      <ellipse cx="60" cy="56" rx="36" ry="24" fill={CANVAS} stroke={NERO} strokeWidth="3" />
      <clipPath id={clip}>
        <ellipse cx="60" cy="56" rx="34.5" ry="22.5" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <path d="M40 30 Q33 56 40 82 L52 82 Q45 56 52 30 Z" fill={NERO} />
        <path d="M62 30 Q55 56 62 82 L74 82 Q67 56 74 30 Z" fill={NERO} />
        <path d="M84 30 Q78 56 84 82 L100 82 L100 30 Z" fill={NERO} />
      </g>
      <path d="M95 52 L111 56 L95 61 Z" fill={NERO} />
      <circle cx="30" cy="51" r="3.6" fill={NERO} />
      <circle cx="31.2" cy="49.8" r="1.1" fill={GLINT} />
      <ellipse cx="34" cy="61" rx="4.6" ry="3" fill={PEACOCK} />
      <path d="M22 40 Q14 26 22 18" fill="none" stroke={NERO} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 38 Q28 22 38 16" fill="none" stroke={NERO} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="22" cy="17" r="3" fill={PEACOCK} stroke={NERO} strokeWidth="2" />
      <circle cx="38.5" cy="15.5" r="3" fill={PEACOCK} stroke={NERO} strokeWidth="2" />
      <path d="M23 64 Q29 69 35 64" fill="none" stroke={NERO} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
