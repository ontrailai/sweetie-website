"use client";

import { useCallback } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { CartLineInput } from "@/lib/commerce";
import { flyToCart, type FlyLook } from "./fly";

/** Add to cart with the fly-to-cart micro-interaction (no drawer by default). */
export function useQuickAdd() {
  const { add, open } = useCart();
  return useCallback(
    async (input: CartLineInput, opts: { source: Element | null; look: FlyLook; label: string; openDrawer?: boolean }) => {
      await add(input, { openDrawer: false });
      flyToCart(opts.source, opts.look, opts.label);
      if (opts.openDrawer) {
        const calm = document.documentElement.dataset.motion === "off";
        setTimeout(open, calm ? 0 : 900);
      }
    },
    [add, open],
  );
}
