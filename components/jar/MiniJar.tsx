import type { JarLook } from "@/lib/catalog";

/** Icon-sized jar (lid, honey, label band): cheap enough to render dozens. */
export function MiniJar({ look, className = "" }: { look: JarLook; className?: string }) {
  return (
    <svg viewBox="0 0 20 46" className={`block ${className}`} aria-hidden="true">
      <rect x="1" y="6" width="18" height="39" rx="3" fill={look.honey} stroke="#262626" strokeWidth="1.5" />
      <rect x="2" y="9" width="3" height="33" rx="1.5" fill="#fff" opacity="0.35" />
      <rect x="1" y="18" width="18" height="15" fill={look.labelColor} stroke="#262626" strokeWidth="1.5" />
      <rect x="0.5" y="0.75" width="19" height="7" rx="2" fill="#262626" />
    </svg>
  );
}
