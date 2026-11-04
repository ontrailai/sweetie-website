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
      data-cart-button=""
      aria-expanded={isOpen}
      className={`btn bg-nero px-[18px] font-serif text-[15px] uppercase tracking-[0.2em] text-canvas ${className}`}
    >
      Cart
      {/* Nero on Canvas (13:1); Canvas on Peacock is only 3.26:1 at this size. */}
      <span key={addCount} className={`${addCount ? "bump" : ""} inline-grid min-w-6 place-items-center rounded-full bg-canvas px-1.5 font-mono text-[13px] leading-6 tracking-normal text-nero ring-2 ring-peacock`}>
        {n}
        <span className="sr-only"> {n === 1 ? "item" : "items"}</span>
      </span>
    </button>
  );
}
