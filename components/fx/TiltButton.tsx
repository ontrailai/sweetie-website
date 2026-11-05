"use client";

import { useEffect } from "react";
import { useMotionPref } from "@/components/motion/MotionPreference";
import { autoStartTilt, requestTilt, useTiltStatus } from "./tilt";

/** "Tilt to slosh": shown only on phones that need permission (iOS), motion on. */
export function TiltButton({ className = "" }: { className?: string }) {
  const status = useTiltStatus();
  const { enabled } = useMotionPref();
  useEffect(() => {
    if (enabled) autoStartTilt();
  }, [enabled]);
  if (!enabled || status !== "needs-permission") return null;
  return (
    <button type="button" onClick={() => void requestTilt()} className={`chip min-h-11 border-2 border-nero px-4 ${className}`}>
      <span aria-hidden="true">↻</span> Tilt your phone to slosh the honey
    </button>
  );
}
