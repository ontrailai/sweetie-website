"use client";

import { useEffect, useState } from "react";
import { LANDED_EVENT } from "@/components/fx/fly";
import { useCart } from "./CartProvider";

/** Rolling odometer digits (decorative; the real count is sr-only text). */
function Odometer({ value }: { value: number }) {
  const digits = String(Math.min(value, 99)).split("");
  return (
    <span aria-hidden="true" className="inline-flex h-[1em] overflow-hidden leading-none">
      {digits.map((d, i) => (
        <span key={`${digits.length}-${i}`} className="inline-flex flex-col transition-transform duration-700 ease-[var(--ease-pop)]" style={{ transform: `translateY(-${Number(d)}em)` }}>
          {Array.from({ length: 10 }, (_, n) => (
            <span key={n} className="h-[1em]">
              {n}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

export function CartButton({ className = "" }: { className?: string }) {
  const { cart, open, isOpen } = useCart();
  const n = cart.totalQuantity;
  const [squish, setSquish] = useState(0);

  useEffect(() => {
    const onLanded = () => setSquish((s) => s + 1);
    window.addEventListener(LANDED_EVENT, onLanded);
    return () => window.removeEventListener(LANDED_EVENT, onLanded);
  }, []);

  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      data-cart-button=""
      data-cursor="cart"
      className={`group inline-flex min-h-11 items-center gap-2.5 rounded-full border-2 border-nero bg-nero py-1 pl-4 pr-1.5 font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-canvas transition-transform duration-300 ease-[var(--ease-pop)] hover:-translate-y-0.5 ${className}`}
    >
      Cart
      <span
        key={squish}
        className={`${squish ? "squish" : ""} inline-grid h-8 min-w-8 place-items-center rounded-full bg-canvas px-2 font-serif text-[18px] font-semibold text-nero ring-2 ring-peacock`}
      >
        <Odometer value={n} />
        <span className="sr-only">
          , {n} {n === 1 ? "item" : "items"}
        </span>
      </span>
    </button>
  );
}
