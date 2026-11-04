"use client";

import { useState } from "react";
import { BATCHES, getProduct } from "@/lib/catalog";
import { OrTbd, TbdTag } from "@/components/ui/Tbd";
import { BatchHoney } from "./BatchDetails";

const PAST = BATCHES.filter((b) => b.status === "past");
const INITIAL = 4;

export function PastBatches() {
  const [all, setAll] = useState(false);
  const rows = all ? PAST : PAST.slice(0, INITIAL);
  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
          <caption className="sr-only">Past Sweet Bee batches (placeholder data)</caption>
          <thead>
            <tr className="border-b-2 border-nero">
              {["Batch", "Jar", "Honey", "Beekeeper area", "Harvest"].map((h) => (
                <th key={h} scope="col" className="t-eyebrow py-3 pr-6 text-[13px] font-normal text-forest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => {
              const p = getProduct(b.productSlug)!;
              return (
                <tr id={`batch-${b.code}`} key={b.code} className="batch-card border-b border-nero/25 transition-colors hover:bg-peacock/15">
                  <th scope="row" className="py-4 pr-6 font-normal">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      {b.code} {b.placeholder ? <TbdTag>TBD</TbdTag> : null}
                    </span>
                  </th>
                  <td className="py-4 pr-6 font-serif text-[22px] tracking-[0.025em]">
                    <span className="mr-2 inline-block size-3 rounded-full border border-nero align-middle" style={{ background: p.jar.labelColor }} aria-hidden="true" />
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
          <button type="button" aria-expanded={all} onClick={() => setAll((v) => !v)} className="btn min-h-[52px] bg-nero px-6 text-[15px] text-canvas">
            {all ? "Show fewer batches" : "Show older batches"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
