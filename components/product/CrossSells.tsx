"use client";

import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { useJarSpin } from "@/components/jar/useJarSpin";

export function CrossSellCard({ product }: { product: Product }) {
  const { spin, turn } = useJarSpin();
  return (
    <article className="group flex flex-col gap-2">
      <Link
        href={`/shop/${product.slug}`}
        onPointerEnter={() => turn(1)}
        onFocus={() => turn(1)}
        className="relative mb-3 flex aspect-[4/5] items-end justify-center overflow-hidden pb-[8%]"
        style={{ background: `color-mix(in srgb, ${product.jar.labelColor} 14%, #F6EDDD)` }}
      >
        <span className="sr-only">
          No. {product.number} {product.name}
        </span>
        <span className="block w-[28%] transition-transform duration-500 ease-[var(--ease-pop)] group-hover:-translate-y-3 group-hover:rotate-3">
          <Jar {...product.jar} number={product.number} name={product.name} descriptor={product.descriptor} spin={spin} decorative />
        </span>
      </Link>
      <p className="t-eyebrow text-forest">No. {product.number}</p>
      <h3 className="text-[34px] leading-none">
        <Link href={`/shop/${product.slug}`} className="hover:text-peacock">
          {product.name}
        </Link>
      </h3>
      <p className="font-serif text-[20px] italic text-forest">
        Best at {product.bestAt.time} · {product.bestAt.moment}
      </p>
    </article>
  );
}
