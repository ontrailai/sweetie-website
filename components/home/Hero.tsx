"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { PRODUCTS } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { HoneyJar3D } from "@/components/jar3d/HoneyJar3D";
import { SplitText } from "@/components/motion/SplitText";
import { Magnetic } from "@/components/motion/Magnetic";
import { useMotionPref } from "@/components/motion/MotionPreference";
import { HumBee } from "@/components/fx/HumBee";
import { HumToggle } from "@/components/fx/HumToggle";
import { TiltButton } from "@/components/fx/TiltButton";
import { RoundSticker } from "@/components/fx/Sticker";
import { HoneyDrip } from "@/components/fx/HoneyDrip";

const HERO = PRODUCTS[0]!;

/**
 * The static jar (reduced motion, low power, before WebGL): the same scene as
 * the 3D one, frozen mid-pour. Lid off and flung up to the side, a ribbon of
 * honey falling from above the fold into the open mouth and folding onto the
 * surface, one run down the glass. Everything is drawn in the jar's own
 * viewBox units (100 wide, 318 tall) so the pour always lands in the mouth.
 */
function StaticHeroJar() {
  const { honey, honeyDark } = HERO.jar;
  return (
    <div className="relative mx-auto h-full w-full">
      <div className="absolute bottom-[8%] left-1/2 h-[60%] -translate-x-1/2" style={{ aspectRatio: "100 / 318" }}>
        <div className="relative size-full origin-[50%_4%] -rotate-[5deg]">
          <Jar {...HERO.jar} number={HERO.number} name={HERO.name} descriptor={HERO.descriptor} decorative open />
          <svg aria-hidden="true" viewBox="0 0 100 318" className="absolute inset-0 size-full overflow-visible">
            <defs>
              <linearGradient id="hero-pour" x1="0" x2="1">
                <stop offset="0" stopColor={honeyDark} />
                <stop offset="0.3" stopColor={honey} />
                <stop offset="0.48" stopColor="#fff4c8" />
                <stop offset="0.68" stopColor={honey} />
                <stop offset="1" stopColor={honeyDark} />
              </linearGradient>
              <radialGradient id="hero-fold" cx="0.45" cy="0.35" r="0.7">
                <stop offset="0" stopColor="#fff4c8" />
                <stop offset="0.45" stopColor={honey} />
                <stop offset="1" stopColor={honeyDark} />
              </radialGradient>
            </defs>
            {/* the ribbon: thin and fast at the top, swelling as it slows.
                Counter-rotated so it falls straight down while the jar leans. */}
            <path
              transform="rotate(5 49.6 40)"
              d="M47.2 -760 C 47 -440, 45.6 -220, 45.8 -70 C 45.9 -4, 44.2 20, 44.6 40 L 54.6 40 C 55 20, 53.4 -4, 53.4 -70 C 53.4 -220, 51.4 -440, 51.2 -760 Z"
              fill="url(#hero-pour)"
            />
            {/* honey folding onto itself where the ribbon lands */}
            <ellipse cx="50" cy="41.4" rx="17" ry="3.2" fill={honeyDark} opacity="0.55" />
            <ellipse cx="49.6" cy="40" rx="12.5" ry="2.8" fill="url(#hero-fold)" />
            <ellipse cx="49.8" cy="38.3" rx="8" ry="2.1" fill="url(#hero-fold)" />
            <ellipse cx="49.6" cy="36.9" rx="4.6" ry="1.5" fill="url(#hero-fold)" />
            {/* a run down the outside of the glass */}
            <path d="M8 12.5 C 6 13, 5.4 16, 5.6 22 L 5.8 58 C 5.8 63, 10 63, 10 58 L 10.2 24 C 10.4 18, 11 14, 13 12.6 Z" fill="url(#hero-pour)" opacity="0.95" />
            <ellipse cx="7.9" cy="63.5" rx="3.1" ry="3.9" fill={honey} />
            <ellipse cx="7" cy="62.4" rx="0.9" ry="1.2" fill="#fff4c8" opacity="0.8" />
            {/* flung drops */}
            <ellipse cx="66" cy="-42" rx="2.2" ry="2.8" fill={honey} transform="rotate(-24 66 -42)" />
            <ellipse cx="74" cy="-64" rx="1.4" ry="1.8" fill={honey} transform="rotate(-30 74 -64)" />
          </svg>
          {/* the lid, mid-flip up and to the right */}
          <svg aria-hidden="true" viewBox="0 0 120 70" className="absolute left-[80%] top-[-28%] w-[100%] rotate-[24deg] overflow-visible">
            <defs>
              <linearGradient id="hero-lid" x1="0" x2="1">
                <stop offset="0" stopColor="#0e0e0e" />
                <stop offset="0.2" stopColor="#4a4a4a" />
                <stop offset="0.45" stopColor="#262626" />
                <stop offset="0.85" stopColor="#3e3e3e" />
                <stop offset="1" stopColor="#0e0e0e" />
              </linearGradient>
              <pattern id="hero-ridges" width="3.2" height="40" patternUnits="userSpaceOnUse">
                <rect width="0.8" height="40" fill="rgba(255,255,255,0.1)" />
              </pattern>
            </defs>
            <path d="M6 22 L6 46 A54 14 0 0 0 114 46 L114 22 Z" fill="url(#hero-lid)" />
            <path d="M6 22 L6 46 A54 14 0 0 0 114 46 L114 22 Z" fill="url(#hero-ridges)" />
            <ellipse cx="60" cy="22" rx="54" ry="14" fill="#2f2f2f" />
            <ellipse cx="60" cy="22" rx="54" ry="14" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="1.2" />
            <ellipse cx="60" cy="21" rx="38" ry="8.5" fill="none" stroke="#fff" strokeOpacity="0.08" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = useMotionPref();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Scroll-linked: the jar spins 1¼ turns as the hero leaves; the headline splits apart.
  const spin = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2.5]);
  const feelX = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const humX = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const jarY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const jarScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  return (
    <section ref={ref} aria-labelledby="hero-title" className="on-pink relative z-10 bg-peacock text-canvas">
      <div className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* hot Ladybug glow behind the jar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[10%] -z-10 aspect-square w-[min(80vw,900px)] rounded-full opacity-60 blur-3xl max-lg:right-[-30%] max-lg:top-[30%]"
        style={{ background: "radial-gradient(circle, rgba(255,0,0,0.75) 0%, rgba(255,0,0,0.28) 38%, transparent 66%)" }}
      />

      <h1 id="hero-title" className="sr-only">
        Feel the hum. Sweet Bee raw honey from San Diego County.
      </h1>

      {/* Headline (decorative copy of the h1; letters ride in on load). */}
      <div aria-hidden="true" className="pt-header px-gutter relative z-10 flex flex-1 flex-col justify-center lg:z-auto">
        <div className="container-x relative">
          <motion.p key={`feel-${enabled}`} style={enabled ? { x: feelX } : undefined} className="display relative z-0 text-[clamp(118px,25vw,400px)] leading-[0.78]">
            <SplitText text="Feel" mode="load" />
          </motion.p>
          <p className="display relative z-0 -mt-[0.1em] ml-[0.08em] text-[clamp(48px,7vw,120px)] italic text-nero lg:ml-[30vw] lg:-mt-[0.6em]">
            <SplitText text="the" mode="load" start={4} delay={120} />
          </p>
          <motion.p
            key={`hum-${enabled}`}
            style={enabled ? { x: humX } : undefined}
            className="buzz group relative z-20 -mt-[0.06em] inline-block lg:-mt-[0.2em]"
          >
            <em className="display relative block text-[clamp(130px,29vw,470px)] leading-[0.74] [--wght:700]">
              <SplitText text="hum." mode="load" start={7} delay={200} />
            </em>
            {/* sound-wave rings */}
            <span className="pointer-events-none absolute left-[38%] top-[45%] -z-10 hidden size-[0.9em] text-[clamp(130px,29vw,470px)] group-hover:block">
              {[0, 1, 2].map((i) => (
                <span key={i} className="hum-ring absolute inset-0 rounded-full border-[6px] border-canvas/70" style={{ animationDelay: `${i * 0.45}s` }} />
              ))}
            </span>
          </motion.p>
        </div>
      </div>

      {/* The jar: 3D when allowed, SVG otherwise. Sits between the words. */}
      <motion.div
        key={`jar-${enabled}`}
        style={enabled ? { y: jarY, scale: jarScale } : undefined}
        className="pointer-events-none relative z-10 mx-auto -mt-[22vw] h-[62svh] w-full max-w-[560px] lg:absolute lg:inset-y-0 lg:left-[30vw] lg:mt-0 lg:h-full lg:w-[52vw] lg:max-w-none"
      >
        <HoneyJar3D product={HERO} mode="hero" spin={spin} fallback={<StaticHeroJar />} className="size-full" />
      </motion.div>

      <HumBee perch={{ x: 0.56, y: 0.26 }} />

      {/* Stickers */}
      <RoundSticker
        text="RAW · LOCAL · TRACEABLE · SAN DIEGO · "
        className="absolute right-[4vw] top-[calc(var(--header-h)+3vh)] z-20 w-[clamp(96px,10vw,150px)] max-lg:hidden"
        center={<span className="font-serif text-[clamp(22px,2.2vw,34px)] font-semibold italic leading-none text-nero">No. 01</span>}
      />

      {/* Ticket: small copy on Canvas, CTAs, sound + tilt */}
      <div className="px-gutter relative z-20 pb-[clamp(40px,7vh,88px)] lg:absolute lg:bottom-0 lg:right-0 lg:pb-[6vh]">
        <div className="container-x flex flex-col items-start gap-4 lg:w-[min(400px,27vw)] lg:items-end">
          <div className="ticket flex flex-col gap-4 px-6 py-5 [--notch-y:30%]">
            <p className="max-w-[44ch] text-[15px] leading-[1.6]">
              Raw, small-batch honey from San Diego County beekeepers. Six numbered jars, every batch traced to the hive. <strong>Zero sleepy honey.</strong>
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link href="/#jars" className="btn bg-nero text-canvas" data-cursor="shop">
                  Shop the six <span aria-hidden="true">↓</span>
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/#subscribe" className="btn bg-peacock text-canvas">
                  Subscribe
                </Link>
              </Magnetic>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <HumToggle className="border-nero bg-canvas text-nero lg:hidden" />
            <TiltButton />
          </div>
        </div>
      </div>

      </div>
      <HoneyDrip className="absolute inset-x-0 top-[calc(100%-2px)] h-[clamp(40px,6vw,96px)] text-peacock" />
    </section>
  );
}
