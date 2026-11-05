"use client";

/**
 * Client-only WebGL host for the jar. This module (and three.js with it) is
 * only ever loaded through next/dynamic from <HoneyJar3D>.
 */
import { useEffect, useRef, type RefObject } from "react";
import { createJarScene, type JarLook, type SceneInput } from "./scene";

export default function HoneyJarCanvas({
  mode,
  look,
  inputRef,
  onReady,
  onFail,
  className = "",
}: {
  mode: "hero" | "product";
  look: JarLook;
  inputRef: RefObject<SceneInput>;
  onReady: () => void;
  onFail: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lookRef = useRef(look);
  const sceneRef = useRef<ReturnType<typeof createJarScene> | null>(null);

  useEffect(() => {
    const host = ref.current;
    const input = inputRef.current;
    if (!host || !input) return;
    // A fresh <canvas> per mount: dispose() force-loses the WebGL context, and
    // a remount (StrictMode, motion toggled back on) must not inherit it.
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "display:block;width:100%;height:100%";
    host.appendChild(canvas);
    let scene: ReturnType<typeof createJarScene>;
    try {
      scene = createJarScene(canvas, { mode, look: lookRef.current, input, onFirstFrame: onReady, onContextLost: onFail });
    } catch {
      canvas.remove();
      onFail();
      return;
    }
    sceneRef.current = scene;

    const ro = new ResizeObserver(([e]) => {
      const r = e?.contentRect;
      if (r && r.width > 0 && r.height > 0) scene.setSize(r.width, r.height);
    });
    ro.observe(canvas);

    let inView = false;
    const sync = () => (inView && document.visibilityState === "visible" ? scene.start() : scene.stop());
    const io = new IntersectionObserver(([e]) => {
      inView = !!e?.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    // Pointer: hero follows the cursor anywhere on screen; product mode only
    // over the canvas (drag spin is handled by the host).
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (mode === "hero" ? window.innerWidth / 2 : r.width / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (mode === "hero" ? window.innerHeight / 2 : r.height / 2);
      input.pointer.x = Math.max(-1, Math.min(1, nx));
      input.pointer.y = Math.max(-1, Math.min(1, ny));
      input.pointer.active = true;
    };
    const onLeave = () => {
      input.pointer.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      scene.dispose();
      canvas.remove();
      sceneRef.current = null;
    };
    // The scene is created once per mount; look changes go through setLook below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    lookRef.current = look;
    sceneRef.current?.setLook(look);
  }, [look]);

  return <div ref={ref} aria-hidden="true" className={`size-full ${className}`} />;
}
