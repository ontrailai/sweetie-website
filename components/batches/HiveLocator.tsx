"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { BATCHES, getProduct } from "@/lib/catalog";
import { JarPhoto } from "@/components/jar/JarPhoto";
import { useCalmTransition } from "@/components/motion/MotionPreference";
import { CountyMap } from "./CountyMap";
import { BatchCode, BatchDl } from "./BatchDetails";
import { SELECT_BATCH_EVENT } from "./BatchScanner";

const onShelves = BATCHES.filter((b) => b.status === "on-shelves");

/** Interactive hive map: tap a pin (or a jar below) to read its batch ticket. */
export function HiveLocator() {
  const [selected, setSelected] = useState<string>(onShelves[0]!.code);
  const t = useCalmTransition();
  const batch = onShelves.find((b) => b.code === selected) ?? onShelves[0]!;
  const p = getProduct(batch.productSlug)!;

  useEffect(() => {
    const on = (e: Event) => {
      const code = (e as CustomEvent<string>).detail;
      if (onShelves.some((b) => b.code === code)) setSelected(code);
    };
    window.addEventListener(SELECT_BATCH_EVENT, on);
    return () => window.removeEventListener(SELECT_BATCH_EVENT, on);
  }, []);

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.35fr_1fr]">
      <div className="flex flex-col gap-5">
        <CountyMap batches={onShelves} selected={selected} onSelect={setSelected} />
        <div role="group" aria-label="Choose a jar's batch" className="flex flex-wrap gap-2">
          {onShelves.map((b) => {
            const x = getProduct(b.productSlug)!;
            const on = b.code === selected;
            return (
              <button
                key={b.code}
                type="button"
                aria-pressed={on}
                onClick={() => setSelected(b.code)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-nero px-4 font-mono text-[13px] font-bold transition-transform duration-300 ease-[var(--ease-pop)] ${
                  on ? "-translate-y-0.5 bg-nero text-canvas shadow-[0_4px_0_0_#ff007c]" : "bg-canvas text-nero hover:-translate-y-0.5"
                }`}
              >
                <span aria-hidden="true" className="size-3 rounded-full border border-nero" style={{ background: x.jar.labelColor }} />
                No. {x.number}
              </button>
            );
          })}
        </div>
      </div>
      <div aria-live="polite" className="lg:sticky lg:top-28">
        <AnimatePresence mode="wait">
          <motion.article
            key={batch.code}
            initial={{ opacity: 0, x: 30, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -30, rotate: -3 }}
            transition={t({ type: "spring", stiffness: 300, damping: 28 })}
            className="ticket flex flex-col gap-4 p-6 [--notch-y:110px]"
          >
            <div className="flex items-start gap-5">
              <div className="w-16 shrink-0">
                <JarPhoto product={p} sizes="64px" placeholder={false} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="t-eyebrow">
                  Hive pin · No. {p.number} {p.name}
                </p>
                <h3 className="font-serif text-[36px] font-medium leading-none tracking-[-0.02em]">
                  <BatchCode batch={batch} />
                </h3>
              </div>
            </div>
            <BatchDl batch={batch} />
            <Link href={`/shop/${p.slug}`} className="btn btn-sm self-start bg-nero text-canvas">
              Shop No. {p.number} →
            </Link>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
