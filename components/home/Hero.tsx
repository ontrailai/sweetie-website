"use client";

import Link from "next/link";
import { AnimatePresence, animate, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useState } from "react";
import { PRODUCTS, type Product } from "@/lib/catalog";
import { Jar, TURN } from "@/components/jar/Jar";
import { Bee } from "@/components/brand/Illustrations";
import { Star } from "@/components/brand/Star";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { useMotionPref } from "@/components/motion/MotionPreference";
import { Drip } from "@/components/ui/Drip";

const RING_TEXT = "RAW HONEY · SAN DIEGO COUNTY · SMALL BATCH · TRACEABLE TO THE HIVE · ";

function HeroJar({ product, nudge, spinIn }: { product: Product; nudge: MotionValue<number>; spinIn: boolean }) {
  const { enabled } = useMotionPref();
  const base = useMotionValue(spinIn && enabled ? -TURN : 0);
  const spin = useTransform(() => base.get() + nudge.get());

  useEffect(() => {
    if (base.get() === 0) return;
    // The saved preference is applied to <html> before hydration; trust it here.
    if (document.documentElement.dataset.motion === "off") {
      base.set(0);
      return;
    }
    const controls = animate(base, 0, { type: "spring", stiffness: 30, damping: 12, mass: 1.1 });
    return () => controls.stop();
  }, [base]);

  return <Jar {...product.jar} number={product.number} name={product.name} descriptor={product.descriptor} spin={spin} decorative />;
}

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(false);
  const [hover, setHover] = useState(false);
  const [hasCycled, setHasCycled] = useState(false);
  const { enabled } = useMotionPref();
  const product = PRODUCTS[idx]!;

  // Pointer → tilt + a gentle turn of the label.
  const px = useMotionValue(0);
  const tilt = useSpring(useTransform(px, [-1, 1], [-7, 7]), { stiffness: 120, damping: 16 });
  const nudge = useSpring(useTransform(px, [-1, 1], [26, -26]), { stiffness: 80, damping: 18 });
  const rotate = useTransform(tilt, (t) => t - 6);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
  };

  const pick = (i: number) => {
    setPicked(true);
    setHasCycled(true);
    setIdx(i);
  };

  // Autoplay is driven by the progress ring's CSS animation (see onAnimationEnd),
  // so hover-pause and the global motion toggle pause it for free.
  const advance = () => {
    setHasCycled(true);
    setIdx((i) => (i + 1) % PRODUCTS.length);
  };

  return (
    <section aria-labelledby="hero-title" className="on-pink relative z-10 bg-peacock text-canvas">
      <div className="px-gutter overflow-hidden pb-[clamp(72px,7vw,112px)] pt-[clamp(28px,3.5vw,56px)]">
        <div className="container-x flex flex-wrap items-center gap-x-16 gap-y-10">
          <div className="flex min-w-0 flex-[1_1_540px] flex-col gap-7">
            <span className="fade-up inline-flex min-h-9 items-center self-start bg-canvas px-4 text-forest t-eyebrow">
              Raw honey · San Diego County
            </span>
            <h1 id="hero-title" className="text-[clamp(88px,13.5vw,212px)] leading-[0.82] tracking-[0.005em]">
              {["Feel", "the"].map((w, i) => (
                <span key={w} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span className="rise-in" style={{ animationDelay: `${0.05 + i * 0.09}s` }}>
                    {w}
                  </span>
                </span>
              ))}
              <span className="inline-block overflow-hidden pb-[0.08em] pr-[0.06em] align-bottom">
                <span className="rise-in" style={{ animationDelay: "0.23s" }}>
                  <em className="hum">hum.</em>
                </span>
              </span>
            </h1>
            <p className="fade-up max-w-[520px] font-serif text-[clamp(24px,2.2vw,30px)] leading-[1.25] tracking-[0.025em] [animation-delay:0.35s]">
              Raw, small-batch honey from San Diego County beekeepers. Your daily spoonful, six ways. Zero sleepy honey.
            </p>
            <div className="fade-up flex flex-wrap items-center gap-4 [animation-delay:0.45s]">
              <Link href="/shop" className="btn min-h-[60px] bg-canvas px-9 font-serif text-[26px] tracking-[0.025em] text-peacock">
                Shop the jars
              </Link>
              <Link href="/#subscribe" className="btn on-nero-shadow min-h-[60px] bg-nero px-7 text-base text-canvas">
                Start a subscription
              </Link>
            </div>
          </div>

          <div
            className="relative flex min-w-0 flex-[1_1_440px] flex-col items-center gap-5 pt-6"
            onPointerMove={onMove}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => {
              setHover(false);
              px.set(0);
            }}
          >
            {/* Canvas sun + rotating ring */}
            <div aria-hidden="true" className="absolute left-1/2 top-[36%] aspect-square w-[clamp(250px,27vw,400px)] -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-0 rounded-full bg-canvas" />
              <svg viewBox="0 0 200 200" className="spin-ring absolute -inset-[13%] size-[126%] overflow-visible">
                <defs>
                  <path id="hero-ring" d="M100,100 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0" />
                </defs>
                <text fontSize="8.6" fill="#F6EDDD" style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.28em" }}>
                  <textPath href="#hero-ring">{RING_TEXT + RING_TEXT.slice(0, 22)}</textPath>
                </text>
              </svg>
              <div className="absolute left-[2%] top-[30%] z-[3] w-[24%]">
                <Bee className="bee-fly w-full" />
              </div>
              <Star className="twinkle absolute right-[4%] top-[8%] size-7 text-peacock" />
              <Star className="twinkle absolute bottom-[14%] left-[10%] size-5 text-forest [animation-delay:-1s]" />
            </div>

            <motion.div className="relative w-[clamp(112px,11vw,168px)]" style={{ rotate }} whileHover={{ y: -18, scale: 1.04 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
              <div className="float">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={product.slug}
                    initial={{ opacity: 0, y: 70, rotate: -16, scale: 0.88 }}
                    animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -60, rotate: 14, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 140, damping: 16 }}
                  >
                    <HeroJar product={product} nudge={nudge} spinIn={hasCycled || idx === 0} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            <div aria-live={picked ? "polite" : "off"} className="relative flex flex-col gap-1 text-center">
              <span className="font-serif text-[clamp(32px,3vw,44px)] italic leading-none tracking-[0.025em]">
                No. {product.number} {product.name}
              </span>
              <span className="font-serif text-[24px] tracking-[0.025em]">{product.tagline}</span>
            </div>

            <div className="relative flex flex-wrap items-center justify-center gap-3">
              <MotionToggle />
              <Link href={`/shop/${product.slug}`} className="btn on-nero-shadow min-h-11 bg-nero px-4 text-[15px] text-canvas">
                Meet No. {product.number}
              </Link>
            </div>

            <div role="group" aria-label="Pick a jar" className="relative flex flex-wrap justify-center gap-2.5">
              {PRODUCTS.map((p, i) => {
                const active = i === idx;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    aria-label={`No. ${p.number} ${p.name}`}
                    aria-pressed={active}
                    onClick={() => pick(i)}
                    className="relative grid size-12 place-items-center rounded-full border-2 border-nero text-[19px] font-bold tracking-normal transition-transform duration-300 ease-[var(--ease-pop)] hover:-translate-y-1 aria-pressed:scale-110"
                    style={{ background: p.jar.labelColor, color: p.jar.labelText }}
                  >
                    {p.number}
                    {active ? (
                      <svg aria-hidden="true" viewBox="0 0 56 56" className="pointer-events-none absolute -inset-[6px] size-[calc(100%+12px)] -rotate-90">
                        <circle cx="28" cy="28" r="26" fill="none" stroke="#F6EDDD" strokeWidth="3" opacity={picked ? 1 : 0.35} />
                        {!picked ? (
                          <circle
                            key={idx}
                            cx="28"
                            cy="28"
                            r="26"
                            fill="none"
                            stroke="#F6EDDD"
                            strokeWidth="3"
                            strokeLinecap="round"
                            pathLength={1}
                            strokeDasharray="1"
                            className="hero-progress"
                            style={{ animationPlayState: hover ? "paused" : undefined }}
                            onAnimationEnd={advance}
                          />
                        ) : null}
                      </svg>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Drip className="absolute inset-x-0 top-[calc(100%-1px)] h-[clamp(40px,5vw,72px)] w-full text-peacock" />
    </section>
  );
}
