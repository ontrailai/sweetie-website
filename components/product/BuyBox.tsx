"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_SIZE, SIZES, SUBSCRIPTION, getVariant, subscriberPrice, type Product, type SizeId } from "@/lib/catalog";
import { useCart } from "@/components/cart/CartProvider";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { TbdTag } from "@/components/ui/Tbd";
import { formatMoney } from "@/lib/format";
import { SizeChips } from "./SizeChips";

type Mode = "subscribe" | "one-time";

export function BuyBox({ product }: { product: Product }) {
  const [size, setSize] = useState<SizeId>(DEFAULT_SIZE);
  const [mode, setMode] = useState<Mode>("subscribe");
  const [frequency, setFrequency] = useState<string>(SUBSCRIPTION.defaultFrequency);
  const [qty, setQty] = useState(1);
  const [ctaVisible, setCtaVisible] = useState(true);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const { add } = useCart();

  const variant = getVariant(product, size);
  const unit = mode === "subscribe" ? subscriberPrice(variant.price) : variant.price;
  const total = { ...unit, money: { ...unit.money, amount: unit.money.amount * qty } };
  const sizeLabel = SIZES.find((s) => s.id === size)!.label;
  const cta = mode === "subscribe" ? "Start my subscription" : "Grab a jar";

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setCtaVisible(entry!.isIntersecting || entry!.boundingClientRect.top > window.innerHeight), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onAdd = () =>
    add({
      merchandiseId: variant.id,
      quantity: qty,
      purchase: mode === "subscribe" ? { mode: "subscribe", frequency } : { mode: "one-time" },
    });

  const option = (m: Mode) =>
    `flex w-full flex-col items-start gap-1 border-2 border-nero px-[18px] py-3.5 text-left transition-colors ${
      mode === m ? "bg-nero text-canvas" : "bg-transparent hover:bg-nero/[0.06]"
    }`;

  return (
    <div className="flex flex-col gap-6">
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-serif text-[40px] leading-none tracking-[0.025em]" aria-live="polite">
        <Price price={total} tag={mode === "subscribe" ? "Placeholder price & discount" : "Placeholder price"} />
        <span className="font-mono text-[13px] tracking-[0.075em] text-forest">
          {mode === "subscribe" ? "subscriber price" : "one-time"} · {sizeLabel}
          {qty > 1 ? ` · ${qty} × ${formatMoney(unit.money)}` : ""}
        </span>
      </p>

      <div className="flex flex-col gap-2.5">
        <span className="t-eyebrow text-forest">Size</span>
        <SizeChips value={size} onChange={setSize} name={`buy-size-${product.slug}`} size="lg" />
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="t-eyebrow mb-2.5 text-forest">How to buy</legend>
        <label className={`${option("subscribe")} cursor-pointer has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-forest`}>
          <input type="radio" name={`mode-${product.slug}`} className="sr-only" checked={mode === "subscribe"} onChange={() => setMode("subscribe")} />
          <span className="flex flex-wrap items-center gap-2 font-serif text-[24px] tracking-[0.025em]">
            Subscribe &amp; save {SUBSCRIPTION.discountPercent}%
            {SUBSCRIPTION.discountIsPlaceholder ? <TbdTag>TBD</TbdTag> : null}
          </span>
          <span className="text-[13px]">Pause, skip or cancel anytime.</span>
        </label>
        <AnimatePresence initial={false}>
          {mode === "subscribe" ? (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <label className="flex flex-wrap items-center gap-3 py-1 text-[15px]">
                Ships
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="min-h-11 border-2 border-nero bg-canvas px-3 font-mono text-[15px]"
                >
                  {SUBSCRIPTION.frequencies.map((f) => (
                    <option key={f} value={f}>
                      {f.toLowerCase()}
                    </option>
                  ))}
                </select>
                {SUBSCRIPTION.frequenciesArePlaceholder ? <TbdTag>Frequencies TBD</TbdTag> : null}
              </label>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <label className={`${option("one-time")} cursor-pointer has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-forest`}>
          <input type="radio" name={`mode-${product.slug}`} className="sr-only" checked={mode === "one-time"} onChange={() => setMode("one-time")} />
          <span className="font-serif text-[24px] tracking-[0.025em]">One-time purchase</span>
        </label>
      </fieldset>

      <div className="flex flex-wrap items-stretch gap-3">
        <QuantityStepper value={qty} onChange={setQty} />
        <button ref={ctaRef} type="button" onClick={onAdd} className="btn min-h-14 flex-1 bg-peacock px-7 font-serif text-[26px] tracking-[0.025em] text-canvas">
          {cta}
        </button>
      </div>

      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-forest">
        <li>Raw &amp; unprocessed</li>
        <li aria-hidden="true">·</li>
        <li>Traceable to the hive</li>
        <li aria-hidden="true">·</li>
        <li>
          Ships <TbdTag>where TBD</TbdTag>
        </li>
      </ul>

      {/* Mobile quick-add bar */}
      <AnimatePresence>
        {!ctaVisible ? (
          <motion.div
            role="region"
            aria-label="Quick add"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t-2 border-nero bg-canvas px-5 py-3 md:hidden"
          >
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-serif text-[20px] leading-tight">
                No. {product.number} {product.name}
              </span>
              <span className="text-[13px]">
                {formatMoney(total.money)} · {sizeLabel}
                {unit.placeholder ? " · placeholder" : ""}
              </span>
            </span>
            <button type="button" onClick={onAdd} className="btn min-h-12 shrink-0 bg-peacock px-4 font-serif text-[20px] text-canvas">
              {cta}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
