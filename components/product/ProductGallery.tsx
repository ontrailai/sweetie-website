import Image from "next/image";
import type { Product } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { TurnableJar } from "@/components/jar/TurnableJar";
import { Star } from "@/components/brand/Star";
import { TbdTag } from "@/components/ui/Tbd";
import { DecorNumber } from "@/components/ui/DecorNumber";

/**
 * Main turnable jar + three supporting tiles. When real photos are added to
 * product.photos (files in /public), they replace the art-directed placeholders.
 */
export function ProductGallery({ product }: { product: Product }) {
  const { jar } = product;
  const placeholders = [
    {
      label: "A spoonful, close up",
      node: (
        <div className="absolute inset-0" style={{ background: jar.labelColor }}>
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
            <ellipse cx="50" cy="32" rx="34" ry="12" fill="#F6EDDD" />
            <rect x="80" y="26" width="30" height="7" rx="3.5" fill="#F6EDDD" transform="rotate(-8 80 26)" />
            <ellipse cx="50" cy="31" rx="27" ry="8" fill={jar.honey} />
            <path className="drip" d="M46 37 C46 52, 44 60, 48 68 C52 60, 52 50, 52 37 Z" fill={jar.honey} />
            <circle cx="48" cy="80" r="5" fill={jar.honey} />
          </svg>
        </div>
      ),
    },
    {
      label: "Label and QR",
      node: (
        <div className="absolute inset-0 overflow-hidden bg-nero/10">
          <div className="absolute left-1/2 top-1/2 w-[150%] -translate-x-1/2 -translate-y-[64%]">
            <Jar {...jar} number={product.number} name={product.name} descriptor={product.descriptor} decorative alive={false} />
          </div>
        </div>
      ),
    },
    {
      label: "At the market",
      node: (
        <div className="absolute inset-0 bg-canvas">
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 6 }, (_, i) => (
              <path key={i} d={`M${10 + i * 13.3} 22 h13.3 v16 a6.65 6.65 0 0 1 -13.3 0 z`} fill={i % 2 ? "#F6EDDD" : "#FF007C"} stroke="#262626" strokeWidth="1.2" />
            ))}
            <rect x="12" y="38" width="2" height="44" fill="#262626" />
            <rect x="86" y="38" width="2" height="44" fill="#262626" />
            <rect x="18" y="66" width="64" height="16" fill="#004832" />
            {[24, 36, 48, 60, 72].map((x, i) => (
              <rect key={x} x={x} y={52 + (i % 2) * 2} width="6" height={14 - (i % 2) * 2} rx="1" fill={["#FF007C", "#308F32", "#F6EDDD", "#262626", "#FF0000"][i]} stroke="#262626" strokeWidth="0.6" />
            ))}
          </svg>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-nero/[0.06] pt-6">
        <DecorNumber value={product.number} opacity={0.08} className="absolute left-5 top-4 h-[clamp(72px,10vw,150px)]" />
        <Star className="twinkle absolute right-[9%] top-[12%] size-7 text-peacock" />
        <Star className="twinkle absolute bottom-[22%] left-[10%] size-4 text-forest [animation-delay:-1.4s]" />
        <TurnableJar product={product} />
      </div>
      <ul className="grid grid-cols-3 gap-3">
        {product.photos.length
          ? product.photos.slice(0, 3).map((ph) => (
              <li key={ph.src} className="relative aspect-square overflow-hidden">
                <Image src={ph.src} alt={ph.alt} fill sizes="(max-width: 768px) 33vw, 220px" className="object-cover" />
              </li>
            ))
          : placeholders.map((t) => (
              <li key={t.label} className="group relative aspect-square overflow-hidden">
                <span className="sr-only">Photo coming soon: {t.label}</span>
                <div className="absolute inset-0 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-105">{t.node}</div>
                <span className="absolute bottom-2 left-2 right-2 max-sm:hidden">
                  <TbdTag className="bg-canvas text-nero">Photo: {t.label}</TbdTag>
                </span>
              </li>
            ))}
      </ul>
    </div>
  );
}
