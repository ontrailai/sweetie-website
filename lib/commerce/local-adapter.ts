/**
 * Client-only cart persisted to localStorage. Prices are always re-resolved
 * from the catalog on read, so stale prices never survive in storage.
 */
import { DISCOVERY_SET, PRODUCTS, SIZES, subscriberPrice, usd, type Price } from "../catalog";
import type { Cart, CartLine, CartLineInput, CommerceAdapter, Purchase } from "./types";
import { MAX_LINE_QUANTITY } from "./types";

const STORAGE_KEY = "sweetbee.cart.v1";

interface StoredLine {
  merchandiseId: string;
  quantity: number;
  purchase: Purchase;
}

interface Merchandise {
  title: string;
  subtitle: string;
  href: string | null;
  price: Price;
  jar: CartLine["jar"];
}

function resolveMerchandise(id: string): Merchandise | null {
  if (id === DISCOVERY_SET.id) {
    return { title: DISCOVERY_SET.name, subtitle: "Six 6 oz jars", href: "/shop#discovery", price: DISCOVERY_SET.price, jar: null };
  }
  for (const p of PRODUCTS) {
    const v = p.variants.find((x) => x.id === id);
    if (v) {
      const size = SIZES.find((s) => s.id === v.size);
      return {
        title: p.name,
        subtitle: `No. ${p.number} · ${size?.label ?? v.size}`,
        href: `/shop/${p.slug}`,
        price: v.price,
        jar: { ...p.jar, number: p.number, name: p.name, descriptor: p.descriptor },
      };
    }
  }
  return null;
}

function lineId(merchandiseId: string, purchase: Purchase): string {
  return purchase.mode === "subscribe" ? `${merchandiseId}::sub::${purchase.frequency}` : `${merchandiseId}::once`;
}

function isPurchase(x: unknown): x is Purchase {
  if (!x || typeof x !== "object") return false;
  const p = x as Record<string, unknown>;
  return p.mode === "one-time" || (p.mode === "subscribe" && typeof p.frequency === "string");
}

function read(): StoredLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is StoredLine =>
        !!l &&
        typeof l.merchandiseId === "string" &&
        Number.isInteger(l.quantity) &&
        l.quantity > 0 &&
        isPurchase(l.purchase) &&
        resolveMerchandise(l.merchandiseId) !== null,
    );
  } catch {
    return [];
  }
}

function write(lines: StoredLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* storage full or blocked: cart still works for this page view */
  }
}

function build(stored: StoredLine[]): Cart {
  const lines: CartLine[] = [];
  for (const s of stored) {
    const m = resolveMerchandise(s.merchandiseId);
    if (!m) continue;
    const price = s.purchase.mode === "subscribe" ? subscriberPrice(m.price) : m.price;
    lines.push({
      id: lineId(s.merchandiseId, s.purchase),
      merchandiseId: s.merchandiseId,
      title: m.title,
      subtitle: m.subtitle,
      href: m.href,
      quantity: s.quantity,
      unitPrice: price.money,
      lineTotal: usd(price.money.amount * s.quantity),
      purchase: s.purchase,
      jar: m.jar,
      placeholderPrice: price.placeholder,
    });
  }
  return {
    lines,
    totalQuantity: lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: usd(lines.reduce((n, l) => n + l.lineTotal.amount, 0)),
    placeholderPricing: lines.some((l) => l.placeholderPrice),
  };
}

const clamp = (q: number) => Math.max(0, Math.min(MAX_LINE_QUANTITY, Math.floor(q)));

export const localAdapter: CommerceAdapter = {
  name: "local",
  async getCart() {
    return build(read());
  },
  async addLines(inputs: CartLineInput[]) {
    const stored = read();
    for (const input of inputs) {
      if (!resolveMerchandise(input.merchandiseId)) continue;
      const id = lineId(input.merchandiseId, input.purchase);
      const existing = stored.find((s) => lineId(s.merchandiseId, s.purchase) === id);
      if (existing) existing.quantity = clamp(existing.quantity + input.quantity);
      else stored.push({ merchandiseId: input.merchandiseId, quantity: clamp(input.quantity), purchase: input.purchase });
    }
    const next = stored.filter((s) => s.quantity > 0);
    write(next);
    return build(next);
  },
  async updateLine(id: string, quantity: number) {
    const next = read()
      .map((s) => (lineId(s.merchandiseId, s.purchase) === id ? { ...s, quantity: clamp(quantity) } : s))
      .filter((s) => s.quantity > 0);
    write(next);
    return build(next);
  },
  async removeLine(id: string) {
    const next = read().filter((s) => lineId(s.merchandiseId, s.purchase) !== id);
    write(next);
    return build(next);
  },
  async clear() {
    write([]);
    return build([]);
  },
  async checkout() {
    // TODO(shopify): the Shopify adapter returns { kind: "redirect", url: cart.checkoutUrl }.
    return {
      kind: "unavailable",
      reason: "Secure checkout is on its way. Your cart is saved on this device until then.",
    };
  },
  subscribe(onChange) {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) onChange();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  },
};

