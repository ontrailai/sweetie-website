import type { ReactNode } from "react";
import { Star } from "@/components/brand/Star";

/**
 * CSS-only infinite marquee (GPU transform, no JS). Content is duplicated once
 * and translated -50%. Paused on hover and when motion is off.
 */
export function Marquee({
  items,
  reverse = false,
  duration = 32,
  className = "",
  starClassName = "",
  label,
}: {
  items: ReactNode[];
  reverse?: boolean;
  duration?: number;
  className?: string;
  starClassName?: string;
  label?: string;
}) {
  const run = (key: string, hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined} key={key}>
      {[...items, ...items].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-[0.9em] pr-[0.9em]">
          <span>{item}</span>
          <Star className={`size-[0.62em] shrink-0 ${starClassName}`} />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee group overflow-hidden ${className}`} role={label ? "marquee" : undefined} aria-label={label}>
      <div
        className={`marquee-track flex w-max ${reverse ? "marquee-reverse" : ""}`}
        style={{ animationDuration: `${duration}s` }}
        aria-hidden={label ? true : undefined}
      >
        {run("a", false)}
        {run("b", true)}
      </div>
    </div>
  );
}
