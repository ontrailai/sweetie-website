"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { PRODUCTS, SUBSCRIPTION, fromPrice, subscriberPrice } from "@/lib/catalog";
import { JarPhoto } from "@/components/jar/JarPhoto";
import { SplitText } from "@/components/motion/SplitText";
import { Magnetic } from "@/components/motion/Magnetic";
import { RoundSticker } from "@/components/fx/Sticker";
import { Price } from "@/components/ui/Price";
import { Tbd, TbdTag } from "@/components/ui/Tbd";

const weeksOf = (f: string) => Number(f.match(/\d+/)?.[0] ?? 4);

/**
 * "Keep the hum going." A rotary delivery dial: pick a frequency and the
 * dial swings over; the year of jars it adds up to pours in below.
 */
export function SubscriptionDial() {
  const id = useId();
  const [freq, setFreq] = useState<string>(SUBSCRIPTION.defaultFrequency);
  const weeks = weeksOf(freq);
  const perYear = Math.round(52 / weeks);
  const idx = SUBSCRIPTION.frequencies.indexOf(freq as (typeof SUBSCRIPTION.frequencies)[number]);
  const angle = -60 + idx * 60;
  const from = subscriberPrice(fromPrice(PRODUCTS[0]!));

  return (
    <section id="subscribe" aria-labelledby="sub-h" className="on-dark px-gutter relative scroll-mt-20 overflow-hidden bg-forest py-[clamp(80px,10vw,170px)] text-canvas">
      <div className="container-x grid items-center gap-x-16 gap-y-14 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-7">
          <span className="sticker self-start bg-canvas [--r:3deg]">The Sweet Bee Box · Subscription</span>
          <h2 id="sub-h" className="display text-[clamp(72px,9.5vw,176px)]">
            <SplitText text="Keep the" /> <em><SplitText text="hum going." start={8} /></em>
          </h2>
          <p className="max-w-[46ch] text-[16px] leading-[1.7]">
            Your favourite jars on repeat, so the ritual never runs dry. {SUBSCRIPTION.flexible}.
          </p>
          <dl className="grid max-w-[560px] grid-cols-2 gap-x-6 gap-y-4 border-t-2 border-dashed border-canvas/40 pt-5 text-[15px]">
            <div>
              <dt className="t-eyebrow mb-1">Inside each box</dt>
              <dd>{SUBSCRIPTION.inside ?? <Tbd>What&apos;s inside each box</Tbd>}</dd>
            </div>
            <div>
              <dt className="t-eyebrow mb-1">Subscriber price</dt>
              <dd>
                <Price price={from} prefix="from" tag="Placeholder" />
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link href="/shop/wildflower" className="btn min-h-[60px] bg-peacock px-8 text-[26px] text-canvas">
                Build your box
              </Link>
            </Magnetic>
            <Link href="/shop" className="font-mono text-[14px] font-bold uppercase tracking-[0.12em] underline underline-offset-4">
              Browse all six
            </Link>
          </div>
        </div>

        {/* the dial */}
        <div className="relative mx-auto w-full max-w-[540px]">
          <RoundSticker
            text={`SAVE ${SUBSCRIPTION.discountPercent}% · SUBSCRIBE & SAVE · `}
            bg="#ff007c"
            ink="#f6eddd"
            className="absolute -bottom-2 -right-4 z-20 w-[clamp(100px,11vw,150px)] rotate-12 max-sm:-right-1 max-sm:bottom-16"
            label={`Subscribe and save ${SUBSCRIPTION.discountPercent} percent (placeholder discount)`}
            center={<span className="font-serif text-[clamp(26px,2.6vw,38px)] font-bold leading-none text-canvas">{SUBSCRIPTION.discountPercent}%*</span>}
          />
          <fieldset className="relative aspect-square rounded-full border-2 border-nero bg-canvas text-nero shadow-[10px_10px_0_0_#262626]">
            <legend className="sr-only">How often should it ship?</legend>
            {/* ticks */}
            <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 size-full">
              {Array.from({ length: 36 }, (_, i) => (
                <line key={i} x1="100" y1="8" x2="100" y2={i % 3 ? 14 : 20} stroke="#262626" strokeWidth={i % 3 ? 1 : 2} transform={`rotate(${i * 10} 100 100)`} />
              ))}
            </svg>
            {/* pointer */}
            <div aria-hidden="true" className="absolute inset-[16%] rounded-full border-2 border-nero bg-peacock transition-transform duration-700 ease-[var(--ease-pop)]" style={{ transform: `rotate(${angle}deg)` }}>
              <span className="absolute left-1/2 top-[6%] h-[26%] w-3 -translate-x-1/2 rounded-full border-2 border-nero bg-canvas" />
              <span className="absolute inset-[30%] rounded-full border-2 border-nero bg-canvas shadow-[inset_0_0_0_6px_#ff0000]" />
            </div>
            <div className="absolute inset-[38%] grid place-items-center text-center">
              <p className="leading-none" aria-live="polite">
                <span className="block font-serif text-[clamp(40px,5vw,64px)] font-semibold">{perYear}</span>
                <span className="t-eyebrow text-[11px]">jars a year</span>
              </p>
            </div>
            {/* options around the dial */}
            {SUBSCRIPTION.frequencies.map((f, i) => {
              const a = ((-60 + i * 60 - 90) * Math.PI) / 180;
              const checked = f === freq;
              return (
                <label
                  key={f}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-nero px-3 py-2 whitespace-nowrap font-mono text-[13px] font-bold uppercase tracking-[0.08em] ring-duo transition-transform ${
                    checked ? "scale-110 bg-nero text-canvas" : "bg-canvas text-nero hover:-translate-y-[60%]"
                  }`}
                  style={{ left: `${50 + Math.cos(a) * 50}%`, top: `${50 + Math.sin(a) * 50}%` }}
                >
                  <input type="radio" name={`${id}-freq`} value={f} checked={checked} onChange={() => setFreq(f)} className="sr-only" />
                  {f.replace("Every ", "")}
                </label>
              );
            })}
          </fieldset>
          {/* a year of jars */}
          <div aria-hidden="true" className="mt-10 flex flex-wrap justify-center gap-1.5">
            {Array.from({ length: perYear }, (_, i) => {
              const p = PRODUCTS[i % PRODUCTS.length]!;
              return (
                <span key={`${perYear}-${i}`} className="rise is-in w-[clamp(14px,1.8vw,24px)]" style={{ ["--d" as string]: `${i * 30}ms` }}>
                  <JarPhoto product={p} sizes="24px" placeholder={false} />
                </span>
              );
            })}
          </div>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center text-[13px]">
            {SUBSCRIPTION.frequenciesArePlaceholder ? <TbdTag>Frequencies TBD</TbdTag> : null}
            <span>*Placeholder discount, to be confirmed.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
