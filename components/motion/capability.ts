/**
 * Device capability checks used to decide whether the WebGL jar runs or the
 * static SVG jar stays. Client-only (call from effects).
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

/**
 * Probes for WebGL on a throwaway canvas, so three.js never has to fail
 * (and log) in front of the user. Cached for the page's lifetime.
 */
let webgl: boolean | undefined;
export function hasWebGL(): boolean {
  if (webgl !== undefined) return webgl;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") ?? c.getContext("webgl")) as WebGLRenderingContext | null;
    // Some blocklisted / software GPUs return a context that can't report
    // shader precision; three.js would throw on it, so treat it as no WebGL.
    webgl = !!gl && !gl.isContextLost() && !!gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webgl = false;
  }
  return webgl;
}
