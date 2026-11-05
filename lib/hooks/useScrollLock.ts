"use client";

import { useEffect } from "react";
import { startSmoothScroll, stopSmoothScroll } from "@/components/motion/SmoothScroll";

let locks = 0;
let saved: { overflow: string; paddingRight: string } | null = null;

/** Locks body scroll while active (ref-counted, compensates for the scrollbar, pauses Lenis). */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    stopSmoothScroll();
    const body = document.body;
    if (locks === 0) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
      body.style.overflow = "hidden";
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }
    locks++;
    return () => {
      startSmoothScroll();
      locks--;
      if (locks === 0 && saved) {
        body.style.overflow = saved.overflow;
        body.style.paddingRight = saved.paddingRight;
        saved = null;
      }
    };
  }, [active]);
}
