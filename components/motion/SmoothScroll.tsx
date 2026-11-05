"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMotionPref } from "./MotionPreference";
import { isFinePointer } from "./capability";

/**
 * Lenis smooth scrolling. Only runs when motion is on AND the pointer is a
 * mouse/trackpad; touch devices keep native scrolling. Dialogs carry
 * data-lenis-prevent, and useScrollLock() stops Lenis while one is open.
 */
let lenis: Lenis | null = null;
let stopped = 0;

export function stopSmoothScroll() {
  stopped++;
  lenis?.stop();
}
export function startSmoothScroll() {
  stopped = Math.max(0, stopped - 1);
  if (stopped === 0) lenis?.start();
}
export function scrollToTarget(target: number | HTMLElement, offset = 0) {
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.4 });
  else {
    const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: document.documentElement.dataset.motion === "on" ? "smooth" : "auto" });
  }
}

export function SmoothScroll() {
  const { enabled } = useMotionPref();
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled || !isFinePointer()) return;
    const l = new Lenis({
      lerp: 0.11,
      autoRaf: true,
      anchors: { offset: -96 },
      stopInertiaOnNavigate: true,
      allowNestedScroll: true,
      prevent: (node) => node.hasAttribute("data-lenis-prevent") || node.getAttribute("role") === "dialog",
    });
    lenis = l;
    if (stopped > 0) l.stop();
    return () => {
      l.destroy();
      if (lenis === l) lenis = null;
    };
  }, [enabled]);

  // New page: jump to the top instantly (Next has already scrolled natively).
  useEffect(() => {
    lenis?.resize();
  }, [pathname]);

  return null;
}
