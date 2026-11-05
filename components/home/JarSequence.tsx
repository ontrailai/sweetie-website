"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { DEFAULT_SIZE, PRODUCTS, SIZES, getVariant, type Product, type SizeId } from "@/lib/catalog";
import { Jar, TURN } from "@/components/jar/Jar";
import { HoneyPool, JarParticles } from "@/components/jar/JarParticles";
import { useMotionPref } from "@/components/motion/MotionPreference";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { useQuickAdd } from "@/components/fx/useQuickAdd";
import { getTilt } from "@/components/fx/tilt";
import { TiltButton } from "@/components/fx/TiltButton";
import { SizeChips } from "@/components/product/SizeChips";
import { Price } from "@/components/ui/Price";

const N = PRODUCTS.length;
type Mode = "pinned" | "stack" | "swipe";

const WIDE = "(min-width: 1024px)";
function subscribeWide(cb: () => void) {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** f (0..N-1, float) for a scroll progress p, with a short hold at each jar. */
const fOf = (p: number) => Math.max(0, Math.min(N - 1, p * (N - 0.6) - 0.2));
const pOf = (f: number) => (f + 0.2) / (N - 0.6);
const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function JarSequence() {
  const { enabled } = useMotionPref();
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => true);
  const mode: Mode = wide ? (enabled ? "pinned" : "stack") : "swipe";
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const f = useTransform(scrollYProgress, fOf);
  useMotionValueEvent(f, "change", (v) => {
    if (mode !== "pinned") return;
    const i = Math.round(v);
    setActive((a) => (a === i ? a : i));
  });

  // Swipe mode: active slide from horizontal scroll position.
  useEffect(() => {
    const el = stage.current;
    if (!el || mode !== "swipe") return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));
      setActive((a) => (a === i ? a : Math.max(0, Math.min(N - 1, i))));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [mode]);

  // Phones: tilt drives a parallax (CSS vars read by jars + specks).
  useEffect(() => {
    const el = stage.current;
    if (!el || mode !== "swipe" || !enabled) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const loop = () => {
      const t = getTilt();
      if (t.active) {
        x += (t.x - x) * 0.12;
        y += (t.y - y) * 0.12;
        el.style.setProperty("--tx", x.toFixed(3));
        el.style.setProperty("--ty", y.toFixed(3));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      el.style.removeProperty("--tx");
      el.style.removeProperty("--ty");
    };
  }, [mode, enabled]);

  const goTo = useCallback(
    (i: number) => {
      const target = Math.max(0, Math.min(N - 1, i));
      if (mode === "swipe") {
        const el = stage.current;
        el?.scrollTo({ left: target * el.clientWidth, behavior: enabled ? "smooth" : "auto" });
      } else if (mode === "pinned") {
        const s = section.current;
        if (!s) return;
        const top = s.getBoundingClientRect().top + window.scrollY;
        const travel = s.offsetHeight - window.innerHeight;
        scrollToTarget(top + pOf(target) * travel + 2);
      } else {
        const panel = stage.current?.children[target] as HTMLElement | undefined;
        if (panel) scrollToTarget(panel, -80);
      }
      setActive(target);
    },
    [mode, enabled],
  );

  return (
    <section ref={section} id="jars" aria-labelledby="jars-h" className="seq relative scroll-mt-0 bg-nero" style={{ "--panels": N } as CSSProperties}>
      <h2 id="jars-h" className="sr-only">
        Six jars. Pick yours.
      </h2>
      <div
        ref={stage}
        className="seq-stage"
        role="region"
        aria-roledescription="carousel"
        aria-label="The six jars, No. 01 to No. 06"
      >
        {PRODUCTS.map((p, i) => (
          <JarPanel key={`${p.slug}-${mode}`} product={p} index={i} f={f} mode={mode} active={active === i} motionOn={enabled} />
        ))}
      </div>

      {/* Rail: the keyboard (and thumb) way through the six. */}
      <div
        className={`pointer-events-none z-30 flex justify-center px-4 ${
          mode === "stack" ? "hidden" : "sticky bottom-[max(12px,env(safe-area-inset-bottom))] -mt-[84px] h-[84px] items-end"
        }`}
      >
        <div role="group" aria-label="Choose a jar" className="pointer-events-auto flex items-center gap-1.5 rounded-full border-2 border-nero bg-canvas p-1.5 shadow-[0_4px_0_0_#262626]">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Previous jar"
            className="grid size-11 place-items-center rounded-full text-nero transition-colors hover:bg-nero/10 disabled:opacity-30"
          >
            <span aria-hidden="true">←</span>
          </button>
          {PRODUCTS.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`No. ${p.number} ${p.name}`}
              aria-current={active === i ? "true" : undefined}
              className={`grid size-11 place-items-center rounded-full border-2 font-serif text-[17px] font-semibold leading-none transition-transform duration-300 ease-[var(--ease-pop)] max-sm:size-9 max-sm:text-[14px] ${
                active === i ? "scale-110 border-nero" : "border-transparent text-nero hover:-translate-y-0.5"
              }`}
              style={{ background: active === i ? p.jar.labelColor : "transparent" }}
            >
              {/* Active: the jar colour rings a Nero badge (Canvas on Nero,
                  13.6:1) instead of putting small Canvas text on the colour. */}
              <span className={`grid place-items-center rounded-full ${active === i ? "size-[76%] border-[1.5px] border-canvas bg-nero text-canvas" : "size-full"}`}>
                {p.number}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === N - 1}
            aria-label="Next jar"
            className="grid size-11 place-items-center rounded-full text-nero transition-colors hover:bg-nero/10 disabled:opacity-30"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        Showing No. {PRODUCTS[active]!.number} {PRODUCTS[active]!.name}, {active + 1} of {N}
      </p>
    </section>
  );
}

function JarPanel({ product: p, index: i, f, mode, active, motionOn }: { product: Product; index: number; f: MotionValue<number>; mode: Mode; active: boolean; motionOn: boolean }) {
  const pinned = mode === "pinned";
  // Reveal: an iris of the jar's colour opens over the previous panel.
  const reveal = useTransform(f, (v) => (i === 0 ? 1 : smooth(i - 0.85, i - 0.15, v)));
  const clip = useTransform(reveal, (r) => `circle(${(r * 150).toFixed(2)}% at 50% 55%)`);
  const local = useTransform(f, (v) => v - i);
  const spin = useTransform(local, (l) => -l * TURN * 0.9);
  const jarY = useTransform(reveal, (r) => `${((1 - r) * 40).toFixed(2)}%`);
  const jarRot = useTransform(local, (l) => l * -10);
  const pool = useTransform(reveal, (r) => `${(8 + r * 20).toFixed(2)}%`);
  const nameX = useTransform(local, (l) => `${(l * -14).toFixed(2)}vw`);

  const [size, setSize] = useState<SizeId>(DEFAULT_SIZE);
  const variant = getVariant(p, size);
  const quickAdd = useQuickAdd();
  const jarRef = useRef<HTMLDivElement>(null);
  const ink = p.jar.labelText ?? "#F6EDDD";
  const onLight = ink.toUpperCase() === "#262626";
  const sizeLabel = SIZES.find((s) => s.id === size)!.label;
  const shown = !pinned || active;

  return (
    <motion.article
      aria-roledescription="slide"
      aria-label={`${i + 1} of ${N}: No. ${p.number} ${p.name}`}
      inert={pinned && !active ? true : undefined}
      className={`seq-panel ${onLight ? "" : "on-dark"} relative isolate flex min-h-[100svh] flex-col overflow-hidden`}
      style={{ background: p.jar.labelColor, color: ink, ...(pinned ? { clipPath: clip, zIndex: i } : {}) }}
    >
      {/* giant outlined number */}
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none absolute -left-[3vw] bottom-[-6vw] -z-10 text-[clamp(260px,52vw,880px)] leading-[0.7] opacity-30"
      >
        {p.number}
      </span>

      {/* honey rising from the bottom */}
      {pinned ? (
        <motion.div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10" style={{ height: pool }}>
          <HoneyPool product={p} className="!absolute !inset-0 !z-0" />
        </motion.div>
      ) : (
        <HoneyPool product={p} style={{ height: "22%" }} />
      )}

      <JarParticles product={p} shown={shown} staggered={motionOn} />

      <div className="pt-header px-gutter relative flex flex-1 flex-col pb-32 lg:pb-10">
        <div className="container-x relative grid flex-1 items-center gap-6 lg:grid-cols-[1.15fr_0.9fr_0.95fr]">
          {/* name */}
          <motion.div style={pinned && motionOn ? { x: nameX } : undefined} className="relative z-10 flex flex-col gap-4 max-lg:order-1">
            <span className="chip self-start">
              No. {p.number} · {p.category}
            </span>
            <h3 className="display text-[clamp(72px,10.5vw,190px)]">
              {p.display.lead.trim()}
              {p.display.lead.endsWith(" ") ? <br /> : null}
              <em>{p.display.em}</em>
            </h3>
            <p className="font-serif text-[clamp(26px,2.6vw,40px)] italic leading-tight">{p.tagline}</p>
          </motion.div>

          {/* the jar */}
          <motion.div
            ref={jarRef}
            className="relative mx-auto w-[clamp(120px,15vw,250px)] max-lg:order-2 max-lg:my-2 max-lg:w-[min(27vw,124px)]"
            style={pinned && motionOn ? { y: jarY, rotate: jarRot } : { translate: "calc(var(--tx, 0) * 18px) calc(var(--ty, 0) * 10px)" }}
          >
            <Jar {...p.jar} number={p.number} name={p.name} descriptor={p.descriptor} spin={pinned && motionOn ? spin : undefined} alive={shown && motionOn} decorative />
          </motion.div>

          {/* ticket */}
          <div className="ticket relative z-10 flex flex-col gap-4 p-6 max-lg:order-3 lg:justify-self-end lg:max-w-[400px] [--notch-y:62%]">
            <p className="text-[15px] leading-[1.6]">{p.description}</p>
            <p className="t-eyebrow">
              Best at {p.bestAt.time} · {p.bestAt.moment}
            </p>
            <div className="border-t-2 border-dashed border-nero/40 pt-4">
              <Price price={variant.price} className="font-serif text-[36px] font-medium leading-none tracking-[-0.02em]" />
            </div>
            <SizeChips value={size} onChange={setSize} name={`seq-size-${p.slug}`} label={`Size for No. ${p.number}`} />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="btn flex-1 bg-peacock text-canvas"
                onClick={() =>
                  void quickAdd(
                    { merchandiseId: variant.id, quantity: 1, purchase: { mode: "one-time" } },
                    { source: jarRef.current, look: { labelColor: p.jar.labelColor, honey: p.jar.honey }, label: `No. ${p.number} ${p.name} (${sizeLabel})` },
                  )
                }
              >
                Add {sizeLabel}
                <span className="sr-only"> of No. {p.number} {p.name}</span>
              </button>
              <Link href={`/shop/${p.slug}`} className="btn btn-sm bg-canvas text-nero">
                Details<span className="sr-only"> for No. {p.number} {p.name}</span> →
              </Link>
            </div>
          </div>
        </div>
        {i === 0 && mode === "swipe" ? (
          <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2">
            <span className="chip" aria-hidden="true">
              Swipe for all six →
            </span>
            <TiltButton />
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
