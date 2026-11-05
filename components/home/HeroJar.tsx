"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, type CSSProperties, type Ref } from "react";
import { HERO_JAR } from "@/lib/jarAssets";
import { useMotionPref } from "@/components/motion/MotionPreference";

const { pour, lid, ribbon, body } = HERO_JAR;
const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const SPRING = { stiffness: 70, damping: 20, mass: 0.7 };
/** How far the pour reaches above the art, in art heights (page sets it per breakpoint). */
const REACH = "var(--pour-reach, 1.2)";
/** A short reach still shows the whole flare (squeezed to fit), never a sliver of it. */
const RIBBON_H = `min(${ribbon.box.height}, ${REACH})`;
const RIBBON_FADE = "linear-gradient(to top, #000 var(--pour-solid, 55%), transparent)";

/**
 * The hero jar: the No. 01 packshot, open, mid-pour. Two photo layers (jar +
 * honey ribbon + drops, and the lid on its own) so the lid floats free of the
 * jar. Above the shot the ribbon carries on up (broad and heavy, the way the
 * pour flares in the photo), then its top row stretches on, so the pour can
 * fall from above the art at any crop. How far it reaches, in art heights,
 * is `--pour-reach` (set by the page per breakpoint); it fades in over the
 * top of that reach (`--pour-solid` is the part that stays opaque).
 *
 * Motion on: the jar breathes, the lid bobs and tumbles on its own beat, both
 * drift with the mouse at different depths, and as the hero scrolls away the
 * lid lifts off and the jar tips. Motion off: one still composition.
 *
 * `bodyRef` marks the jar body (rim to base) so the bee can orbit it.
 */
export function HeroJar({ progress, bodyRef, className = "" }: { progress: MotionValue<number>; bodyRef?: Ref<HTMLDivElement>; className?: string }) {
  const { enabled } = useMotionPref();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);
  const jarX = useTransform(sx, (v) => v * -12);
  const jarY = useTransform(sy, (v) => v * -8);
  const lidX = useTransform(sx, (v) => v * 26);
  const lidY = useTransform(sy, (v) => v * 18);
  // Scroll away: the lid flies up and over, the jar tips toward the pour.
  const lidLift = useTransform(progress, [0, 1], ["0%", "-70%"]);
  const lidSpin = useTransform(progress, [0, 1], [0, 34]);
  const tip = useTransform(progress, [0, 1], [0, -7]);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      px.set(0);
      py.set(0);
    };
  }, [enabled, px, py]);

  const live = enabled;
  const art: CSSProperties = { aspectRatio: `${pour.width} / ${pour.height}` };

  return (
    <div aria-hidden="true" className={`relative ${className}`}>
      {/* the art box, sized by height (`--art-h` of the box, leaving room above
          for the pour); the jar + lid group is centred */}
      <div className="absolute bottom-[2%] left-1/2 h-[var(--art-h,94%)] -translate-x-1/2" style={art}>
        <motion.div
          key={`tip-${live}`}
          className="absolute inset-0 origin-[38%_100%]"
          style={live ? { rotate: tip } : undefined}
        >
          {/* contact shadow on the backdrop */}
          <div
            className="absolute -bottom-[1.2%] h-[4.5%] rounded-[50%] opacity-70 blur-[6px]"
            style={{ left: pct(body.left + body.width * 0.04), width: pct(body.width * 0.92), background: "radial-gradient(closest-side, rgba(92,0,40,0.75), rgba(92,0,40,0))" }}
          />
          <motion.div key={`jar-${live}`} className="absolute inset-0" style={live ? { x: jarX, y: jarY } : undefined}>
            <div className={`absolute inset-0 ${live ? "hero-breathe" : ""}`}>
              {/* the ribbon above the shot: its flare, then its top row stretched */}
              <div
                className="absolute bottom-[calc(100%-1px)] overflow-hidden"
                style={{
                  left: pct(ribbon.box.left),
                  width: pct(ribbon.box.width),
                  height: `calc(${REACH} * 100%)`,
                  maskImage: RIBBON_FADE,
                  WebkitMaskImage: RIBBON_FADE,
                }}
              >
                <div
                  className="absolute inset-x-0 top-0"
                  style={{ bottom: `calc(100% * ${RIBBON_H} / ${REACH} - 1px)`, backgroundImage: `url("${ribbon.stream}")`, backgroundSize: "100% 100%" }}
                />
                <Image
                  src={ribbon.webp2x}
                  width={ribbon.width}
                  height={ribbon.height}
                  alt=""
                  sizes="(min-width: 1024px) 13vw, 25vw"
                  loading="eager"
                  draggable={false}
                  className="absolute bottom-0 left-0 block w-full select-none"
                  style={{ height: `calc(100% * ${RIBBON_H} / ${REACH})` }}
                />
              </div>
              <Image
                src={pour.webp2x}
                width={pour.width}
                height={pour.height}
                alt=""
                sizes="(min-width: 1024px) 34vw, 64vw"
                loading="eager"
                fetchPriority="high"
                draggable={false}
                className="relative block size-full select-none"
              />
              <div ref={bodyRef} className="pointer-events-none absolute" style={{ left: pct(body.left), top: pct(body.top), width: pct(body.width), height: pct(body.height) }} />
            </div>
          </motion.div>

          {/* the lid, floating free: scroll lift → mouse depth → idle bob */}
          <div className="absolute" style={{ left: pct(lid.box.left), top: pct(lid.box.top), width: pct(lid.box.width) }}>
            <motion.div key={`lid-${live}`} style={live ? { y: lidLift, rotate: lidSpin } : undefined}>
              <motion.div key={`lidp-${live}`} style={live ? { x: lidX, y: lidY } : undefined}>
                <div className={live ? "hero-lid-float" : ""}>
                  <Image
                    src={lid.webp2x}
                    width={lid.width}
                    height={lid.height}
                    alt=""
                    sizes="(min-width: 1024px) 18vw, 33vw"
                    loading="eager"
                    draggable={false}
                    className="block h-auto w-full select-none drop-shadow-[0_18px_14px_rgba(92,0,40,0.35)]"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
