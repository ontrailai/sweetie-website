import Image from "next/image";
import { SITE } from "@/lib/site";

/**
 * Typographic Sweet Bee wordmark. When a real logo is added to /public/brand
 * and referenced in SITE.assets, it renders instead.
 */
export function Wordmark({
  className = "",
  onDark = false,
  size = "md",
}: {
  className?: string;
  onDark?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const logo = onDark ? SITE.assets.logoOnDark : SITE.assets.logo;
  const heights = { sm: 28, md: 36, lg: 64, xl: 120 } as const;
  if (logo) {
    return (
      <Image src={logo} alt={SITE.name} height={heights[size]} width={heights[size] * 4} className={className} style={{ width: "auto" }} priority />
    );
  }
  const text = { sm: "text-[26px]", md: "text-[34px]", lg: "text-[60px]", xl: "text-[clamp(72px,12vw,140px)]" }[size];
  return (
    <span className={`wordmark inline-flex items-baseline leading-none ${text} ${className}`} aria-label={SITE.name} role="img">
      <span aria-hidden="true" className="font-serif italic tracking-[0.01em]">Sweet</span>
      <span aria-hidden="true" className="wordmark-dot mx-[0.06em] inline-block size-[0.16em] -translate-y-[0.5em] rounded-full bg-current" />
      <span aria-hidden="true" className="font-serif tracking-[0.025em]">Bee</span>
    </span>
  );
}
