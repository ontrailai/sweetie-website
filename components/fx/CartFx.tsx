"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { isMotionOff, useMotionPref } from "@/components/motion/MotionPreference";
import { FLY_EVENT, LANDED_EVENT, type FlyDetail } from "./fly";

const CONFETTI = ["#ff007c", "#308f32", "#004832", "#ff0000", "#f6eddd", "#262626"];

/**
 * Every live flight / particle animation, so Pause motion can cancel them
 * mid-air (CSS `animation: none` does not reach WAAPI animations).
 */
const live = new Set<Animation>();
function track(a: Animation, el: HTMLElement) {
  live.add(a);
  const done = () => {
    live.delete(a);
    el.remove();
  };
  a.addEventListener("finish", done);
  a.addEventListener("cancel", done);
  return a;
}
function cancelAll() {
  for (const a of [...live]) a.cancel();
}

function jarGhost(look: FlyDetail["look"]) {
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText =
    "position:fixed;left:0;top:0;width:34px;height:74px;z-index:99;pointer-events:none;border-radius:6px 6px 9px 9px;" +
    `background:linear-gradient(90deg,rgba(0,0,0,.25),transparent 30%,rgba(255,255,255,.35) 42%,transparent 60%,rgba(0,0,0,.25)),${look.honey};` +
    "box-shadow:0 0 0 2px #262626;";
  const lid = document.createElement("div");
  lid.style.cssText = "position:absolute;left:-1px;right:-1px;top:-2px;height:14px;background:#262626;border-radius:4px;";
  const label = document.createElement("div");
  label.style.cssText = `position:absolute;left:0;right:0;top:30%;height:40%;background:${look.labelColor};box-shadow:inset 0 0 0 1px rgba(38,38,38,.25)`;
  el.append(lid, label);
  return el;
}

function burst(x: number, y: number, honey: string) {
  if (isMotionOff()) return;
  const n = 22;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("div");
    const isDrop = i % 3 === 0;
    const size = isDrop ? 8 + Math.random() * 10 : 6 + Math.random() * 6;
    p.setAttribute("aria-hidden", "true");
    p.style.cssText =
      `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${isDrop ? size * 1.25 : size * 0.6}px;z-index:99;pointer-events:none;` +
      `background:${isDrop ? honey : CONFETTI[i % CONFETTI.length]};border-radius:${isDrop ? "50% 50% 50% 50% / 60% 60% 40% 40%" : "2px"};` +
      (isDrop ? "box-shadow:inset -2px -2px 0 rgba(0,0,0,.18), inset 2px 2px 0 rgba(255,255,255,.35);" : "");
    document.body.appendChild(p);
    const angle = (Math.PI * 2 * i) / n + Math.random() * 0.5;
    const dist = 50 + Math.random() * 90;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist * 0.8 - 30;
    const spin = (Math.random() - 0.5) * 720;
    track(p.animate(
      [
        { transform: "translate(-50%,-50%) scale(.3) rotate(0deg)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.45 },
        { transform: `translate(calc(-50% + ${dx * 1.2}px), calc(-50% + ${dy + 140}px)) scale(.8) rotate(${spin}deg)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" },
    ), p);
  }
}

/**
 * Mounted once: plays fly-to-cart + splash, and shows an "Added" toast
 * (role=status, so screen readers hear it whether or not motion is on).
 */
export function CartFx() {
  const { open } = useCart();
  const { calm } = useMotionPref();
  const [toast, setToast] = useState<{ id: number; label: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const onFly = (e: Event) => {
      const { rect, look, label } = (e as CustomEvent<FlyDetail>).detail;
      clearTimeout(timer.current);
      setToast({ id: Date.now(), label });
      timer.current = setTimeout(() => setToast(null), 4200);

      const target = document.querySelector<HTMLElement>("[data-cart-button]");
      const land = () => window.dispatchEvent(new Event(LANDED_EVENT));
      if (isMotionOff() || !rect || !target) return land();

      const t = target.getBoundingClientRect();
      const sx = rect.x + rect.w / 2;
      const sy = rect.y + rect.h / 2;
      const ex = t.left + t.width / 2;
      const ey = t.top + t.height / 2;
      const ghost = jarGhost(look);
      document.body.appendChild(ghost);
      const steps = 14;
      const lift = Math.min(260, Math.abs(sy - ey) * 0.5 + 140);
      const frames: Keyframe[] = Array.from({ length: steps + 1 }, (_, i) => {
        const k = i / steps;
        const x = sx + (ex - sx) * k;
        const y = sy + (ey - sy) * k - Math.sin(Math.PI * k) * lift;
        const s = 1.25 - 0.85 * k;
        return { transform: `translate(${x - 17}px, ${y - 37}px) rotate(${k * 540}deg) scale(${s})` };
      });
      const a = track(ghost.animate(frames, { duration: 820, easing: "cubic-bezier(.45,0,.3,1)" }), ghost);
      // Landed or cancelled by Pause: the count still updates either way,
      // but the splash only plays if motion is still on.
      a.addEventListener("finish", () => {
        burst(ex, ey, look.honey);
        land();
      });
      a.addEventListener("cancel", land);
    };
    window.addEventListener(FLY_EVENT, onFly);
    return () => {
      window.removeEventListener(FLY_EVENT, onFly);
      clearTimeout(timer.current);
      cancelAll();
    };
  }, []);

  // Pause motion: stop anything already in the air.
  useEffect(() => {
    if (calm) cancelAll();
  }, [calm]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 max-md:bottom-[calc(var(--quick-add-h,0px)+16px)]">
      {toast ? (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 rounded-full border-2 border-nero bg-nero py-1.5 pl-5 pr-1.5 text-canvas shadow-[0_5px_0_0_#ff007c] [animation:rise_.5s_var(--ease-pop)_backwards]"
        >
          <span className="font-mono text-[14px] font-bold tracking-[0.06em]">
            <span aria-hidden="true" className="mr-1.5 text-peacock">✶</span>
            {toast.label} added
          </span>
          <button type="button" onClick={open} className="rounded-full bg-canvas px-4 py-2 font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-nero underline-offset-4 hover:underline">
            View cart
          </button>
        </div>
      ) : null}
    </div>
  );
}
