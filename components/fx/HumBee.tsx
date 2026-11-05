"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Bee } from "@/components/brand/Illustrations";
import { useMotionPref } from "@/components/motion/MotionPreference";

const BEE_W = 0.5; // half the bee's box, used to centre it on its path
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/**
 * The hum, embodied: a bee that flies laps around the hero jar.
 *
 * It follows a moving target with a damped spring, so the path is always a
 * smooth curve. The target is an orbit around `around` (the jar) whose radius,
 * speed and height wander, with a dart off somewhere every few seconds. On
 * the far side of the orbit it drops behind the jar and shrinks a little. It
 * banks into turns, pitches nose-up when climbing and turns (not flips) to
 * face where it's going.
 *
 * A mouse steers it while it moves (it goes back to its laps 2.5 s after the
 * mouse stops). Touch screens never steer: the laps are the show.
 * Motion off → it perches. Paused off-screen.
 */
export function HumBee({
  className = "",
  perch = { x: 0.62, y: 0.2 },
  around,
}: {
  className?: string;
  /** Resting spot (fraction of the host) when motion is off. */
  perch?: { x: number; y: number };
  /** Element to orbit (same positioned parent). Without it the bee laps the host's upper middle. */
  around?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { enabled } = useMotionPref();

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    const size = () => el.offsetWidth || 80;
    if (!enabled) {
      el.style.zIndex = "";
      el.style.transform = `translate3d(${(perch.x * host.clientWidth).toFixed(1)}px, ${(perch.y * host.clientHeight).toFixed(1)}px, 0)`;
      return;
    }

    // The orbit, in host px. Refreshed a few times a second (the jar moves with scroll).
    const orbit = { cx: 0, cy: 0, rx: 0, ry: 0, hasJar: false };
    let measuredAt = -1e9;
    const measure = () => {
      const h = host.getBoundingClientRect();
      const jar = around?.current?.getBoundingClientRect();
      if (jar && jar.width > 0) {
        orbit.cx = jar.left - h.left + jar.width / 2;
        orbit.cy = jar.top - h.top + jar.height * 0.42;
        orbit.rx = Math.max(jar.width * 0.8, 110);
        orbit.ry = Math.max(jar.height * 0.42, 90);
        orbit.hasJar = true;
      } else {
        orbit.cx = h.width * 0.56;
        orbit.cy = h.height * 0.34;
        orbit.rx = h.width * 0.28;
        orbit.ry = h.height * 0.16;
        orbit.hasJar = false;
      }
      // Keep the whole lap on screen.
      const s = size();
      orbit.rx = Math.min(orbit.rx, orbit.cx - s * 0.2, h.width - orbit.cx - s * 0.8);
      orbit.rx = Math.max(orbit.rx, 60);
      orbit.ry = Math.min(orbit.ry, orbit.cy - s * 0.1, h.height - orbit.cy - s);
      orbit.ry = Math.max(orbit.ry, 50);
    };

    measure();
    let x = orbit.cx + orbit.rx;
    let y = orbit.cy;
    let vx = 0;
    let vy = 0;
    let tx = x;
    let ty = y;
    let face = 1;
    let depth = 1;
    let scale = 1;
    let z = "";
    let theta = 0;
    let pointerAt = -1e9;
    let px = 0;
    let py = 0;
    let dart: { x: number; y: number; until: number } | null = null;
    let nextDart = 3.5;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    const t0 = last;
    const touch = window.matchMedia("(hover: none)").matches;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      pointerAt = performance.now();
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const t = (now - t0) / 1000;
      if (now - measuredAt > 250) {
        measure();
        measuredAt = now;
      }
      const s = size();
      const steering = !touch && now - pointerAt < 2500;

      if (steering) {
        tx = px - s * BEE_W;
        ty = py - s * 0.45;
        depth = 1;
        dart = null;
      } else {
        // Laps: speed, radius and height all wander so no two are the same.
        theta += dt * (1.15 + 0.45 * Math.sin(t * 0.37) + 0.25 * Math.sin(t * 1.3));
        const rx = orbit.rx * (1 + 0.22 * Math.sin(t * 0.53));
        const ry = orbit.ry * (1 + 0.3 * Math.sin(t * 0.71 + 1));
        const lx = orbit.cx + Math.cos(theta) * rx + Math.sin(t * 1.7) * rx * 0.12;
        const ly = orbit.cy + Math.sin(theta) * ry * 0.55 + Math.sin(t * 0.9) * ry * 0.45 + Math.sin(t * 2.6) * 10;
        depth = orbit.hasJar ? Math.sin(theta) : 1;
        if (t > nextDart && !dart) {
          const a = Math.random() * Math.PI * 2;
          dart = { x: orbit.cx + Math.cos(a) * orbit.rx * 1.25, y: orbit.cy + Math.sin(a) * orbit.ry * 1.1, until: t + 0.9 };
          nextDart = t + 4 + Math.random() * 4;
        }
        if (dart && t > dart.until) dart = null;
        // Never leave the host, whatever the wander adds up to.
        const hw = host.clientWidth;
        const hh = host.clientHeight;
        tx = clamp((dart ? dart.x : lx) - s * BEE_W, s * 0.05, hw - s * 1.05);
        ty = clamp((dart ? dart.y : ly) - s * 0.45, s * 0.6, hh - s * 1.2);
        if (dart) depth = 1;
      }

      // Damped spring toward the target (stiffer while darting).
      const k = dart ? 26 : steering ? 14 : 18;
      const c = 2 * Math.sqrt(k) * 0.62;
      const ax = (tx - x) * k - vx * c;
      const ay = (ty - y) * k - vy * c;
      vx += ax * dt;
      vy += ay * dt;
      x += vx * dt;
      y += vy * dt;

      const speed = Math.hypot(vx, vy);
      // Turn to face the way it's going (through 0 = a turn, not a flip).
      if (Math.abs(vx) > 18) face += ((vx > 0 ? 1 : -1) - face) * Math.min(1, dt * 9);
      // Bank into the turn (lateral acceleration) + nose up when climbing.
      const lateral = speed > 1 ? (vx * ay - vy * ax) / speed : 0;
      const bank = clamp(lateral * 0.012, -32, 32);
      const pitch = clamp(vy * 0.06, -22, 22) * Math.sign(face || 1);
      const rot = clamp(pitch + bank, -40, 40);
      // Behind the jar on the far side of the lap.
      // Only the top of the far arc, so it's out of sight briefly, not half the time.
      const behind = depth < -0.75;
      scale += ((behind ? 0.74 : 0.9 + 0.1 * Math.max(depth, 0)) - scale) * Math.min(1, dt * 6);
      const nextZ = behind ? "5" : "";
      if (nextZ !== z) {
        z = nextZ;
        el.style.zIndex = z;
      }
      // A little hover jitter on top of the flight path.
      const jx = Math.sin(t * 23) * 1.2;
      const jy = Math.cos(t * 17) * 1.8;
      const squash = 1 - Math.min(Math.abs(bank) / 140, 0.2);
      el.style.transform =
        `translate3d(${(x + jx).toFixed(1)}px, ${(y + jy).toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) ` +
        `scale(${(-face * scale).toFixed(3)}, ${(scale * squash).toFixed(3)})`;
      if (visible) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(host);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      el.style.zIndex = "";
    };
  }, [enabled, perch.x, perch.y, around]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 top-0 z-30 w-[clamp(64px,7vw,104px)] origin-center will-change-transform ${className}`}
    >
      <Bee flying={enabled} className="w-full drop-shadow-[0_6px_0_rgba(38,38,38,0.25)]" />
    </div>
  );
}
