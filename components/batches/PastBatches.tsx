"use client";

import { useEffect, useState } from "react";
import { BATCHES, getProduct } from "@/lib/catalog";
import { OrTbd, TbdTag } from "@/components/ui/Tbd";
import { BatchHoney } from "./BatchDetails";
import { SELECT_BATCH_EVENT } from "./BatchScanner";

const PAST = BATCHES.filter((b) => b.status === "past");
const INITIAL = 4;

export function PastBatches() {
  const [all, setAll] = useState(false);
  // A lookup of an older batch opens the full list so its row can be shown.
  useEffect(() => {
    const on = (e: Event) => {
      const code = (e as CustomEvent<string>).detail;
      if (PAST.findIndex((b) => b.code === code) >= INITIAL) setAll(true);
    };
    window.addEventListener(SELECT_BATCH_EVENT, on);
    return () => window.removeEventListener(SELECT_BATCH_EVENT, on);
  }, []);
  const rows = all ? PAST : PAST.slice(0, INITIAL);
  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
          <caption className="sr-only">Past Sweet Bee batches (placeholder data)</caption>
          <thead>
            <tr className="border-b-2 border-canvas">
              {["Batch", "Jar", "Honey", "Beekeeper area", "Harvest"].map((h) => (
                <th key={h} scope="col" className="t-eyebrow py-3 pr-6 text-[12px]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => {
              const p = getProduct(b.productSlug)!;
              return (
                <tr id={`batch-${b.code}`} key={b.code} className="batch-card border-b border-dashed border-canvas/30 transition-colors hover:bg-canvas/10">
                  <th scope="row" className="py-4 pr-6 font-normal">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      {b.code} {b.placeholder ? <TbdTag>TBD</TbdTag> : null}
                    </span>
                  </th>
                  <td className="py-4 pr-6 font-serif text-[clamp(24px,2.4vw,34px)] font-medium tracking-[-0.02em]">
                    <span className="mr-2 inline-block size-3.5 rounded-full border-2 border-canvas align-middle" style={{ background: p.jar.labelColor }} aria-hidden="true" />
                    No. {p.number} {p.name}
                  </td>
                  <td className="py-4 pr-6">
                    <BatchHoney batch={b} />
                  </td>
                  <td className="py-4 pr-6">
                    <OrTbd value={b.area} fallback="Area" />
                  </td>
                  <td className="py-4">
                    <OrTbd value={b.harvest} fallback="Season, year" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {PAST.length > INITIAL ? (
        <div>
          <button type="button" aria-expanded={all} onClick={() => setAll((v) => !v)} className="btn btn-sm bg-canvas text-nero">
            {all ? "Show fewer batches" : "Show older batches"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
