"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { BATCHES, PRODUCTS, getProduct } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { BatchCode, BatchDl } from "./BatchDetails";

const current = BATCHES.filter((b) => b.status === "on-shelves");

/** Batches on shelves now, as tear-off tickets in each jar's colour. */
export function BatchShelf() {
  const [filter, setFilter] = useState<string>("all");
  const shown = filter === "all" ? current : current.filter((b) => b.productSlug === filter);

  return (
    <div className="flex flex-col gap-8">
      <LayoutGroup id="batch-filter">
        <div role="group" aria-label="Filter by jar" className="flex flex-wrap gap-2">
          {[{ slug: "all", label: "All six" }, ...PRODUCTS.map((p) => ({ slug: p.slug, label: `No. ${p.number}` }))].map((f) => {
            const active = f.slug === filter;
            return (
              <button
                key={f.slug}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.slug)}
                className={`relative min-h-11 rounded-full border-2 border-nero px-4 font-mono text-[13px] font-bold uppercase tracking-[0.08em] ${active ? "text-canvas" : "bg-canvas text-nero hover:bg-nero/10"}`}
              >
                {active ? <motion.span layoutId="batch-pill" className="absolute inset-0 rounded-full bg-nero" transition={{ type: "spring", stiffness: 420, damping: 34 }} /> : null}
                <span className="relative">{f.label}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
      <motion.ul layout className="grid grid-cols-[repeat(auto-fill,minmax(min(380px,100%),1fr))] gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((b, i) => {
            const p = getProduct(b.productSlug)!;
            return (
              <motion.li
                key={b.code}
                id={`batch-${b.code}`}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="batch-card group flex scroll-mt-28 overflow-hidden rounded-[24px] border-2 border-nero bg-canvas shadow-[6px_6px_0_0_#262626]"
                style={{ rotate: `${[-1, 0.8, -0.5][i % 3]}deg` }}
              >
                {/* stub in the jar's colour */}
                <div className="relative flex w-[30%] shrink-0 flex-col items-center justify-end gap-2 border-r-2 border-dashed border-nero px-3 pb-4 pt-5" style={{ background: p.jar.labelColor }}>
                  <div className="w-[62%] transition-transform duration-500 ease-[var(--ease-pop)] group-hover:-translate-y-2 group-hover:-rotate-6">
                    <Jar {...p.jar} number={p.number} name={p.name} descriptor={p.descriptor} decorative alive={false} />
                  </div>
                  <span className="chip text-[11px]">No. {p.number}</span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2 p-5">
                  <p className="t-eyebrow text-[11px]">{p.name}</p>
                  <h3 className="font-serif text-[32px] font-medium leading-none tracking-[-0.02em]">
                    <BatchCode batch={b} />
                  </h3>
                  <BatchDl batch={b} />
                  <Link href={`/shop/${p.slug}`} className="mt-1 self-start text-[13px] font-bold underline underline-offset-4">
                    Shop No. {p.number}
                  </Link>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
