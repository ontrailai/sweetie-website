"use client";

import { SIZES, type SizeId } from "@/lib/catalog";

/** Size picker as a radio group (arrow keys move between sizes). */
export function SizeChips({
  value,
  onChange,
  name,
  size = "sm",
  label = "Size",
}: {
  value: SizeId;
  onChange: (s: SizeId) => void;
  name: string;
  size?: "sm" | "lg";
  label?: string;
}) {
  const pad = size === "lg" ? "min-h-12 px-[18px]" : "min-h-11 px-[14px]";
  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="sr-only">{label}</legend>
      {SIZES.map((s) => {
        const checked = s.id === value;
        return (
          <label
            key={s.id}
            className={`relative inline-flex cursor-pointer items-center border-[1.5px] border-nero text-[15px] tracking-[0.075em] transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-forest ${pad} ${
              checked ? "bg-nero text-canvas" : "bg-transparent text-nero hover:bg-nero/10"
            }`}
          >
            <input type="radio" className="sr-only" name={name} value={s.id} checked={checked} onChange={() => onChange(s.id)} />
            {s.label}
          </label>
        );
      })}
    </fieldset>
  );
}
