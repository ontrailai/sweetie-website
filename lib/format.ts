import type { Money } from "./catalog";

const formatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(money: Money): string {
  let f = formatters.get(money.currencyCode);
  if (!f) {
    f = new Intl.NumberFormat("en-US", { style: "currency", currency: money.currencyCode });
    formatters.set(money.currencyCode, f);
  }
  return f.format(money.amount / 100);
}
