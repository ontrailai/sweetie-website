"use client";

import { useMotionPref } from "./MotionPreference";

type Variant = "pill" | "icon";

/** The site-wide pause-motion switch (persisted; overrides the OS setting). */
export function MotionToggle({ variant = "pill", className = "" }: { variant?: Variant; className?: string }) {
  const { enabled, toggle } = useMotionPref();
  const label = enabled ? "Pause motion" : "Play motion";
  const icon = (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" className="shrink-0">
      <path d={enabled ? "M2 1 H5 V11 H2 Z M7 1 H10 V11 H7 Z" : "M2 1 L11 6 L2 11 Z"} fill="currentColor" />
    </svg>
  );
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!enabled}
        aria-label={label}
        title={label}
        className={`grid size-11 place-items-center rounded-full border-2 transition-transform hover:-translate-y-0.5 ${className}`}
      >
        {icon}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!enabled}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-current px-4 font-mono text-[13px] font-bold uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5 ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}
