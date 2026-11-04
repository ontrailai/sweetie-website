import { localAdapter } from "./local-adapter";
import { shopifyAdapter } from "./shopify-adapter";
import type { CommerceAdapter } from "./types";

export type * from "./types";
export { MAX_LINE_QUANTITY } from "./types";

/** The single place that decides which commerce backend the site uses. */
export const commerce: CommerceAdapter =
  process.env.NEXT_PUBLIC_COMMERCE_PROVIDER === "shopify" ? shopifyAdapter : localAdapter;
