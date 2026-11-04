"use client";

import { useCart } from "./CartProvider";

export function CartButton({ className = "" }: { className?: string }) {
  const { cart, open, addCount, isOpen } = useCart();
  const n = cart.totalQuantity;
  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-label={`Cart, ${n} ${n === 1 ? "item" : "items"}`}
      className={`btn bg-nero px-[18px] font-serif text-[15px] uppercase tracking-[0.2em] text-canvas ${className}`}
    >
      Cart
      <span key={addCount} className={`${addCount ? "bump" : ""} inline-grid min-w-6 place-items-center rounded-full bg-peacock px-1.5 font-mono text-[13px] leading-6 tracking-normal text-canvas`}>
        {n}
      </span>
    </button>
  );
}
