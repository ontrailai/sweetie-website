/**
 * Commerce interface. The UI only ever talks to a `CommerceAdapter`, so the
 * local (localStorage) adapter can be swapped for a Shopify Storefront
 * adapter without touching components. See README → "Plugging in Shopify".
 */
import type { JarLook, Money } from "../catalog";

export type Purchase = { mode: "one-time" } | { mode: "subscribe"; frequency: string };

export interface CartLineInput {
  /** Variant / merchandise id, e.g. "wildflower-16oz" or "discovery-set". */
  merchandiseId: string;
  quantity: number;
  purchase: Purchase;
}

export interface CartLine {
  id: string;
  merchandiseId: string;
  title: string;
  /** e.g. "No. 01 · 16 oz" */
  subtitle: string;
  href: string | null;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
  purchase: Purchase;
  /** Used to draw the mini jar in the cart. */
  jar: (JarLook & { slug: string; number: string; name: string; descriptor: string }) | null;
  placeholderPrice: boolean;
}

export interface Cart {
  lines: CartLine[];
  totalQuantity: number;
  subtotal: Money;
  /** true if any line uses a placeholder price. */
  placeholderPricing: boolean;
}

export type CheckoutResult =
  | { kind: "redirect"; url: string }
  | { kind: "unavailable"; reason: string };

export interface CommerceAdapter {
  readonly name: string;
  getCart(): Promise<Cart>;
  addLines(lines: CartLineInput[]): Promise<Cart>;
  updateLine(lineId: string, quantity: number): Promise<Cart>;
  removeLine(lineId: string): Promise<Cart>;
  clear(): Promise<Cart>;
  checkout(): Promise<CheckoutResult>;
  /** Optional: notify when the cart changes elsewhere (e.g. another tab). */
  subscribe?(onChange: () => void): () => void;
}

export const MAX_LINE_QUANTITY = 24;
