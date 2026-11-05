"use client";

/**
 * Shared DeviceOrientation store. Values are read inside RAF loops (no React
 * re-renders). iOS needs DeviceOrientationEvent.requestPermission(), which
 * may only be called from a user gesture — see <TiltButton>.
 */
import { useSyncExternalStore } from "react";

export type TiltStatus = "unsupported" | "needs-permission" | "active" | "denied" | "idle";

const tilt = { x: 0, y: 0, active: false };
let status: TiltStatus = "idle";
let listening = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

type DOE = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

function onOrient(e: DeviceOrientationEvent) {
  if (e.gamma == null || e.beta == null) return;
  const clamp = (v: number) => Math.max(-1, Math.min(1, v));
  tilt.x = clamp(e.gamma / 30);
  tilt.y = clamp((e.beta - 50) / 30);
  if (!tilt.active) {
    tilt.active = true;
    status = "active";
    emit();
  }
}

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("deviceorientation", onOrient);
}

function computeStatus(): TiltStatus {
  if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return "unsupported";
  if (!window.matchMedia("(pointer: coarse)").matches) return "unsupported";
  if (status === "active" || status === "denied") return status;
  return typeof (DeviceOrientationEvent as DOE).requestPermission === "function" ? "needs-permission" : "idle";
}

/** Start listening where no permission is needed (Android). */
export function autoStartTilt() {
  const s = computeStatus();
  if (s === "idle") listen();
}

/** Call from a click handler. */
export async function requestTilt(): Promise<boolean> {
  const req = (DeviceOrientationEvent as DOE).requestPermission;
  try {
    if (typeof req === "function") {
      const r = await req();
      if (r !== "granted") {
        status = "denied";
        emit();
        return false;
      }
    }
    listen();
    status = "active";
    emit();
    return true;
  } catch {
    status = "denied";
    emit();
    return false;
  }
}

export function getTilt() {
  return tilt;
}

export function useTiltStatus(): TiltStatus {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    computeStatus,
    () => "unsupported",
  );
}
