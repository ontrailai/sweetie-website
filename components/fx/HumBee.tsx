"use client";

import { useEffect, useRef } from "react";
import { Bee } from "@/components/brand/Illustrations";
import { useMotionPref } from "@/components/motion/MotionPreference";

/**
 * The hum, embodied: a bee that chases the cursor around its container with
 * a lazy, wobbly flight (and orbits on its own on touch screens). It banks
 * into turns and flips to face where it's going. Motion off → it perches.
 */
export function HumBee({ className = "", perch = { x: 0.62, y: 0.2 } }: { className?: string; perch?: { x: number; y: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const { enabled } = useMotionPref();

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (!enabled) {
      el.style.transform = `translate3d(${perch.x * host.clientWidth}px, ${perch.y * host.clientHeight}px, 0)`;
      return;
    }
    let tx = host.clientWidth * perch.x;
    let ty = host.clientHeight * perch.y;
    let x = tx;
    let y = ty;
    let vx = 0;
    let vy = 0;
    let face = 1;
    let pointerAt = 0;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      tx = e.clientX - r.left - 70;
      ty = e.clientY - r.top - 60;
      pointerAt = performance.now();
    };
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      if (now - pointerAt > 2500) {
        // Wander in a lazy figure-eight when nobody's steering.
        const w = host.clientWidth;
        const h = host.clientHeight;
        tx = w * (0.55 + 0.28 * Math.sin(t * 0.45));
        ty = h * (0.32 + 0.16 * Math.sin(t * 0.9));
      }
      const ax = (tx - x) * 2.2 - vx * 2.6;
      const ay = (ty - y) * 2.2 - vy * 2.6;
      vx += ax * 0.016;
      vy += ay * 0.016;
      x += vx * 0.016 * 1.0 + Math.sin(t * 9) * 0.6;
      y += vy * 0.016 * 1.0 + Math.cos(t * 7.3) * 0.9;
      if (Math.abs(vx) > 20) face = vx > 0 ? 1 : -1;
      const bank = Math.max(-25, Math.min(25, vy * 0.05));
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(bank * face).toFixed(1)}deg) scaleX(${-face})`;
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(host);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled, perch.x, perch.y]);

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute left-0 top-0 z-30 w-[clamp(64px,7vw,104px)] will-change-transform ${className}`}>
      <Bee className="w-full drop-shadow-[0_6px_0_rgba(38,38,38,0.25)]" />
    </div>
  );
}
