/**
 * Shopify Storefront adapter — NOT IMPLEMENTED YET.
 *
 * This file documents the drop-in shape. To wire Shopify:
 *  1. Create a Storefront API token (Shopify admin → Apps → Headless).
 *  2. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN.
 *  3. Fill `shopifyVariantId` on each variant in lib/catalog.ts (or fetch the
 *     catalog from Shopify and map it into the same `Product` type).
 *  4. Implement the methods below with the Cart API:
 *       getCart     → query cart(id)            (cart id persisted in localStorage)
 *       addLines    → mutation cartLinesAdd     (subscriptions: pass sellingPlanId)
 *       updateLine  → mutation cartLinesUpdate
 *       removeLine  → mutation cartLinesRemove
 *       checkout    → { kind: "redirect", url: cart.checkoutUrl }
 *  5. Set NEXT_PUBLIC_COMMERCE_PROVIDER=shopify.
 */
import type { CommerceAdapter } from "./types";

const notReady = () => Promise.reject(new Error("Shopify adapter not implemented yet — see lib/commerce/shopify-adapter.ts"));

export const shopifyAdapter: CommerceAdapter = {
  name: "shopify",
  getCart: notReady,
  addLines: notReady,
  updateLine: notReady,
  removeLine: notReady,
  clear: notReady,
  checkout: notReady,
};
