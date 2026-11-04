"use client";

import { motion } from "motion/react";
import { DISCOVERY_SET, PRODUCTS } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { Wordmark } from "@/components/brand/Wordmark";
import { Star } from "@/components/brand/Star";
import { useCart } from "@/components/cart/CartProvider";
import { Price } from "@/components/ui/Price";

export function DiscoverySet({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const { add } = useCart();
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div id="discovery" className="group/set flex scroll-mt-28 flex-wrap items-stretch border-2 border-nero">
      <div className="relative aspect-[16/11] min-w-0 flex-[1_1_520px] overflow-hidden bg-nero/[0.06]">
        <Star className="twinkle absolute left-[8%] top-[10%] size-8 text-peacock" />
        <Star className="twinkle absolute right-[10%] top-[18%] size-5 text-forest [animation-delay:-1.2s]" />
        <div aria-hidden="true" className="absolute bottom-[7%] left-1/2 h-[4%] w-[84%] -translate-x-1/2 rounded-[50%] bg-nero/20" />
        <div className="absolute inset-x-[13%] bottom-[21%] flex items-end justify-between">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.slug}
              className="w-[14%]"
              initial={{ y: 60 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.1 + i * 0.07 }}
            >
              <div className="transition-transform duration-500 ease-[var(--ease-pop)] group-hover/set:-translate-y-[var(--lift)]" style={{ ["--lift" as string]: `${18 + (i % 3) * 10}%` }}>
                <Jar {...p.jar} number={p.number} name={p.name} descriptor={p.descriptor} decorative alive={false} />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-x-[10%] bottom-[9%] z-[2] flex h-[30%] items-center justify-center gap-[18px] bg-peacock text-canvas shadow-[inset_0_12px_0_rgba(38,38,38,0.14)]">
          <span className="mt-2 text-canvas">
            <Wordmark size="sm" onDark className="!text-[clamp(20px,2.4vw,34px)]" />
          </span>
          <span className="mt-2 font-serif text-[clamp(20px,2vw,30px)] italic tracking-[0.025em]">Discovery Set</span>
        </div>
      </div>
      <div className="flex min-w-0 flex-[1_1_380px] flex-col justify-center gap-5 p-[clamp(28px,3.4vw,52px)]">
        <p className="t-eyebrow text-forest">{DISCOVERY_SET.eyebrow}</p>
        <H className="text-[clamp(52px,5.6vw,88px)] leading-[0.92] tracking-[0.015em] text-peacock">
          Try <em>all six.</em>
        </H>
        <p className="text-base leading-[1.7]">{DISCOVERY_SET.description}</p>
        <Price price={DISCOVERY_SET.price} className="font-serif text-[34px] tracking-[0.025em]" />
        <div>
          <button
            type="button"
            onClick={() => add({ merchandiseId: DISCOVERY_SET.id, quantity: 1, purchase: { mode: "one-time" } })}
            className="btn min-h-14 bg-peacock px-7 font-serif text-[26px] tracking-[0.025em] text-canvas"
          >
            Add the Discovery Set
          </button>
        </div>
      </div>
    </div>
  );
}
