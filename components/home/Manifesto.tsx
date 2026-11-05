"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Fragment, useRef } from "react";
import { PRODUCTS } from "@/lib/catalog";
import { useMotionPref } from "@/components/motion/MotionPreference";

type Token = { w: string; em?: boolean; pink?: boolean } | { jars: true };

const COPY: Token[] = [
  ..."Honey got".split(" ").map((w) => ({ w })),
  { w: "sleepy.", em: true, pink: true },
  ..."Same bear, same beige label, same shelf. So we bottle raw San Diego County honey in".split(" ").map((w) => ({ w })),
  { w: "six", em: true },
  { w: "loud", em: true },
  { w: "jars", em: true },
  { jars: true },
  ..."number every batch, and trace it back to the".split(" ").map((w) => ({ w })),
  { w: "hive.", em: true, pink: true },
  ..."Your daily spoonful, six ways.".split(" ").map((w) => ({ w })),
];

function Word({ i, total, p, children, className }: { i: number; total: number; p: MotionValue<number>; children: React.ReactNode; className?: string }) {
  const start = i / total;
  const opacity = useTransform(p, [start - 0.04, start + 0.04], [0.14, 1]);
  const y = useTransform(p, [start - 0.04, start + 0.04], ["0.18em", "0em"]);
  return (
    <motion.span className={`inline-block ${className ?? ""}`} style={{ opacity, y }}>
      {children}
    </motion.span>
  );
}

/** A manifesto that lights up word by word as you read (scroll-scrubbed). */
export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { enabled } = useMotionPref();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const total = COPY.length;

  return (
    <section aria-labelledby="manifesto-h" className="px-gutter relative bg-canvas pb-[clamp(80px,12vw,200px)] pt-[clamp(24px,4vw,64px)]">
      <h2 id="manifesto-h" className="sr-only">
        Why Sweet Bee
      </h2>
      <div ref={ref} className="container-x">
        <p className="t-eyebrow mb-8 flex items-center gap-3">
          <span className="inline-block size-3 rounded-full bg-peacock" /> The manifesto, short version
        </p>
        <p className="font-serif text-[clamp(40px,6.4vw,112px)] font-normal leading-[0.98] tracking-[-0.035em] [font-variation-settings:'opsz'_144,'SOFT'_80,'WONK'_1]">
          {COPY.map((t, i) => (
            <Fragment key={i}>
              {"jars" in t ? (
                <span aria-hidden="true" className="mx-[0.1em] inline-flex -translate-y-[0.08em] items-center gap-[0.06em] align-middle">
                  {PRODUCTS.map((p) => (
                    <span key={p.slug} className="inline-block h-[0.62em] w-[0.24em] rounded-[0.05em] border-[0.03em] border-nero" style={{ background: p.jar.labelColor }} />
                  ))}
                </span>
              ) : enabled ? (
                <Word i={i} total={total} p={scrollYProgress} className={`${t.em ? "italic" : ""} ${t.pink ? "text-peacock" : ""}`}>
                  {t.w}
                </Word>
              ) : (
                <span className={`${t.em ? "italic" : ""} ${t.pink ? "text-peacock" : ""}`}>{t.w}</span>
              )}{" "}
            </Fragment>
          ))}
        </p>
        <p className="mt-10 font-mono text-[15px] font-bold uppercase tracking-[0.16em]">Zero sleepy honey. Feel the hum.</p>
      </div>
    </section>
  );
}
