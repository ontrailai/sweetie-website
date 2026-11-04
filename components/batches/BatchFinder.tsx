"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type FormEvent } from "react";
import { BATCHES, findBatch, getProduct, type Batch } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { Honeycomb } from "@/components/brand/Illustrations";
import { BatchCode, BatchDl } from "./BatchDetails";

type Result = { kind: "found"; batch: Batch } | { kind: "missing"; query: string } | null;

export function BatchFinder() {
  const id = useId();
  const [q, setQ] = useState("");
  const [result, setResult] = useState<Result>(null);
  const example = BATCHES[0]!.code;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return setResult(null);
    const batch = findBatch(query);
    setResult(batch ? { kind: "found", batch } : { kind: "missing", query });
  };

  const product = result?.kind === "found" ? getProduct(result.batch.productSlug) : undefined;

  return (
    <div className="relative min-w-0 flex-[1_1_420px]">
      <form role="search" onSubmit={onSubmit} className="relative flex flex-col gap-3 bg-canvas p-7 text-nero">
        <Honeycomb className="absolute -top-10 right-6 w-24" color="#262626" />
        <label htmlFor={`${id}-batch`} className="t-eyebrow text-forest">
          Batch number
        </label>
        <div className="flex flex-wrap gap-3">
          <input
            id={`${id}-batch`}
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder={`e.g. ${example}`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-describedby={`${id}-hint`}
            className="min-h-[52px] min-w-0 flex-[1_1_200px] border-2 border-nero bg-white px-3.5 font-mono text-base uppercase text-nero placeholder:normal-case placeholder:text-nero/60"
          />
          <button type="submit" className="btn min-h-[52px] bg-forest px-6 text-base text-canvas">
            Find it
          </button>
        </div>
        <p id={`${id}-hint`} className="text-[13px] leading-normal">
          Batch numbers shown here are placeholders until launch. Try {example}.
        </p>
        <div aria-live="polite">
          <AnimatePresence mode="wait">
            {result?.kind === "found" && product ? (
              <motion.div
                key={result.batch.code}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-3 flex gap-5 border-t-2 border-nero pt-5"
              >
                <div className="w-14 shrink-0">
                  <Jar {...product.jar} number={product.number} name={product.name} descriptor={product.descriptor} decorative />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <p className="t-eyebrow text-forest">
                    Match · No. {product.number} {product.name}
                  </p>
                  <p className="font-serif text-[28px] leading-none">
                    <BatchCode batch={result.batch} />
                  </p>
                  <BatchDl batch={result.batch} />
                  <Link href={`/shop/${product.slug}`} className="mt-1 self-start text-[15px] underline underline-offset-4 hover:text-peacock">
                    Shop No. {product.number}
                  </Link>
                </div>
              </motion.div>
            ) : result?.kind === "missing" ? (
              <motion.p key="missing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 border-t-2 border-nero pt-4 text-[15px] leading-normal">
                No batch matches <strong>{result.query}</strong> yet. Double-check the number on your jar, or scroll down to browse every batch.
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
