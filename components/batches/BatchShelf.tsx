"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { BATCHES, PRODUCTS, getProduct } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { BatchCode, BatchDl } from "./BatchDetails";

const current = BATCHES.filter((b) => b.status === "on-shelves");

export function BatchShelf() {
  const [filter, setFilter] = useState<string>("all");
  const shown = filter === "all" ? current : current.filter((b) => b.productSlug === filter);

  return (
    <div className="flex flex-col gap-8">
      <LayoutGroup id="batch-filter">
        <div role="group" aria-label="Filter by jar" className="flex flex-wrap gap-2">
          {[{ slug: "all", label: "All" }, ...PRODUCTS.map((p) => ({ slug: p.slug, label: `No. ${p.number}` }))].map((f) => {
            const active = f.slug === filter;
            return (
              <button
                key={f.slug}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.slug)}
                className={`relative min-h-11 border-[1.5px] border-nero px-4 text-[15px] transition-colors ${active ? "text-canvas" : "hover:bg-nero/10"}`}
              >
                {active ? <motion.span layoutId="batch-pill" className="absolute inset-0 bg-nero" transition={{ type: "spring", stiffness: 420, damping: 34 }} /> : null}
                <span className="relative">{f.label}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
      <motion.ul layout className="grid grid-cols-[repeat(auto-fill,minmax(min(380px,100%),1fr))] gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((b) => {
            const p = getProduct(b.productSlug)!;
            return (
              <motion.li
                key={b.code}
                id={`batch-${b.code}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="batch-card group flex scroll-mt-28 gap-5 border-2 border-nero bg-canvas p-5 transition-shadow hover:shadow-[6px_6px_0_0_#262626]"
              >
                <div className="flex w-[clamp(64px,7vw,84px)] shrink-0 items-end justify-center bg-nero/[0.06] px-2.5 pb-2 pt-3">
                  <div className="w-full transition-transform duration-500 ease-[var(--ease-pop)] group-hover:-translate-y-2">
                    <Jar {...p.jar} number={p.number} name={p.name} descriptor={p.descriptor} decorative alive={false} />
                  </div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <p className="t-eyebrow text-[13px] text-forest">
                    No. {p.number} · {p.name}
                  </p>
                  <h3 className="text-[30px] leading-none">
                    <BatchCode batch={b} />
                  </h3>
                  <BatchDl batch={b} />
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
