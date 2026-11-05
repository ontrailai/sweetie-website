"use client";

import dynamic from "next/dynamic";
import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Product } from "@/lib/catalog";
import { useMotionPref } from "@/components/motion/MotionPreference";
import { afterFirstPaint, hasWebGL, isLowPower } from "@/components/motion/capability";
import { getTilt } from "@/components/fx/tilt";
import type { JarLook, SceneInput } from "./scene";

const HoneyJarCanvas = dynamic(() => import("./HoneyJarCanvas"), { ssr: false });

export function lookOf(p: Product): JarLook {
  return {
    number: p.number,
    name: p.name,
    descriptor: p.descriptor,
    labelColor: p.jar.labelColor,
    labelText: p.jar.labelText ?? "#F6EDDD",
    honey: p.jar.honey,
    honeyDark: p.jar.honeyDark,
    specks: p.jar.specks,
  };
}

/**
 * The 3D jar with its static fallback.
 *
 * The fallback (an SVG jar, server-rendered) is always in the DOM, so the
 * page is complete without JS or WebGL. The WebGL canvas is only requested
 * when motion is on, the device isn't low-power (cores / memory / Save-Data)
 * and the page has painted and gone idle; it crossfades in after its first
 * frame. Turning motion off unmounts it (RAF, listeners and the WebGL
 * context are all released) and the SVG jar returns.
 */
export function HoneyJar3D({
  product,
  mode,
  fallback,
  spin,
  shake,
  className = "",
}: {
  product: Product;
  mode: "hero" | "product";
  fallback: ReactNode;
  /** Extra Y rotation in radians (scroll spin, drag). */
  spin?: MotionValue<number>;
  /** Bump to agitate the honey (e.g. on drag release). */
  shake?: MotionValue<number>;
  className?: string;
}) {
  const { enabled } = useMotionPref();
  const [want, setWant] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const look = useMemo(() => lookOf(product), [product]);
  // A mutable bag the render loop reads every frame (no React re-renders).
  // Only dereferenced inside effects.
  const input = useRef<SceneInput>({ pointer: { x: 0, y: 0, active: false }, tilt: getTilt(), spin: 0, shake: 0 });

  useEffect(() => {
    if (!enabled || isLowPower()) return;
    return afterFirstPaint(() => setWant(hasWebGL()));
  }, [enabled]);

  useEffect(() => {
    if (!spin) return;
    const bag = input.current;
    bag.spin = spin.get();
    return spin.on("change", (v) => {
      bag.spin = v;
    });
  }, [spin]);

  useEffect(() => {
    if (!shake) return;
    const bag = input.current;
    return shake.on("change", (v) => {
      bag.shake = v;
    });
  }, [shake]);

  const live = enabled && want && !failed;
  // When the canvas unmounts (motion off), forget it was ready so turning
  // motion back on crossfades from the SVG again instead of a blank canvas.
  const [wasLive, setWasLive] = useState(live);
  if (live !== wasLive) {
    setWasLive(live);
    if (!live) setReady(false);
  }
  const shown = live && ready;

  return (
    <div className={`relative ${className}`} data-jar3d={shown ? "live" : "static"}>
      <div className={`size-full transition-opacity duration-700 ${shown ? "opacity-0" : "opacity-100"}`}>{fallback}</div>
      {live ? (
        <div className={`absolute inset-0 transition-opacity duration-700 ${shown ? "opacity-100" : "opacity-0"}`}>
          <HoneyJarCanvas
            mode={mode}
            look={look}
            inputRef={input}
            onReady={() => setReady(true)}
            onFail={() => {
              setFailed(true);
              setReady(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
