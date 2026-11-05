/** The twelve-point Sweet Bee sparkle from the mockup marquee. */
export const STAR_PATH =
  "M12 0 L14.2 8.6 L22.4 5.6 L16.6 12 L22.4 18.4 L14.2 15.4 L12 24 L9.8 15.4 L1.6 18.4 L7.4 12 L1.6 5.6 L9.8 8.6 Z";

export function Star({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
      {title ? <title>{title}</title> : null}
      <path d={STAR_PATH} fill="currentColor" />
    </svg>
  );
}
