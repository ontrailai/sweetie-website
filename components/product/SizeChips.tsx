"use client";

import { SIZES, type SizeId } from "@/lib/catalog";

/** Size picker as a native radio group (arrow keys move between sizes). */
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
  const pad = size === "lg" ? "min-h-12 px-5 text-[15px]" : "min-h-11 px-4 text-[14px]";
  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="sr-only">{label}</legend>
      {SIZES.map((s) => {
        const checked = s.id === value;
        return (
          <label
            key={s.id}
            className={`relative inline-flex cursor-pointer items-center rounded-full border-2 border-nero font-mono font-bold tracking-[0.06em] transition-[background-color,color,transform] duration-200 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-nero ${pad} ${
              checked ? "-translate-y-0.5 bg-nero text-canvas shadow-[0_3px_0_0_#ff007c]" : "bg-canvas text-nero hover:bg-nero/10"
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
