"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/catalog";
import { JarCard } from "./JarCard";

type Filter = "All" | Category;
const TILTS = [-1.5, 1, -0.5, 1.5, -1, 0.5];

export function ShopFilter() {
  const [filter, setFilter] = useState<Filter>("All");
  const shown = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
  const filters: Filter[] = ["All", ...CATEGORIES];

  return (
    <div className="flex flex-col gap-10">
      <LayoutGroup id="shop-filter">
        <div role="group" aria-label="Filter jars by type" className="flex flex-wrap items-center gap-2">
          {filters.map((f, i) => {
            const active = f === filter;
            const count = f === "All" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === f).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={`relative inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-nero px-5 font-mono text-[14px] font-bold uppercase tracking-[0.1em] transition-transform duration-300 ease-[var(--ease-pop)] hover:-rotate-2 ${
                  active ? "text-canvas" : "bg-canvas text-nero"
                }`}
                style={{ rotate: `${(i % 2 ? 1 : -1) * 1.5}deg` }}
              >
                {active ? <motion.span layoutId="shop-pill" className="absolute inset-0 rounded-full bg-nero shadow-[0_4px_0_0_#ff007c]" transition={{ type: "spring", stiffness: 420, damping: 32 }} /> : null}
                <span className="relative">{f}</span>
                <span className="relative grid size-6 place-items-center rounded-full border-2 border-current text-[11px]">{count}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "jar" : "jars"}
        {filter === "All" ? "" : ` in ${filter}`}
      </p>
      <motion.ul layout className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotate: 6 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <JarCard product={p} tilt={TILTS[i % TILTS.length]} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
