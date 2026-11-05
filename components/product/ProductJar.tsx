"use client";

import { animate, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Product } from "@/lib/catalog";
import { Jar, TURN } from "@/components/jar/Jar";
import { HoneyJar3D } from "@/components/jar3d/HoneyJar3D";
import { useMotionPref } from "@/components/motion/MotionPreference";

const STEP = (Math.PI * 2) / 3;
const SIDES = ["front label", "“Feel the hum.” side", "small-batch side"];

/**
 * The product-page jar: drag (mouse/touch) or use arrow keys to turn it.
 * One angle drives both the WebGL jar and the SVG fallback. Exposed to
 * assistive tech as a slider over the three label panels.
 */
export function ProductJar({ product }: { product: Product }) {
  const { enabled } = useMotionPref();
  const angle = useMotionValue(enabled ? -Math.PI * 2 : 0);
  const shake = useMotionValue(0);
  const svgSpin = useTransform(angle, (a) => (-a / (Math.PI * 2)) * TURN);
  const [side, setSide] = useState(0);
  const [hinted, setHinted] = useState(false);
  const drag = useRef<{ x: number; t: number; v: number; w: number } | null>(null);

  useMotionValueEvent(angle, "change", (a) => {
    const s = (((Math.round(-a / STEP) % 3) + 3) % 3) as 0 | 1 | 2;
    setSide((prev) => (prev === s ? prev : s));
  });

  // Intro: one full turn into place (or snap when motion is off).
  useEffect(() => {
    if (document.documentElement.dataset.motion === "off") {
      angle.set(0);
      return;
    }
    const c = animate(angle, 0, { type: "spring", stiffness: 22, damping: 10, mass: 1.2, delay: 0.3 });
    return () => c.stop();
  }, [angle]);

  const settle = (velocity: number) => {
    if (!enabled) {
      angle.set(Math.round(angle.get() / STEP) * STEP);
      return;
    }
    shake.set(velocity * 0.6);
    animate(angle, angle.get(), {
      type: "inertia",
      velocity,
      power: 0.35,
      timeConstant: 300,
      modifyTarget: (t) => Math.round(t / STEP) * STEP,
    });
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    angle.stop();
    drag.current = { x: e.clientX, t: performance.now(), v: 0, w: e.currentTarget.getBoundingClientRect().width };
    setHinted(true);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const dx = e.clientX - d.x;
    const da = (dx / Math.max(d.w, 1)) * Math.PI * 1.6;
    angle.set(angle.get() + da);
    d.v = (da / Math.max(now - d.t, 1)) * 1000;
    d.x = e.clientX;
    d.t = now;
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d) settle(d.v);
  };

  const step = (dir: number) => {
    const target = Math.round(angle.get() / STEP) * STEP - dir * STEP;
    if (enabled) {
      shake.set(dir * 2);
      animate(angle, target, { type: "spring", stiffness: 110, damping: 16 });
    } else angle.set(target);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") step(1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") step(-1);
    else if (e.key === "Home") step(-side);
    else return;
    e.preventDefault();
    setHinted(true);
  };

  return (
    <div className="flex size-full flex-col items-center gap-3">
      <div
        id="product-jar"
        role="slider"
        tabIndex={0}
        aria-label={`Turn the No. ${product.number} ${product.name} jar`}
        aria-valuemin={0}
        aria-valuemax={2}
        aria-valuenow={side}
        aria-valuetext={`Showing the ${SIDES[side]}`}
        data-cursor="drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="relative w-full flex-1 cursor-grab touch-pan-y select-none rounded-[32px] active:cursor-grabbing"
      >
        <HoneyJar3D
          product={product}
          mode="product"
          spin={angle}
          shake={shake}
          className="absolute inset-0"
          fallback={
            <div className="grid size-full place-items-center">
              <div className="h-[82%]" style={{ aspectRatio: "100 / 318" }}>
                <Jar {...product.jar} number={product.number} name={product.name} descriptor={product.descriptor} spin={svgSpin} decorative />
              </div>
            </div>
          }
        />
      </div>
      <p className={`chip transition-opacity duration-500 ${hinted ? "opacity-60" : ""}`} aria-hidden="true">
        <span className="float inline-block">↔</span> Drag or use arrow keys to turn
      </p>
    </div>
  );
}
