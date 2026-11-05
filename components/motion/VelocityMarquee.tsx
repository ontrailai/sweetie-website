"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionPref } from "./MotionPreference";

/**
 * A marquee whose speed and direction follow scroll velocity: scroll down
 * and it races one way, scroll up and it flips. Idle drift otherwise.
 * Motion off → a static, non-moving row. Always aria-hidden: pass content
 * that is decorative or repeated elsewhere.
 */
export function VelocityMarquee({
  children,
  baseSpeed = 40,
  reverse = false,
  className = "",
  trackClassName = "",
}: {
  children: ReactNode;
  /** px per second at rest */
  baseSpeed?: number;
  reverse?: boolean;
  className?: string;
  trackClassName?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const { enabled } = useMotionPref();

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (!enabled) {
      el.style.transform = "translate3d(-12%,0,0)";
      return;
    }
    let x = 0;
    let dir = reverse ? -1 : 1;
    let lastY = window.scrollY;
    let boost = 0;
    let last = performance.now();
    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible) {
        last = performance.now();
        lastY = window.scrollY;
        raf = requestAnimationFrame(tick);
      } else cancelAnimationFrame(raf);
    });
    io.observe(el);
    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const y = window.scrollY;
      const v = (y - lastY) / Math.max(dt, 0.001);
      lastY = y;
      if (Math.abs(v) > 30) dir = (v > 0 ? 1 : -1) * (reverse ? -1 : 1);
      boost += (Math.min(Math.abs(v) / 90, 14) - boost) * 0.08;
      const half = el!.scrollWidth / 2;
      x -= dir * baseSpeed * (1 + boost) * dt;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      el!.style.transform = `translate3d(${x}px,0,0) skewX(${(-dir * Math.min(boost, 8)).toFixed(2)}deg)`;
      if (visible) raf = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.style.transform = "";
    };
  }, [enabled, baseSpeed, reverse]);

  return (
    <div aria-hidden="true" className={`overflow-hidden ${className}`}>
      <div ref={track} className={`flex w-max will-change-transform ${trackClassName}`}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </div>
    </div>
  );
}
