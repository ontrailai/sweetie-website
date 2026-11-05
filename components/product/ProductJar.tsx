"use client";

import { animate, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Product } from "@/lib/catalog";
import { JAR_PHOTO_ASPECT, jarPhoto } from "@/lib/jarAssets";
import { JarPhoto } from "@/components/jar/JarPhoto";
import { isMotionOff, useMotionPref } from "@/components/motion/MotionPreference";

const MAX_YAW = 38;

/**
 * The product-page jar: the packshot, standing in its own colour. Drag it
 * (mouse or touch) and it swings on its base in 3D, then springs back with a
 * wobble; a mouse just hovering makes it lean toward the cursor. A glass
 * sheen, clipped to the jar's silhouette, slides across as it turns.
 * Motion off: a still photo.
 */
export function ProductJar({ product }: { product: Product }) {
  const { enabled } = useMotionPref();
  const yaw = useMotionValue(0);
  const pitch = useMotionValue(0);
  const yawS = useSpring(yaw, { stiffness: 140, damping: 11, mass: 0.9 });
  const pitchS = useSpring(pitch, { stiffness: 120, damping: 14 });
  const sheenX = useTransform(yawS, [-MAX_YAW, MAX_YAW], ["-60%", "60%"]);
  const shadowX = useTransform(yawS, (v) => `${(v * -0.25).toFixed(2)}%`);
  const [hinted, setHinted] = useState(false);
  const drag = useRef<{ x: number; y: number; w: number } | null>(null);
  const photo = jarPhoto(product.slug);
  const live = enabled;

  // Arrive with a little swing (skipped when motion is off).
  useEffect(() => {
    if (isMotionOff()) return;
    yaw.jump(-24);
    const c = animate(yaw, 0, { type: "spring", stiffness: 60, damping: 7, delay: 0.25 });
    return () => c.stop();
  }, [yaw]);

  useEffect(() => {
    if (enabled) return;
    yaw.jump(0);
    pitch.jump(0);
    yawS.jump(0);
    pitchS.jump(0);
  }, [enabled, yaw, pitch, yawS, pitchS]);

  const rubber = (v: number) => MAX_YAW * Math.tanh(v / MAX_YAW);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!live || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, w: e.currentTarget.getBoundingClientRect().width };
    setHinted(true);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!live) return;
    const d = drag.current;
    if (d) {
      yaw.set(rubber(((e.clientX - d.x) / Math.max(d.w, 1)) * 110));
      pitch.set(Math.max(-8, Math.min(8, ((e.clientY - d.y) / Math.max(d.w, 1)) * -30)));
      return;
    }
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    yaw.set(((e.clientX - r.left) / r.width - 0.5) * 22);
    pitch.set(((e.clientY - r.top) / r.height - 0.5) * -8);
  };
  const release = () => {
    drag.current = null;
    yaw.set(0);
    pitch.set(0);
  };

  const sheenMask = photo ? `url("${photo.webp1x}") center / contain no-repeat` : undefined;

  return (
    <div className="flex size-full flex-col items-center gap-3">
      <div
        id="product-jar"
        data-cursor={live ? "drag" : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={() => {
          if (!drag.current) release();
        }}
        className={`relative grid min-h-0 w-full flex-1 touch-pan-y select-none place-items-center [container-type:size] [perspective:1100px] ${live ? "cursor-grab active:cursor-grabbing" : ""}`}
      >
        {/* The jar box keeps the packshot's aspect whichever side is tighter:
            88% of the stage height, or the full stage width if that's narrower.
            The photo and the sheen mask both fill it exactly. */}
        <div className="relative" style={{ aspectRatio: `${JAR_PHOTO_ASPECT}`, width: `min(100cqw, 88cqh * ${JAR_PHOTO_ASPECT})` }}>
          {/* contact shadow, sliding opposite the swing */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-[10%] bottom-[0.5%] h-[4%] rounded-[50%] bg-nero/50 blur-[10px]"
            style={live ? { x: shadowX } : undefined}
          />
          <motion.div
            key={`jar-${live}`}
            className="relative size-full origin-[50%_96%] [transform-style:preserve-3d]"
            style={live ? { rotateY: yawS, rotateX: pitchS } : undefined}
          >
            <JarPhoto
              product={product}
              alt={`No. ${product.number} ${product.name} jar`}
              sizes="(min-width: 1024px) 22vw, 50vw"
              priority
              className="size-full"
            />
            {live && sheenMask ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light"
                style={{ mask: sheenMask, WebkitMask: sheenMask }}
              >
                <motion.div
                  className="absolute inset-y-0 left-[20%] w-[60%]"
                  style={{ x: sheenX, background: "linear-gradient(100deg, transparent 20%, rgba(255,240,210,0.75) 48%, transparent 76%)" }}
                />
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
      {live ? (
        <p className={`chip transition-opacity duration-500 ${hinted ? "opacity-60" : ""}`} aria-hidden="true">
          <span className="float inline-block">↔</span> Drag to swing the jar
        </p>
      ) : null}
    </div>
  );
}
