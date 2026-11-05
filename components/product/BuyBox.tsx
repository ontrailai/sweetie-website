"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { DEFAULT_SIZE, SIZES, SUBSCRIPTION, getVariant, subscriberPrice, type Product, type SizeId } from "@/lib/catalog";
import { useQuickAdd } from "@/components/fx/useQuickAdd";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { TbdTag } from "@/components/ui/Tbd";
import { formatMoney } from "@/lib/format";
import { useCalmTransition } from "@/components/motion/MotionPreference";
import { SizeChips } from "./SizeChips";

type Mode = "subscribe" | "one-time";

const noopSubscribe = () => () => {};

export function BuyBox({ product }: { product: Product }) {
  const [size, setSize] = useState<SizeId>(DEFAULT_SIZE);
  const [mode, setMode] = useState<Mode>("subscribe");
  const [frequency, setFrequency] = useState<string>(SUBSCRIPTION.defaultFrequency);
  const [qty, setQty] = useState(1);
  const [ctaVisible, setCtaVisible] = useState(true);
  const t = useCalmTransition();
  const ctaRef = useRef<HTMLButtonElement>(null);
  const quickAdd = useQuickAdd();
  // The quick-add bar is portalled to <body>: any transformed/animated ancestor
  // (entrance animations, page transitions) would otherwise become its containing
  // block and drag the "fixed" bar off-screen with the page.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const variant = getVariant(product, size);
  const unit = mode === "subscribe" ? subscriberPrice(variant.price) : variant.price;
  const total = { ...unit, money: { ...unit.money, amount: unit.money.amount * qty } };
  const sizeLabel = SIZES.find((s) => s.id === size)!.label;
  const cta = mode === "subscribe" ? "Start my subscription" : "Grab a jar";

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    // The root is extended far below the viewport, so "intersecting" means "not yet
    // scrolled past the top". Crossing the top edge is always an intersection change,
    // even on an instant jump (no smooth scroll, End key, restored scroll position)
    // that skips straight from below the viewport to above it.
    const io = new IntersectionObserver(([entry]) => setCtaVisible(entry!.isIntersecting), {
      rootMargin: "0px 0px 100000px 0px",
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // While the bar is showing, reserve its measured height at the bottom of the page
  // (mobile only, see globals.css) so it never covers the end of the footer.
  const barRef = useCallback((bar: HTMLDivElement | null) => {
    const root = document.documentElement;
    if (!bar) {
      delete root.dataset.quickAdd;
      root.style.removeProperty("--quick-add-h");
      return;
    }
    root.dataset.quickAdd = "";
    const ro = new ResizeObserver(() => root.style.setProperty("--quick-add-h", `${bar.offsetHeight}px`));
    ro.observe(bar);
    return () => {
      ro.disconnect();
      delete root.dataset.quickAdd;
      root.style.removeProperty("--quick-add-h");
    };
  }, []);

  const onAdd = () =>
    void quickAdd(
      {
        merchandiseId: variant.id,
        quantity: qty,
        purchase: mode === "subscribe" ? { mode: "subscribe", frequency } : { mode: "one-time" },
      },
      {
        source: document.getElementById("product-jar"),
        look: { labelColor: product.jar.labelColor, honey: product.jar.honey },
        label: `No. ${product.number} ${product.name} (${sizeLabel})`,
        openDrawer: true,
      },
    );

  const option = (m: Mode) =>
    `flex w-full flex-col items-start gap-1 rounded-2xl border-2 border-nero px-5 py-3.5 text-left transition-[background-color,color,transform] duration-300 ease-[var(--ease-pop)] ${
      mode === m ? "-translate-y-0.5 bg-nero text-canvas shadow-[0_4px_0_0_#ff007c]" : "bg-transparent hover:bg-nero/[0.06]"
    }`;

  return (
    <div className="flex flex-col gap-6">
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-serif text-[48px] font-medium leading-none tracking-[-0.02em]" aria-live="polite">
        <Price price={total} tag={mode === "subscribe" ? "Placeholder price & discount" : "Placeholder price"} />
        <span className="font-mono text-[13px] font-bold tracking-[0.06em]">
          {mode === "subscribe" ? "subscriber price" : "one-time"} · {sizeLabel}
          {qty > 1 ? ` · ${qty} × ${formatMoney(unit.money)}` : ""}
        </span>
      </p>

      <div className="flex flex-col gap-2.5">
        <span className="t-eyebrow">Size</span>
        <SizeChips value={size} onChange={setSize} name={`buy-size-${product.slug}`} size="lg" />
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="t-eyebrow mb-2.5">How to buy</legend>
        <label className={`${option("subscribe")} cursor-pointer has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-nero`}>
          <input type="radio" name={`mode-${product.slug}`} className="sr-only" checked={mode === "subscribe"} onChange={() => setMode("subscribe")} />
          <span className="flex flex-wrap items-center gap-2 font-serif text-[26px] font-medium tracking-[-0.01em]">
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
                  className="min-h-11 rounded-full border-2 border-nero bg-canvas px-4 font-mono text-[15px]"
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
        <label className={`${option("one-time")} cursor-pointer has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-nero`}>
          <input type="radio" name={`mode-${product.slug}`} className="sr-only" checked={mode === "one-time"} onChange={() => setMode("one-time")} />
          <span className="font-serif text-[26px] font-medium tracking-[-0.01em]">One-time purchase</span>
        </label>
      </fieldset>

      <div className="flex flex-wrap items-stretch gap-3">
        <QuantityStepper value={qty} onChange={setQty} />
        <button ref={ctaRef} type="button" onClick={onAdd} className="btn min-h-[56px] flex-1 bg-peacock text-[28px] text-canvas">
          {cta}
        </button>
      </div>

      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
        <li>Raw &amp; unprocessed</li>
        <li aria-hidden="true">·</li>
        <li>Traceable to the hive</li>
        <li aria-hidden="true">·</li>
        <li>
          Ships <TbdTag>where TBD</TbdTag>
        </li>
      </ul>

      {/* Mobile quick-add bar */}
      {mounted
        ? createPortal(
            <AnimatePresence>
              {!ctaVisible ? (
                <motion.div
                  ref={barRef}
                  role="region"
                  aria-label="Quick add"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "110%" }}
                  transition={t({ type: "spring", stiffness: 380, damping: 36 })}
                  className="fixed inset-x-2 bottom-2 z-40 flex items-center justify-between gap-3 rounded-[24px] border-2 border-nero bg-canvas py-2.5 pl-5 pr-2.5 shadow-[0_5px_0_0_#262626] mb-[env(safe-area-inset-bottom)] md:hidden"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-serif text-[22px] font-medium leading-tight">
                      No. {product.number} {product.name}
                    </span>
                    <span className="text-[13px]">
                      {formatMoney(total.money)} · {sizeLabel}
                      {unit.placeholder ? " · placeholder" : ""}
                    </span>
                  </span>
                  {/* 24px serif = WCAG "large text": Canvas on Peacock (3.26:1) needs ≥ 24px. */}
                  <button type="button" onClick={onAdd} className="btn min-h-[52px] shrink-0 bg-peacock px-5 text-[24px] text-canvas">
                    {mode === "subscribe" ? "Subscribe" : cta}
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}
