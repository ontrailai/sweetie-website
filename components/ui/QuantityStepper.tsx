"use client";

import { MAX_LINE_QUANTITY } from "@/lib/commerce";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  label = "Quantity",
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  label?: string;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-10 min-w-10" : "h-[56px] min-w-12";
  return (
    <div role="group" aria-label={label} className="inline-flex items-stretch overflow-hidden rounded-full border-2 border-nero bg-canvas">
      <button
        type="button"
        aria-label={value <= min && min === 0 ? "Remove" : "One fewer"}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min && min > 0}
        className={`${h} grid place-items-center px-3 text-xl transition-colors hover:bg-nero hover:text-canvas disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-nero`}
      >
        <span aria-hidden="true">−</span>
      </button>
      <output aria-live="polite" aria-label={`${label}: ${value}`} className={`${h} grid place-items-center px-2 font-serif text-[22px] font-semibold tabular-nums`}>
        {value}
      </output>
      <button
        type="button"
        aria-label="One more"
        onClick={() => onChange(Math.min(MAX_LINE_QUANTITY, value + 1))}
        disabled={value >= MAX_LINE_QUANTITY}
        className={`${h} grid place-items-center px-3 text-xl transition-colors hover:bg-nero hover:text-canvas disabled:opacity-35`}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
