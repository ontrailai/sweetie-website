"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionPref } from "./MotionPreference";
import { isFinePointer } from "./capability";

/**
 * Pulls its child toward the cursor while hovered (fine pointers, motion on).
 * Wraps any button/link; focus styles are untouched.
 */
export function Magnetic({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { enabled } = useMotionPref();

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !isFinePointer()) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * strength;
      ty = (e.clientY - (r.top + r.height / 2)) * strength;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
    };
  }, [enabled, strength]);

  return (
    <span ref={ref} className={`inline-block p-2 -m-2 ${className}`}>
      {children}
    </span>
  );
}
