"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

type Filter = "All" | Category;

export function ShopFilter() {
  const [filter, setFilter] = useState<Filter>("All");
  const shown = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
  const filters: Filter[] = ["All", ...CATEGORIES];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <LayoutGroup id="shop-filter">
          <div role="group" aria-label="Filter jars" className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = f === filter;
              const count = f === "All" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === f).length;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f)}
                  className={`relative min-h-11 border-[1.5px] border-nero px-4 text-[15px] transition-colors ${active ? "text-canvas" : "hover:bg-nero/10"}`}
                >
                  {active ? <motion.span layoutId="filter-pill" className="absolute inset-0 bg-nero" transition={{ type: "spring", stiffness: 420, damping: 34 }} /> : null}
                  <span className="relative">
                    {f} <span className="opacity-60">({count})</span>
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
        <p className="text-[15px]" aria-live="polite">
          Showing {shown.length} of {PRODUCTS.length} jars
        </p>
      </div>
      <motion.ul layout className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-7 sm:gap-y-14 md:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <ProductCard product={p} headingLevel={2} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
