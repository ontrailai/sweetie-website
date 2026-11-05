"use client";

import { MotionConfig, type Transition } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

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
  /**
   * true when JS (Motion) transitions must be instant. Unlike `enabled` this
   * is already correct during hydration (it reads the boot script's
   * html[data-motion]), so it never lets a first animation slip through.
   */
  calm: boolean;
  toggle: () => void;
}

const MotionPrefContext = createContext<MotionPrefValue>({ enabled: true, calm: false, toggle: () => {} });

const noopSubscribe = () => () => {};

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const choice = useSyncExternalStore(subscribeChoice, readChoice, () => null);
  const osReduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  const enabled = choice ? choice === "on" : !osReduced;
  // During hydration the stores above return their server snapshots (motion
  // on). The boot script has already written the real answer to <html>, so
  // read it once for anything that is not rendered markup.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [bootCalm] = useState(() => typeof document !== "undefined" && document.documentElement.dataset.motion === "off");
  const calm = hydrated ? !enabled : bootCalm;

  useEffect(() => {
    // Skip the hydration pass so <html> never flickers to "on".
    if (!hydrated) return;
    document.documentElement.dataset.motion = enabled ? "on" : "off";
  }, [enabled, hydrated]);

  const toggle = useCallback(() => {
    try {
      window.localStorage.setItem(MOTION_STORAGE_KEY, enabled ? "off" : "on");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(EVENT));
  }, [enabled]);

  const value = useMemo(() => ({ enabled, calm, toggle }), [enabled, calm, toggle]);

  return (
    <MotionPrefContext.Provider value={value}>
      <MotionConfig reducedMotion={calm ? "always" : "never"} transition={calm ? INSTANT : undefined}>
        {children}
      </MotionConfig>
    </MotionPrefContext.Provider>
  );
}

export function useMotionPref() {
  return useContext(MotionPrefContext);
}

/** An instant transition: what every Motion animation becomes when calm. */
export const INSTANT: Transition = { type: false };

/**
 * Motion only reads MotionConfig.reducedMotion when an element mounts, so
 * existing elements keep animating after Pause. Pass every explicit
 * `transition` through this instead; transitions are read per animation,
 * so the switch takes effect immediately.
 *
 *   const t = useCalmTransition();
 *   <motion.div transition={t({ type: "spring", stiffness: 300 })} />
 */
export function useCalmTransition() {
  const { calm } = useMotionPref();
  return useCallback((full: Transition = {}): Transition => (calm ? INSTANT : full), [calm]);
}

/** Non-React code (WAAPI, timers): is motion off right now? */
export function isMotionOff() {
  return typeof document !== "undefined" && document.documentElement.dataset.motion === "off";
}

/** Runs before paint (inlined in <head>) to set html[data-motion]. */
export const motionBootScript = `(function(){try{var c=localStorage.getItem('${MOTION_STORAGE_KEY}');var r=window.matchMedia('${QUERY}').matches;document.documentElement.dataset.motion=c?c:(r?'off':'on');}catch(e){}})();`;
