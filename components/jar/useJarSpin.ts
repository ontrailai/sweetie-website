"use client";

import { animate, useMotionValue } from "motion/react";
import { useCallback } from "react";
import { useMotionPref } from "@/components/motion/MotionPreference";
import { TURN } from "./Jar";

/** A label-spin motion value plus a helper that spins the jar back to its front. */
export function useJarSpin(initial = 0) {
  const spin = useMotionValue(initial);
  const { enabled } = useMotionPref();
  const turn = useCallback(
    (turns = 1) => {
      if (!enabled) return;
      const target = Math.round(spin.get() / TURN) * TURN + TURN * turns;
      animate(spin, target, { type: "spring", stiffness: 38, damping: 13, mass: 1 });
    },
    [enabled, spin],
  );
  return { spin, turn };
}
