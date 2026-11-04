"use client";

import Link from "next/link";
import { useState } from "react";
import { DEFAULT_SIZE, fromPrice, getVariant, type Product, type SizeId } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { useJarSpin } from "@/components/jar/useJarSpin";
import { useCart } from "@/components/cart/CartProvider";
import { Price } from "@/components/ui/Price";
import { SizeChips } from "./SizeChips";

export function ProductCard({ product, headingLevel = 3 }: { product: Product; headingLevel?: 2 | 3 }) {
  const [size, setSize] = useState<SizeId>(DEFAULT_SIZE);
  const { spin, turn } = useJarSpin();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const H = headingLevel === 2 ? "h2" : "h3";
  const variant = getVariant(product, size);
  const href = `/shop/${product.slug}`;

  const onAdd = async () => {
    await add({ merchandiseId: variant.id, quantity: 1, purchase: { mode: "one-time" } });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group/card flex flex-col gap-2.5">
      <Link
        href={href}
        aria-label={`No. ${product.number} ${product.name}`}
        onPointerEnter={() => turn(1)}
        onFocus={() => turn(1)}
        className="relative mb-3.5 flex aspect-[4/5] items-end justify-center overflow-hidden bg-nero/[0.06] pb-[8%] max-sm:aspect-[3/4]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover/card:scale-y-100 group-focus-within/card:scale-y-100"
          style={{ background: product.jar.labelColor, opacity: 0.16 }}
        />
        <span aria-hidden="true" className="absolute left-4 top-3 font-serif text-[clamp(56px,7vw,96px)] italic leading-none opacity-[0.12]">
          {product.number}
        </span>
        <span
          className="relative block w-[30%] transition-transform duration-[450ms] ease-[var(--ease-pop)] group-hover/card:-translate-y-3 group-hover/card:-rotate-3"
        >
          <Jar {...product.jar} number={product.number} name={product.name} descriptor={product.descriptor} spin={spin} decorative />
        </span>
      </Link>
      <p className="t-eyebrow text-forest">
        No. {product.number} · {product.category}
      </p>
      <p className="font-serif text-[20px] italic tracking-[0.025em] text-forest">
        Best at {product.bestAt.time} · {product.bestAt.moment}
      </p>
      <div className="flex items-baseline justify-between gap-3 max-sm:flex-col max-sm:items-start max-sm:gap-0.5">
        <H className="text-[34px] leading-none max-sm:text-[26px]">
          <Link href={href} className="transition-colors hover:text-peacock">
            {product.name}
          </Link>
        </H>
        <Price price={fromPrice(product)} prefix="From" className="font-serif text-[22px] max-sm:text-[18px]" tag="TBD" />
      </div>
      <div className="mt-1">
        <SizeChips value={size} onChange={setSize} name={`size-${product.slug}`} label={`Size for ${product.name}`} />
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="btn mt-1.5 self-start bg-nero text-[15px] text-canvas"
      >
        {added ? "Added ✓" : "Grab a jar"}
        <span className="sr-only">
          , {variant.size.replace("oz", " oz")} {product.name}
        </span>
      </button>
    </article>
  );
}
