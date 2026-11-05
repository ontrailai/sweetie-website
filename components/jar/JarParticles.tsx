import type { Product } from "@/lib/catalog";
import { makeParticles, particleShape } from "./specks";

/**
 * A jar's specks (vanilla pods, cinnamon quills, pollen, salt) or blossoms,
 * floating full-screen behind it. They pop in when `shown`, drift with CSS
 * and shift with device tilt via --tx/--ty on an ancestor. Decorative.
 */
export function JarParticles({ product: p, shown = true, staggered = true, count = 26 }: { product: Product; shown?: boolean; staggered?: boolean; count?: number }) {
  const particles = makeParticles(p.number, count);
  const shape = particleShape(p.jar.specks, p.slug);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {particles.map((pt, k) => (
        <span
          key={k}
          className="absolute block transition-[scale,opacity] duration-700 ease-[var(--ease-pop)]"
          style={{
            left: `${pt.x}%`,
            top: `${pt.y}%`,
            width: shape.base * pt.size,
            scale: shown ? "1" : "0",
            opacity: shown ? "1" : "0",
            transitionDelay: shown && staggered ? `${0.15 + pt.delay}s` : "0s",
            translate: `calc(var(--tx, 0) * ${pt.depth * 40}px) calc(var(--ty, 0) * ${pt.depth * 30}px)`,
          }}
        >
          <svg viewBox={shape.viewBox} className="float block w-full" style={{ rotate: `${pt.rot}deg`, animationDuration: `${pt.drift}s`, animationDelay: `${-pt.delay * 8}s` }}>
            <path d={shape.path} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.stroke ? 1.5 : 0} fillRule="evenodd" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/** Honey pooling along the bottom edge of a jar-coloured panel. */
export function HoneyPool({ product: p, className = "", style }: { product: Product; className?: string; style?: React.CSSProperties }) {
  return (
    <div aria-hidden="true" className={`absolute inset-x-0 bottom-0 -z-10 ${className}`} style={style}>
      <div className="absolute inset-x-0 -top-[38px] h-10 overflow-hidden">
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="honey-wave h-full w-[200%]">
          <path d="M0 20 Q 90 0 180 20 T 360 20 T 540 20 T 720 20 T 900 20 T 1080 20 T 1260 20 T 1440 20 V40 H0 Z" fill={p.jar.honey} transform="scale(0.5 1)" />
          <path d="M0 20 Q 90 0 180 20 T 360 20 T 540 20 T 720 20 T 900 20 T 1080 20 T 1260 20 T 1440 20 V40 H0 Z" fill={p.jar.honey} transform="translate(720 0) scale(0.5 1)" />
        </svg>
      </div>
      <div className="size-full" style={{ background: `linear-gradient(180deg, ${p.jar.honey}, ${p.jar.honeyDark})` }} />
    </div>
  );
}
