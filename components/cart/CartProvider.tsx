"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { commerce, type Cart, type CartLineInput, type CheckoutResult } from "@/lib/commerce";
import { usd } from "@/lib/catalog";

const EMPTY: Cart = { lines: [], totalQuantity: 0, subtotal: usd(0), placeholderPricing: false };

interface CartContextValue {
  cart: Cart;
  ready: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  /** Increments on every add, so the cart button can "bump". */
  addCount: number;
  add: (input: CartLineInput | CartLineInput[], opts?: { openDrawer?: boolean }) => Promise<void>;
  update: (lineId: string, quantity: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
  checkout: () => Promise<CheckoutResult>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Server render and hydration both start from an empty cart; the saved cart
  // loads right after hydration, so there is never a hydration mismatch.
  const [cart, setCart] = useState<Cart>(EMPTY);
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [addCount, setAddCount] = useState(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    const load = () =>
      commerce
        .getCart()
        .then((c) => {
          if (!alive.current) return;
          setCart(c);
          setReady(true);
        })
        .catch(() => alive.current && setReady(true));
    load();
    const unsub = commerce.subscribe?.(load);
    return () => {
      alive.current = false;
      unsub?.();
    };
  }, []);

  const add = useCallback<CartContextValue["add"]>(async (input, opts) => {
    const next = await commerce.addLines(Array.isArray(input) ? input : [input]);
    setCart(next);
    setAddCount((n) => n + 1);
    if (opts?.openDrawer !== false) setOpen(true);
  }, []);

  const update = useCallback(async (lineId: string, quantity: number) => {
    setCart(await commerce.updateLine(lineId, quantity));
  }, []);

  const remove = useCallback(async (lineId: string) => {
    setCart(await commerce.removeLine(lineId));
  }, []);

  const checkout = useCallback(() => commerce.checkout(), []);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ cart, ready, isOpen, open, close, addCount, add, update, remove, checkout }),
    [cart, ready, isOpen, open, close, addCount, add, update, remove, checkout],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
