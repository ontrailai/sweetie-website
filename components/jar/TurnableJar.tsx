"use client";

import { animate, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Product } from "@/lib/catalog";
import { useMotionPref } from "@/components/motion/MotionPreference";
import { Jar, TURN } from "./Jar";
import { useJarSpin } from "./useJarSpin";

const PANEL = TURN / 3;
const SIDES = ["front label", "“Feel the hum.” side", "small-batch side"];

/**
 * The product-page jar: drag (mouse/touch) or use arrow keys to turn it.
 * Exposed to assistive tech as a slider over the three label panels.
 */
export function TurnableJar({ product }: { product: Product }) {
  const { spin } = useJarSpin(-TURN);
  const { enabled } = useMotionPref();
  const [side, setSide] = useState(0);
  const [hinted, setHinted] = useState(false);
  const drag = useRef<{ x: number; t: number; v: number; w: number } | null>(null);

  useMotionValueEvent(spin, "change", (v) => {
    const s = (((Math.round(v / PANEL) % 3) + 3) % 3) as 0 | 1 | 2;
    setSide((prev) => (prev === s ? prev : s));
  });

  // Intro: one full turn into place (or snap there when motion is off).
  useEffect(() => {
    if (document.documentElement.dataset.motion === "off") {
      spin.set(0);
      return;
    }
    const c = animate(spin, 0, { type: "spring", stiffness: 26, damping: 11, mass: 1.2, delay: 0.25 });
    return () => c.stop();
  }, [spin]);

  const settle = (velocity: number) => {
    if (!enabled) {
      spin.set(Math.round(spin.get() / PANEL) * PANEL);
      return;
    }
    animate(spin, spin.get(), {
      type: "inertia",
      velocity,
      power: 0.35,
      timeConstant: 320,
      modifyTarget: (t) => Math.round(t / PANEL) * PANEL,
    });
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    spin.stop();
    drag.current = { x: e.clientX, t: performance.now(), v: 0, w: e.currentTarget.getBoundingClientRect().width };
    setHinted(true);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const dx = e.clientX - d.x;
    const units = (-dx / Math.max(d.w, 1)) * 120;
    spin.set(spin.get() + units);
    const dt = Math.max(now - d.t, 1);
    d.v = (units / dt) * 1000;
    d.x = e.clientX;
    d.t = now;
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d) settle(d.v);
  };

  const step = (dir: number) => {
    const target = Math.round(spin.get() / PANEL) * PANEL + dir * PANEL;
    if (enabled) animate(spin, target, { type: "spring", stiffness: 120, damping: 18 });
    else spin.set(target);
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
    <div className="flex w-full flex-col items-center gap-4">
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Turn the No. ${product.number} ${product.name} jar`}
        aria-valuemin={0}
        aria-valuemax={2}
        aria-valuenow={side}
        aria-valuetext={`Showing the ${SIDES[side]}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="w-[min(34%,220px)] cursor-grab touch-pan-y select-none active:cursor-grabbing"
      >
        <Jar {...product.jar} number={product.number} name={product.name} descriptor={product.descriptor} spin={spin} decorative />
      </div>
      <p className={`max-w-full px-4 text-center text-[13px] text-balance transition-opacity duration-500 ${hinted ? "opacity-50" : "opacity-100"}`} aria-hidden="true">
        <span className="whitespace-nowrap">
          <span className="mr-2 inline-block animate-[float_2s_ease-in-out_infinite]">↔</span>Drag or
        </span>{" "}
        use arrow keys to turn the jar
      </p>
    </div>
  );
}
