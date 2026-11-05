"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState, useSyncExternalStore } from "react";
import { getProduct, type Product } from "@/lib/catalog";
import { MiniJar } from "@/components/jar/MiniJar";
import { useMotionPref } from "@/components/motion/MotionPreference";

interface Moment {
  time: string;
  title: string;
  body: string;
  jars: string[];
  /** static gradient for the stacked (calm / phone) layout */
  sky: [string, string, string];
  /** the sun for that moment */
  sun: string;
}

const MOMENTS: Moment[] = [
  {
    time: "6 AM",
    title: "The sunrise spoonful",
    body: "Straight off the spoon before the surf check. Bright, floral, awake.",
    jars: ["wildflower", "bee-pollen"],
    sun: "#ff0000",
    sky: ["#004832", "#ff007c", "#f6eddd"],
  },
  {
    time: "9 AM",
    title: "Before the paddle out",
    body: "No. 06 Guarana + Salt comes along for the paddle out, the bluff run, the long beach walk.",
    jars: ["guarana-salt", "avocado-blossom"],
    sun: "#f6eddd",
    sky: ["#308f32", "#308f32", "#f6eddd"],
  },
  {
    time: "6 PM",
    title: "Golden hour",
    body: "Vanilla Bean or Cinnamon, stirred into something warm as the sun drops into the Pacific.",
    jars: ["vanilla-bean", "cinnamon"],
    sun: "#f6eddd",
    sky: ["#ff007c", "#ff0000", "#ff0000"],
  },
];

const WIDE = "(min-width: 1024px)";
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

function Waves({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`}>
      {[
        { c: "#004832", h: "22%", d: "9s", o: 0 },
        { c: "#262626", h: "14%", d: "6.5s", o: 1 },
      ].map((w, i) => (
        <div key={i} className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ height: w.h }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="honey-wave absolute left-0 top-0 h-[40px] w-[200%]" style={{ animationDuration: w.d, animationDirection: w.o ? "reverse" : "normal" }}>
            <path d="M0 30 Q 60 0 120 30 T 240 30 T 360 30 T 480 30 T 600 30 T 720 30 T 840 30 T 960 30 T 1080 30 T 1200 30 T 1320 30 T 1440 30 V60 H0Z" fill={w.c} />
          </svg>
          <div className="absolute inset-x-0 bottom-0 top-[38px]" style={{ background: w.c }} />
        </div>
      ))}
    </div>
  );
}

function Surfer({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 160 70" aria-hidden="true" className={className} style={style}>
      <path d="M6 56 C 40 48, 120 48, 154 54 C 120 64, 40 66, 6 56 Z" fill="#f6eddd" stroke="#262626" strokeWidth="3" />
      <path d="M60 52 L76 30 L96 36 L104 52" fill="none" stroke="#262626" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="74" cy="20" r="9" fill="#262626" />
      <path d="M78 34 L52 50" stroke="#262626" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function MomentCard({ m, active, index }: { m: Moment; active: boolean; index: number }) {
  const jars = m.jars.map((s) => getProduct(s)).filter((p): p is Product => !!p);
  return (
    <article
      className={`ticket flex flex-col gap-3 p-5 transition-[transform,box-shadow] duration-500 ease-[var(--ease-pop)] [--notch-y:70%] ${
        active ? "-translate-y-3 [--ticket-shadow:6px_10px_0_#262626]" : "[--ticket-shadow:3px_3px_0_#262626]"
      }`}
      aria-current={active ? "true" : undefined}
    >
      <p className="t-eyebrow flex items-center justify-between">
        <span>{m.time}</span>
        <span aria-hidden="true">0{index + 1}/03</span>
      </p>
      <h3 className="font-serif text-[clamp(28px,2.4vw,38px)] font-medium leading-[0.95] tracking-[-0.02em]">{m.title}</h3>
      <p className="text-[14px] leading-[1.6]">{m.body}</p>
      <ul className="mt-1 flex flex-wrap gap-2">
        {jars.map((p) => (
          <li key={p.slug}>
            <Link href={`/shop/${p.slug}`} className="group inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-nero bg-canvas py-1 pl-1.5 pr-3 font-mono text-[13px] font-bold hover:bg-nero hover:text-canvas">
              <MiniJar look={p.jar} className="w-3.5" />
              No. {p.number} {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

/** Pinned: one sky that shifts from dawn to golden hour as you scroll. */
function PinnedSky() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const i = v < 0.36 ? 0 : v < 0.7 ? 1 : 2;
    setActive((a) => (a === i ? a : i));
  });
  const stops = [0.05, 0.5, 0.95];
  // Brand colours only: Forest night → Peacock dawn over a Canvas horizon,
  // a Jade morning, then a Peacock/Ladybug golden hour.
  const top = useTransform(p, stops, ["#004832", "#308f32", "#ff007c"]);
  const mid = useTransform(p, stops, ["#ff007c", "#308f32", "#ff0000"]);
  const low = useTransform(p, stops, ["#f6eddd", "#f6eddd", "#ff0000"]);
  const bg = useTransform([top, mid, low] as MotionValue<string>[], ([t, m, l]) => `linear-gradient(180deg, ${t} 0%, ${m} 55%, ${l} 82%)`);
  const sunX = useTransform(p, [0, 0.5, 1], ["8%", "50%", "88%"]);
  const sunY = useTransform(p, [0, 0.5, 1], ["62%", "6%", "58%"]);
  const sunColor = useTransform(p, stops, MOMENTS.map((m) => m.sun));
  const sunScale = useTransform(p, [0, 0.5, 1], [1.3, 0.8, 1.5]);
  const surferX = useTransform(p, [0, 1], ["-5%", "70%"]);
  const timeLabel = MOMENTS[active]!.time;

  return (
    <div ref={track} className="sky-track relative">
      <motion.div className="sky-stage on-dark relative isolate flex flex-col overflow-hidden text-canvas" style={{ background: bg }}>
        <motion.div
          aria-hidden="true"
          className="sun-banded absolute -z-10 aspect-square w-[clamp(140px,16vw,260px)] -translate-x-1/2 rounded-full"
          style={{ left: sunX, top: sunY, ["--sun" as string]: sunColor, scale: sunScale }}
        />
        <Waves className="h-[22%]" />
        <motion.div aria-hidden="true" className="absolute bottom-[12%] z-30 w-[clamp(110px,12vw,180px)]" style={{ left: surferX }}>
          <Surfer className="float w-full" style={{ animationDuration: "3s" }} />
        </motion.div>

        <div className="pt-header px-gutter relative z-20 flex flex-1 flex-col pb-[24svh]">
          <div className="container-x flex flex-1 flex-col justify-between gap-6">
            <div className="flex items-start justify-between gap-6">
              <h2 id="sky-h" className="display max-w-[9ch] text-[clamp(64px,7.6vw,140px)]">
                Sunrise to <em>golden hour.</em>
              </h2>
              <p aria-hidden="true" className="display text-stroke -mt-[0.1em] text-right text-[clamp(110px,15vw,280px)] tabular-nums">
                {timeLabel}
              </p>
            </div>
            <ol className="grid grid-cols-3 gap-5" aria-label="Three moments for a spoonful">
              {MOMENTS.map((m, i) => (
                <li key={m.time}>
                  <MomentCard m={m} index={i} active={active === i} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/** Calm / phone layout: three panels, each with its own sky. */
function StackedSky() {
  return (
    <div>
      <div className="px-gutter on-dark bg-forest pb-6 pt-16 text-canvas">
        <h2 id="sky-h" className="display container-x text-[clamp(64px,14vw,140px)]">
          Sunrise to <em>golden hour.</em>
        </h2>
      </div>
      <ol aria-label="Three moments for a spoonful">
        {MOMENTS.map((m, i) => (
          <li
            key={m.time}
            className="on-dark relative isolate flex min-h-[86svh] flex-col justify-end overflow-hidden px-gutter pb-[18svh] pt-16 text-canvas"
            style={{ background: `linear-gradient(180deg, ${m.sky[0]} 0%, ${m.sky[1]} 55%, ${m.sky[2]} 82%)` }}
          >
            <div
              aria-hidden="true"
              className="sun-banded absolute -z-10 aspect-square w-[42vw] max-w-[220px] -translate-x-1/2 rounded-full"
              style={{ left: ["18%", "50%", "80%"][i], top: ["40%", "10%", "36%"][i], ["--sun" as string]: m.sun }}
            />
            <Waves className="h-[22%]" />
            <p aria-hidden="true" className="display text-stroke absolute left-[var(--gutter)] top-10 text-[clamp(96px,26vw,220px)]">
              {m.time}
            </p>
            <div className="container-x relative z-10 max-w-[520px]">
              <MomentCard m={m} index={i} active={false} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SkyRituals() {
  const { enabled } = useMotionPref();
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => true);
  return (
    <section id="rituals" aria-labelledby="sky-h" className="relative">
      {enabled && wide ? <PinnedSky /> : <StackedSky />}
    </section>
  );
}
