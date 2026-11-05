"use client";

import { useSyncExternalStore } from "react";
import { getHum, getHumServer, setHum, subscribeHum } from "./hum-audio";

/** Clearly labelled, off-by-default toggle for the ambient hum. */
export function HumToggle({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const on = useSyncExternalStore(subscribeHum, getHum, getHumServer);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => void setHum(!on)}
      title={on ? "Turn the hum sound off" : "Play the hive hum (sound)"}
      className={`group inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-current px-4 font-mono text-[13px] font-bold uppercase tracking-[0.12em] transition-colors ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 28 16" className="h-4 w-7 shrink-0">
        {[2, 7, 12, 17, 22].map((x, i) => (
          <rect
            key={x}
            x={x}
            width="3"
            rx="1.5"
            fill="currentColor"
            y={on ? [5, 1, 3, 0, 6][i] : 6.5}
            height={on ? [6, 14, 10, 16, 4][i] : 3}
            className={on ? "origin-center [animation:buzz_.35s_ease-in-out_infinite_alternate]" : ""}
            style={{ animationDelay: `${i * -70}ms` }}
          />
        ))}
      </svg>
      {compact ? (
        <span>
          Hum<span className="sr-only"> sound {on ? "on" : "off"}</span>
        </span>
      ) : (
        <span>
          Hum {on ? "on" : "off"}
          <span className="sr-only"> (sound)</span>
        </span>
      )}
    </button>
  );
}
