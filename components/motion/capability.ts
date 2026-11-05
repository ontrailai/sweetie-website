/**
 * Device capability checks (pointer type, low-power hints, idle scheduling).
 * Client-only (call from effects).
 */
type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

/** true on Save-Data, slow networks, few cores or little memory. */
export function isLowPower(): boolean {
  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return true;
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return true;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency > 0 && nav.hardwareConcurrency < 4) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return true;
  // Escape hatch for QA: /?static forces the fallback jar.
  if (new URLSearchParams(window.location.search).has("static")) return true;
  return false;
}

export function isFinePointer(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Runs `cb` once the browser is idle after first paint (and after load). */
export function afterFirstPaint(cb: () => void, timeout = 1500): () => void {
  let cancelled = false;
  let idle: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const go = () => {
    if (cancelled) return;
    if (w.requestIdleCallback) idle = w.requestIdleCallback(() => !cancelled && cb(), { timeout });
    else timer = setTimeout(() => !cancelled && cb(), 200);
  };
  const raf = requestAnimationFrame(() => {
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  });
  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("load", go);
    if (idle !== undefined) w.cancelIdleCallback?.(idle);
    if (timer) clearTimeout(timer);
  };
}
