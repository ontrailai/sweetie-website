"use client";

import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { DEFAULT_SIZE, SIZES, getVariant, type Product, type SizeId } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { useMotionPref } from "@/components/motion/MotionPreference";
import { useQuickAdd } from "@/components/fx/useQuickAdd";
import { Price } from "@/components/ui/Price";
import { SizeChips } from "./SizeChips";

/**
 * A full-colour jar tile. The jar leans toward the cursor in 3D; the whole
 * tile links to the product (stretched link) while size + quick-add sit
 * above it on a Canvas strip.
 */
export function JarCard({ product: p, sizes = true, tilt = 0, headingLevel = 3 }: { product: Product; sizes?: boolean; tilt?: number; headingLevel?: 2 | 3 }) {
  const [size, setSize] = useState<SizeId>(DEFAULT_SIZE);
  const variant = getVariant(p, size);
  const quickAdd = useQuickAdd();
  const jarRef = useRef<HTMLDivElement>(null);
  const { enabled } = useMotionPref();
  const ink = p.jar.labelText ?? "#F6EDDD";
  const H = headingLevel === 2 ? "h2" : "h3";
  const sizeLabel = SIZES.find((s) => s.id === size)!.label;

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = jarRef.current;
    if (!el || !enabled || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 28}deg) rotateX(${-y * 16}deg) translateY(-4%) scale(1.04)`;
  };
  const onLeave = () => {
    if (jarRef.current) jarRef.current.style.transform = "";
  };

  return (
    <article
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-[30px] border-2 border-nero shadow-[6px_6px_0_0_#262626] transition-transform duration-500 ease-[var(--ease-pop)] hover:-translate-y-2 hover:rotate-0"
      style={{ background: p.jar.labelColor, color: ink, rotate: `${tilt}deg` }}
    >
      <span aria-hidden="true" className="display text-stroke pointer-events-none absolute -right-[0.06em] -top-[0.12em] -z-10 text-[clamp(140px,16vw,240px)] opacity-35">
        {p.number}
      </span>
      <div className="flex flex-1 flex-col gap-3 p-6 pb-0">
        <span className="chip self-start">
          No. {p.number} · {p.category}
        </span>
        <H className="display text-[clamp(48px,4.6vw,76px)]">
          <Link href={`/shop/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none [&:focus-visible]:after:outline-3 [&:focus-visible]:after:-outline-offset-8 [&:focus-visible]:after:outline-current [&:focus-visible]:after:rounded-[26px]">
            {p.display.lead.trim()}
            {p.display.lead.endsWith(" ") ? " " : ""}
            <em>{p.display.em}</em>
          </Link>
        </H>
        <p className="font-serif text-[24px] italic leading-tight">{p.tagline}</p>
        <div className="relative mx-auto mt-auto w-[38%] pt-4">
          <div ref={jarRef} className="transition-transform duration-500 ease-[var(--ease-out-soft)] will-change-transform">
            <Jar {...p.jar} number={p.number} name={p.name} descriptor={p.descriptor} decorative alive={false} />
          </div>
        </div>
      </div>
      <div className="relative z-10 flex flex-col gap-3 border-t-2 border-nero bg-canvas p-5 text-nero">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Price price={variant.price} className="font-serif text-[30px] font-medium leading-none tracking-[-0.02em]" />
          <span className="t-eyebrow text-[11px]">
            Best at {p.bestAt.time}
          </span>
        </div>
        {sizes ? <SizeChips value={size} onChange={setSize} name={`card-size-${p.slug}`} label={`Size for No. ${p.number} ${p.name}`} /> : null}
        <button
          type="button"
          className="btn w-full bg-nero text-canvas"
          onClick={() =>
            void quickAdd(
              { merchandiseId: variant.id, quantity: 1, purchase: { mode: "one-time" } },
              { source: jarRef.current, look: { labelColor: p.jar.labelColor, honey: p.jar.honey }, label: `No. ${p.number} ${p.name} (${sizeLabel})` },
            )
          }
        >
          Quick add · {sizeLabel}
          <span className="sr-only"> of No. {p.number} {p.name}</span>
        </button>
      </div>
    </article>
  );
}
