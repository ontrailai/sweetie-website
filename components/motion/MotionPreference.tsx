"use client";

import { MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";

/**
 * Motion preference = explicit user choice (persisted) ?? OS prefers-reduced-motion.
 * The inline script in app/layout.tsx applies the same rule to <html data-motion>
 * before first paint so CSS animations never flash on.
 */
export const MOTION_STORAGE_KEY = "sweetbee.motion";
const EVENT = "sweetbee:motion";

type Choice = "on" | "off" | null;

function readChoice(): Choice {
  try {
    const v = window.localStorage.getItem(MOTION_STORAGE_KEY);
    return v === "on" || v === "off" ? v : null;
  } catch {
    return null;
  }
}

function subscribeChoice(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === MOTION_STORAGE_KEY && cb();
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVENT, cb);
  };
}

const QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

interface MotionPrefValue {
  /** true when motion should run. */
  enabled: boolean;
  toggle: () => void;
}

const MotionPrefContext = createContext<MotionPrefValue>({ enabled: true, toggle: () => {} });

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const choice = useSyncExternalStore(subscribeChoice, readChoice, () => null);
  const osReduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  const enabled = choice ? choice === "on" : !osReduced;

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? "on" : "off";
  }, [enabled]);

  const toggle = useCallback(() => {
    try {
      window.localStorage.setItem(MOTION_STORAGE_KEY, enabled ? "off" : "on");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(EVENT));
  }, [enabled]);

  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle]);

  return (
    <MotionPrefContext.Provider value={value}>
      <MotionConfig reducedMotion={enabled ? "never" : "always"}>{children}</MotionConfig>
    </MotionPrefContext.Provider>
  );
}

export function useMotionPref() {
  return useContext(MotionPrefContext);
}

/** Runs before paint (inlined in <head>) to set html[data-motion]. */
export const motionBootScript = `(function(){try{var c=localStorage.getItem('${MOTION_STORAGE_KEY}');var r=window.matchMedia('${QUERY}').matches;document.documentElement.dataset.motion=c?c:(r?'off':'on');}catch(e){}})();`;
