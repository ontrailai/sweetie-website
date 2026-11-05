"use client";

import { useEffect, useRef } from "react";
import { useMotionPref } from "./MotionPreference";
import { isFinePointer } from "./capability";

/**
 * A honey drop that trails the pointer and swells into a ring over anything
 * clickable. Fine pointers + motion on only. It never covers focus rings
 * (pointer-events none, sits under dialogs) and hides while typing so the
 * native text caret is clear.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const { enabled } = useMotionPref();

  useEffect(() => {
    const d = dot.current;
    const r = ring.current;
    if (!d || !r || !enabled || !isFinePointer()) return;
    const root = document.documentElement;
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let scale = 1;
    let target = 1;
    let shown = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        shown = true;
        rx = mx;
        ry = my;
        root.classList.add("has-cursor");
        d.style.opacity = "1";
        r.style.opacity = "1";
      }
      const t = e.target as Element | null;
      const field = t?.closest("input, textarea, select");
      const hot = t?.closest("a, button, label, summary, [role='slider'], [data-cursor]");
      target = field ? 0 : hot ? 1.7 : 1;
      r.dataset.hot = hot && !field ? "1" : "";
      const label = (hot as HTMLElement | null)?.dataset?.cursor;
      r.dataset.label = label ?? "";
    };
    const onLeave = () => {
      shown = false;
      root.classList.remove("has-cursor");
      d.style.opacity = "0";
      r.style.opacity = "0";
    };
    const onDown = () => (target *= 0.7);
    const onUp = () => (target /= 0.7);
    const loop = () => {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      scale += (target - scale) * 0.2;
      d.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%) scale(${target === 0 ? 0 : 1})`;
      r.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${scale.toFixed(3)})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      root.classList.remove("has-cursor");
    };
  }, [enabled]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ring}
        className="absolute left-0 top-0 size-9 rounded-full border-2 border-nero bg-honey/25 opacity-0 transition-[background-color,border-color] duration-200 data-[hot=1]:border-[3px] data-[hot=1]:border-peacock data-[hot=1]:bg-transparent"
      />
      <div ref={dot} className="absolute left-0 top-0 size-2.5 rounded-full bg-peacock opacity-0 ring-2 ring-canvas" />
    </div>
  );
}
