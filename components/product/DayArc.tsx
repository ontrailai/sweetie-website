"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import type { Ritual } from "@/lib/catalog";
import { useMotionPref } from "@/components/motion/MotionPreference";

const ARC = "M 40 300 C 300 -60, 900 -60, 1160 300";
const P = [
  [40, 300],
  [300, -60],
  [900, -60],
  [1160, 300],
] as const;
/** Point on the arc (a cubic Bézier) as % of the 1200×320 box. */
function onArc(t: number, axis: 0 | 1) {
  const u = 1 - t;
  const v = u * u * u * P[0][axis] + 3 * u * u * t * P[1][axis] + 3 * u * t * t * P[2][axis] + t * t * t * P[3][axis];
  return `${((v / (axis ? 320 : 1200)) * 100).toFixed(2)}%`;
}

/** A day with a jar: a sun travels the arc as you scroll past three moments. */
export function DayArc({ rituals, title, id = "day-h" }: { rituals: Ritual[]; title: ReactNode; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = useMotionPref();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.3"] });
  const t = useTransform(scrollYProgress, [0, 1], [0.04, 0.96]);
  const left = useTransform(t, (v) => onArc(v, 0));
  const top = useTransform(t, (v) => onArc(v, 1));

  return (
    <section ref={ref} aria-labelledby={id} className="on-dark px-gutter relative overflow-hidden bg-nero py-[clamp(80px,10vw,160px)] text-canvas">
      <div className="container-x flex flex-col gap-10">
        <h2 id={id} className="display text-[clamp(64px,8vw,150px)]">
          {title}
        </h2>
        <div aria-hidden="true" className="relative -mb-10 hidden md:block">
          <svg viewBox="0 0 1200 320" className="w-full overflow-visible">
            <path d={ARC} fill="none" stroke="#ff007c" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" />
            <path d="M0 300 H1200" stroke="#f6eddd" strokeOpacity="0.3" strokeWidth="2" />
          </svg>
          <motion.span
            key={String(enabled)}
            className="absolute block size-[clamp(48px,5vw,80px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-canvas bg-ladybug shadow-[0_0_60px_20px_rgba(255,0,124,0.35)]"
            style={enabled ? { left, top } : { left: onArc(0.5, 0), top: onArc(0.5, 1) }}
          />
        </div>
        <ol className="grid gap-10 md:grid-cols-3">
          {rituals.map((r, i) => (
            <li key={r.time + r.title} className="rise flex flex-col gap-3 border-t-2 border-dashed border-canvas/40 pt-6" style={{ ["--d" as string]: `${i * 120}ms` }}>
              <span className="display text-[clamp(72px,7vw,128px)] text-peacock">{r.time}</span>
              <h3 className="font-serif text-[clamp(30px,2.6vw,40px)] font-medium leading-none tracking-[-0.02em]">{r.title}</h3>
              <p className="max-w-[36ch] text-[15px] leading-[1.7]">{r.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
