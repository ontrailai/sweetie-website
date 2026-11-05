"use client";

import { useRef } from "react";
import { DISCOVERY_FAN, DISCOVERY_SET, PRODUCTS } from "@/lib/catalog";
import { JarPhoto } from "@/components/jar/JarPhoto";
import { Wordmark } from "@/components/brand/Wordmark";
import { SplitText } from "@/components/motion/SplitText";
import { Magnetic } from "@/components/motion/Magnetic";
import { useQuickAdd } from "@/components/fx/useQuickAdd";
import { RoundSticker } from "@/components/fx/Sticker";
import { Price } from "@/components/ui/Price";

/** "Try all six." The Discovery Set as a drop: jars pop out of the box. */
export function DiscoveryDrop({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const quickAdd = useQuickAdd();
  const boxRef = useRef<HTMLDivElement>(null);
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <section id="discovery" aria-labelledby="discovery-h" className="px-gutter relative scroll-mt-24 overflow-hidden bg-canvas py-[clamp(72px,10vw,160px)]">
      <div className="container-x grid items-center gap-x-16 gap-y-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative order-2 lg:order-1">
          <RoundSticker
            text="NEW HERE? START HERE · TRY ALL SIX · "
            bg="#ff007c"
            ink="#f6eddd"
            className="absolute -left-2 -top-10 z-20 w-[clamp(96px,11vw,150px)] -rotate-12"
            center={<span className="font-serif text-[clamp(24px,2.4vw,36px)] font-semibold italic leading-none text-canvas">×6</span>}
          />
          {/* the box */}
          <div ref={boxRef} className="group/set relative mx-auto aspect-[5/4] w-full max-w-[640px]" data-inview="">
            <div aria-hidden="true" className="absolute inset-x-[4%] bottom-[2%] h-[6%] rounded-[50%] bg-nero/20 blur-sm" />
            <div className="absolute inset-x-[10%] bottom-[30%] flex items-end justify-between">
              {PRODUCTS.map((p, i) => (
                <div
                  key={p.slug}
                  className="rise w-[15.5%] transition-transform duration-500 ease-[var(--ease-pop)] group-hover/set:-translate-y-[var(--lift)] group-hover/set:rotate-[var(--tip)]"
                  style={{ ["--d" as string]: `${120 + i * 90}ms`, ["--lift" as string]: `${18 + (i % 3) * 12}%`, ["--tip" as string]: `${(i - 2.5) * 3}deg` }}
                >
                  <JarPhoto product={p} sizes="(min-width: 1024px) 7vw, 15vw" />
                </div>
              ))}
            </div>
            <div className="absolute inset-x-[4%] bottom-[6%] z-10 flex h-[34%] flex-col items-center justify-center gap-1 rounded-[22px] border-2 border-nero bg-peacock text-canvas shadow-[0_8px_0_0_#262626]">
              <span aria-hidden="true" className="absolute inset-x-0 top-3 h-2 border-y-2 border-dashed border-canvas/50" />
              <Wordmark size="md" onDark className="!text-[clamp(30px,4vw,56px)]" />
              <span className="font-serif text-[clamp(24px,2.4vw,34px)] italic">Discovery Set</span>
            </div>
          </div>
        </div>

        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <span className="sticker self-start [--r:-4deg]">{DISCOVERY_SET.eyebrow}</span>
          <H id="discovery-h" className="display text-[clamp(80px,11vw,200px)] text-nero">
            <SplitText text="Try" /> <em className="text-peacock"><SplitText text="all six." start={3} /></em>
          </H>
          <p className="max-w-[46ch] text-[16px] leading-[1.7]">{DISCOVERY_SET.description}</p>
          <div className="flex flex-wrap items-center gap-5">
            <Price price={DISCOVERY_SET.price} className="font-serif text-[44px] font-medium leading-none tracking-[-0.02em]" />
            <Magnetic>
              <button
                type="button"
                className="btn min-h-[60px] bg-nero px-8 text-[26px] text-canvas"
                onClick={() =>
                  void quickAdd(
                    { merchandiseId: DISCOVERY_SET.id, quantity: 1, purchase: { mode: "one-time" } },
                    {
                      source: boxRef.current,
                      look: { labelColor: "#ff007c", honey: "#e6a52a" },
                      label: "Discovery Set",
                      // flies as the set (the cart line's fan of three), not as one jar
                      bundle: DISCOVERY_FAN.map((p) => ({ slug: p.slug, look: { labelColor: p.jar.labelColor, honey: p.jar.honey } })),
                    },
                  )
                }
              >
                Add the set
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
