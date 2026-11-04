/**
 * Site-wide config and non-catalog content (markets, stockists, community).
 * Anything set to null renders as a visible "TBD" placeholder in the UI.
 */

export const SITE = {
  name: "Sweet Bee",
  legalName: "Sweet Bee Honey",
  tagline: "Feel the hum.",
  description:
    "Raw, small-batch honey from San Diego County beekeepers. Six jars, three sizes, traceable to the hive. Zero sleepy honey.",
  // TODO(launch): set NEXT_PUBLIC_SITE_URL in Vercel to the real domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  instagram: {
    // TODO(social): real handle + URL.
    handle: null as string | null,
    url: null as string | null,
  },
  hashtag: "#FeelTheHum",
  // TODO(contact): real contact email for wholesale / stockist inquiries.
  email: null as string | null,
  /**
   * Brand assets. Drop files into /public/brand and set the paths here;
   * the typographic wordmark is used until then.
   */
  assets: {
    logo: null as string | null, // e.g. "/brand/sweetbee-logo.svg"
    logoOnDark: null as string | null, // e.g. "/brand/sweetbee-logo-canvas.svg"
  },
} as const;

export interface NavLink {
  href: string;
  label: string;
}

export const NAV: NavLink[] = [
  { href: "/shop", label: "Shop" },
  { href: "/#subscribe", label: "Subscribe" },
  { href: "/batches", label: "Batches" },
  { href: "/find-us", label: "Find us" },
  { href: "/about", label: "About" },
];

export const FOOTER_NAV: NavLink[] = [
  ...NAV,
  { href: "/about#honey-101", label: "Honey 101" },
  { href: "/about#faq", label: "FAQ" },
];

export interface Market {
  day: string | null;
  name: string | null;
  neighborhood: string | null;
  time: string | null;
}

// TODO(markets): placeholder market schedule.
export const MARKETS: Market[] = [
  { day: null, name: null, neighborhood: null, time: null },
  { day: null, name: null, neighborhood: null, time: null },
  { day: null, name: null, neighborhood: null, time: null },
];

export interface Stockist {
  name: string | null;
  neighborhood: string | null;
  carries: string | null;
}

// TODO(stockists): placeholder stockists.
export const STOCKISTS: Stockist[] = [
  { name: null, neighborhood: null, carries: null },
  { name: null, neighborhood: null, carries: null },
  { name: null, neighborhood: null, carries: null },
];

export interface Quote {
  quote: string | null;
  name: string | null;
  jar: string | null;
}

// TODO(community): real customer quotes, in their words.
export const QUOTES: Quote[] = [
  { quote: null, name: null, jar: null },
  { quote: null, name: null, jar: null },
  { quote: null, name: null, jar: null },
];

// TODO(about): a short note from the two founders, and their names.
export const FOUNDERS_NOTE = {
  note: null as string | null,
  names: null as string | null,
};
