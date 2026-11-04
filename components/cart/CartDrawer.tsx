"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { Jar } from "@/components/jar/Jar";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { TbdTag } from "@/components/ui/Tbd";
import { Star } from "@/components/brand/Star";
import { formatMoney } from "@/lib/format";
import { PRODUCTS, SUBSCRIPTION } from "@/lib/catalog";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { useScrollLock } from "@/lib/hooks/useScrollLock";
import type { CartLine } from "@/lib/commerce";

export function CartDrawer() {
  const { cart, isOpen, close, update, remove, checkout } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [checkoutMsg, setCheckoutMsg] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    close();
    setCheckoutMsg(null);
  }, [close]);

  const cartButtonRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    cartButtonRef.current = document.querySelector<HTMLElement>("[data-cart-button]");
  }, []);

  useFocusTrap(panelRef, isOpen, handleClose, closeRef, cartButtonRef);
  useScrollLock(isOpen);

  // Close when the user navigates with a link inside the drawer.
  useEffect(() => {
    if (!isOpen) return;
    const el = panelRef.current;
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a[href]")) handleClose();
    };
    el?.addEventListener("click", onClick);
    return () => el?.removeEventListener("click", onClick);
  }, [isOpen, handleClose]);

  const onCheckout = async () => {
    const result = await checkout();
    if (result.kind === "redirect") window.location.assign(result.url);
    else setCheckoutMsg(result.reason);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[70]" key="cart">
          <motion.div
            className="absolute inset-0 bg-nero/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-canvas text-nero shadow-[-12px_0_0_0_#ff007c] outline-none"
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b-2 border-nero px-6 py-5">
              <h2 id="cart-title" className="text-[40px] leading-none">
                Your <em>cart</em>
                <span className="ml-3 align-middle font-mono text-[15px] tracking-[0.075em]">({cart.totalQuantity})</span>
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={handleClose}
                aria-label="Close cart"
                className="grid size-11 place-items-center border-2 border-nero transition-colors hover:bg-nero hover:text-canvas"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M2 2 L14 14 M14 2 L2 14" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {checkoutMsg ? (
                <motion.div
                  key="soon"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="flex flex-1 flex-col justify-center gap-6 px-6 py-10"
                  role="status"
                >
                  <Star className="twinkle size-10 text-peacock" />
                  <p className="t-eyebrow text-forest">Checkout · coming soon</p>
                  <h3 className="text-[56px] leading-[0.9]">
                    Almost <em className="text-peacock">ready.</em>
                  </h3>
                  <p className="max-w-[34ch] text-[15px] leading-relaxed">{checkoutMsg}</p>
                  <p className="max-w-[34ch] text-[15px] leading-relaxed">
                    Can&apos;t wait? Grab a jar in person at one of our markets.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/find-us" className="btn bg-nero text-[15px] text-canvas">
                      Find us at a market
                    </Link>
                    <button type="button" onClick={() => setCheckoutMsg(null)} className="btn border-2 border-nero text-[15px]">
                      Back to cart
                    </button>
                  </div>
                </motion.div>
              ) : cart.lines.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col justify-center gap-6 px-6 py-10">
                  <p className="text-[48px] leading-[0.95]">
                    Your cart is <em className="text-peacock">quiet.</em>
                  </p>
                  <p className="text-[15px] leading-relaxed">Six jars, three sizes. Let&apos;s fix that.</p>
                  <ul className="flex flex-wrap gap-2" aria-label="Jump to a jar">
                    {PRODUCTS.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/shop/${p.slug}`}
                          className="grid size-12 place-items-center rounded-full border-2 border-nero text-[19px] font-bold tracking-normal transition-transform hover:-translate-y-1"
                          style={{ background: p.jar.labelColor, color: p.jar.labelText }}
                          aria-label={`No. ${p.number} ${p.name}`}
                        >
                          {p.number}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <Link href="/shop" className="btn bg-peacock px-7 font-serif text-[24px] tracking-[0.025em] text-canvas">
                      Shop the jars
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="lines" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-0 flex-1 flex-col">
                  <ul className="flex-1 overflow-y-auto overscroll-contain px-6">
                    <AnimatePresence initial={false}>
                      {cart.lines.map((line) => (
                        <motion.li
                          key={line.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-b border-nero/25"
                        >
                          <LineItem line={line} onQty={(q) => update(line.id, q)} onRemove={() => remove(line.id)} />
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  <div className="border-t-2 border-nero bg-canvas px-6 pb-6 pt-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="t-eyebrow text-forest">Subtotal</span>
                      <span className="font-serif text-[32px] tracking-[0.025em]">{formatMoney(cart.subtotal)}</span>
                    </div>
                    {cart.placeholderPricing ? (
                      <p className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
                        <TbdTag>Placeholder pricing</TbdTag>
                        <span>Prices are not final.</span>
                      </p>
                    ) : null}
                    <p className="mt-2 text-[13px] opacity-80">Shipping and taxes calculated at checkout.</p>
                    <button
                      type="button"
                      onClick={onCheckout}
                      className="btn mt-5 min-h-[60px] w-full bg-peacock font-serif text-[26px] tracking-[0.025em] text-canvas"
                    >
                      Checkout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function LineItem({ line, onQty, onRemove }: { line: CartLine; onQty: (q: number) => void; onRemove: () => void }) {
  return (
    <div className="flex gap-4 py-5">
      <div className="grid w-16 shrink-0 place-items-center bg-nero/[0.06] px-3 py-2">
        {line.jar ? (
          <Jar {...line.jar} alive={false} decorative />
        ) : (
          <div className="grid aspect-[3/4] w-full place-items-center bg-peacock text-canvas" aria-hidden="true">
            <Star className="size-5" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {line.href ? (
              <Link href={line.href} className="font-serif text-[24px] leading-tight tracking-[0.025em] hover:text-peacock">
                {line.title}
              </Link>
            ) : (
              <span className="font-serif text-[24px] leading-tight">{line.title}</span>
            )}
            <p className="text-[13px]">{line.subtitle}</p>
            <p className="text-[13px] text-forest">
              {line.purchase.mode === "subscribe" ? (
                <>
                  Subscribe · {line.purchase.frequency} · save {SUBSCRIPTION.discountPercent}%
                  {SUBSCRIPTION.discountIsPlaceholder ? " (TBD)" : ""}
                </>
              ) : (
                "One-time purchase"
              )}
            </p>
          </div>
          <span className="shrink-0 text-right text-[15px] tabular-nums">
            {formatMoney(line.lineTotal)}
            {line.placeholderPrice ? <span className="block text-[11px] uppercase opacity-70">placeholder</span> : null}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <QuantityStepper value={line.quantity} onChange={onQty} size="sm" label={`Quantity of ${line.title}`} />
          <button type="button" onClick={onRemove} className="min-h-11 px-1 text-[13px] underline underline-offset-4 hover:text-peacock">
            Remove<span className="sr-only"> {line.title}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
