/**
 * Sweet Bee catalog — the ONE source of truth for products, sizes, prices,
 * the Discovery Set, the subscription box and batches.
 *
 * ⚠️  PLACEHOLDER DATA
 * Every price, discount, subscription frequency and batch record below is a
 * placeholder. They exist so the UI and cart math work end-to-end, and they
 * are always rendered with a visible "placeholder"/"TBD" flag. Replace them
 * with real values (or with Shopify data, see lib/commerce) before launch.
 */

export type SpeckKind = "none" | "vanilla" | "cinnamon" | "pollen" | "salt";
export type SizeId = "6oz" | "16oz" | "32oz";
export type Category = "Everyday" | "Infused" | "Wellness" | "Energy";

/** Integer cents, so cart math never touches floating point. */
export interface Money {
  amount: number;
  currencyCode: "USD";
}

export interface Price {
  money: Money;
  /** true until a real price is confirmed. The UI flags these visibly. */
  placeholder: boolean;
}

export interface JarLook {
  labelColor: string;
  /** Optional: derived from labelColor when omitted. */
  labelText?: string;
  honey: string;
  honeyDark: string;
  specks: SpeckKind;
}

export interface Size {
  id: SizeId;
  label: string;
  ounces: number;
}

export interface Variant {
  /** Stable merchandise id used by the cart (e.g. "wildflower-16oz"). */
  id: string;
  size: SizeId;
  price: Price;
  /** TODO(shopify): fill with gid://shopify/ProductVariant/… when wiring Shopify. */
  shopifyVariantId?: string;
}

export interface Ritual {
  time: string;
  title: string;
  body: string;
}

export interface Photo {
  /** Path under /public, e.g. "/images/products/wildflower/spoon.jpg". */
  src: string;
  alt: string;
}

export interface Product {
  slug: string;
  number: string;
  name: string;
  /** Heading split for the italic flourish: <lead><em>{em}</em>. */
  display: { lead: string; em: string };
  descriptor: string;
  category: Category;
  tagline: string;
  bestAt: { time: string; moment: string };
  description: string;
  tastingNotes: string;
  ingredients: string;
  goodToKnow: string[];
  jar: JarLook;
  variants: Variant[];
  uses: Ritual[];
  pairsWith: string[];
  /** Real photography drops in here later; placeholders render until then. */
  photos: Photo[];
}

export const SIZES: Size[] = [
  { id: "6oz", label: "6 oz", ounces: 6 },
  { id: "16oz", label: "16 oz", ounces: 16 },
  { id: "32oz", label: "32 oz", ounces: 32 },
];

export const DEFAULT_SIZE: SizeId = "16oz";

export const usd = (cents: number): Money => ({ amount: cents, currencyCode: "USD" });

// TODO(pricing): placeholder prices — NOT real. Replace before launch.
const PLACEHOLDER_PRICES: Record<SizeId, number> = {
  "6oz": 1200,
  "16oz": 2400,
  "32oz": 4200,
};

// TODO(pricing): placeholder subscribe-and-save discount — NOT real.
export const SUBSCRIPTION = {
  discountPercent: 10,
  discountIsPlaceholder: true,
  // TODO(subscription): confirm real delivery frequencies.
  frequencies: ["Every 2 weeks", "Every 4 weeks", "Every 6 weeks"],
  frequenciesArePlaceholder: true,
  defaultFrequency: "Every 4 weeks",
  // TODO(subscription): what's inside each box.
  inside: null as string | null,
  flexible: "Pause, skip, swap or cancel anytime",
} as const;

function variantsFor(slug: string): Variant[] {
  return SIZES.map((s) => ({
    id: `${slug}-${s.id}`,
    size: s.id,
    price: { money: usd(PLACEHOLDER_PRICES[s.id]), placeholder: true },
  }));
}

const BABY_NOTE = "Not for infants under 12 months.";

// TODO(copy): tasting notes and descriptions are draft copy — confirm with the beekeepers.
export const PRODUCTS: Product[] = [
  {
    slug: "wildflower",
    number: "01",
    name: "Wildflower",
    display: { lead: "Wild", em: "flower." },
    descriptor: "Raw wildflower honey",
    category: "Everyday",
    tagline: "Your everyday jar.",
    bestAt: { time: "6 AM", moment: "the sunrise spoonful" },
    description:
      "Raw wildflower honey from San Diego County beekeepers. Whatever was blooming on the hillsides that season, in a jar.",
    tastingNotes:
      "Bright, floral and easygoing, with a flavor that shifts a little from harvest to harvest as the blooms change.",
    ingredients: "Raw wildflower honey. That is it.",
    goodToKnow: [BABY_NOTE],
    jar: { labelColor: "#FF007C", labelText: "#F6EDDD", honey: "#D9921E", honeyDark: "#7E4006", specks: "none" },
    variants: variantsFor("wildflower"),
    uses: [
      { time: "6 AM", title: "The sunrise spoonful", body: "Straight off the spoon before the surf check." },
      { time: "9 AM", title: "Cold brew, sweetened", body: "Stirred in on your way out the door." },
      { time: "6 PM", title: "Golden hour", body: "Over something warm as the sun drops." },
    ],
    pairsWith: ["vanilla-bean", "guarana-salt", "bee-pollen"],
    photos: [],
  },
  {
    slug: "avocado-blossom",
    number: "02",
    name: "Avocado Blossom",
    display: { lead: "Avocado ", em: "Blossom." },
    descriptor: "Raw avocado blossom honey",
    category: "Everyday",
    tagline: "Our darkest jar.",
    bestAt: { time: "6 AM", moment: "stirred into cold brew" },
    description:
      "Raw honey from bees working the avocado groves of San Diego County. Dark, rich and nothing like the honey bear.",
    tastingNotes: "Deep and molasses-dark, with a toasty, almost caramel finish.",
    ingredients: "Raw avocado blossom honey. That is it.",
    goodToKnow: [BABY_NOTE],
    jar: { labelColor: "#308F32", labelText: "#F6EDDD", honey: "#6E3510", honeyDark: "#2A1004", specks: "none" },
    variants: variantsFor("avocado-blossom"),
    uses: [
      { time: "6 AM", title: "Cold brew, upgraded", body: "A dark spoonful melted into the first cup." },
      { time: "12 PM", title: "On the toast", body: "Over salted butter on thick sourdough." },
      { time: "8 PM", title: "With the cheese board", body: "Drizzled over something sharp and aged." },
    ],
    pairsWith: ["wildflower", "cinnamon", "guarana-salt"],
    photos: [],
  },
  {
    slug: "vanilla-bean",
    number: "03",
    name: "Vanilla Bean",
    display: { lead: "Vanilla ", em: "Bean." },
    descriptor: "Raw honey + vanilla bean",
    category: "Infused",
    tagline: "Golden hour, in a jar.",
    bestAt: { time: "6 PM", moment: "golden hour" },
    description:
      "Raw San Diego County honey infused with real vanilla bean. You can see the seeds suspended in every spoonful.",
    tastingNotes: "Soft, creamy vanilla over a mellow honey base. Dessert without trying.",
    ingredients: "Raw honey, vanilla bean.",
    goodToKnow: [BABY_NOTE],
    jar: { labelColor: "#F6EDDD", labelText: "#262626", honey: "#E2A43A", honeyDark: "#93590E", specks: "vanilla" },
    variants: variantsFor("vanilla-bean"),
    uses: [
      { time: "7 AM", title: "Over the yogurt", body: "A slow ribbon over yogurt and fruit." },
      { time: "3 PM", title: "Iced latte", body: "Shaken into milk and espresso." },
      { time: "6 PM", title: "Golden hour", body: "Stirred into something warm as the sun drops." },
    ],
    pairsWith: ["cinnamon", "wildflower", "bee-pollen"],
    photos: [],
  },
  {
    slug: "cinnamon",
    number: "04",
    name: "Cinnamon",
    display: { lead: "Cinna", em: "mon." },
    descriptor: "Raw honey + cinnamon",
    category: "Infused",
    tagline: "Warm and spiced.",
    bestAt: { time: "6 PM", moment: "golden hour" },
    description: "Raw San Diego County honey with cinnamon folded through. Warm, spiced, a little cozy.",
    tastingNotes: "Sweet heat up front, honey-smooth at the end.",
    ingredients: "Raw honey, cinnamon.",
    goodToKnow: [BABY_NOTE],
    jar: { labelColor: "#262626", labelText: "#F6EDDD", honey: "#B9661A", honeyDark: "#5E2A05", specks: "cinnamon" },
    variants: variantsFor("cinnamon"),
    uses: [
      { time: "7 AM", title: "Oats, sorted", body: "Swirled into a bowl of oats or granola." },
      { time: "10 AM", title: "On the toast", body: "Over butter, like a shortcut cinnamon roll." },
      { time: "6 PM", title: "Golden hour", body: "Stirred into tea or a hot toddy as the sun drops." },
    ],
    pairsWith: ["vanilla-bean", "avocado-blossom", "wildflower"],
    photos: [],
  },
  {
    slug: "bee-pollen",
    number: "05",
    name: "Bee Pollen",
    display: { lead: "Bee ", em: "Pollen." },
    descriptor: "Raw honey + bee pollen",
    category: "Wellness",
    tagline: "Sunshine on a spoon.",
    bestAt: { time: "6 AM", moment: "the sunrise spoonful" },
    description:
      "Raw San Diego County honey with golden bee pollen granules stirred in. A little crunch, a lot of color.",
    tastingNotes: "Floral and sunny, with a gentle, grassy crunch from the pollen.",
    ingredients: "Raw honey, bee pollen.",
    goodToKnow: [BABY_NOTE, "Contains bee pollen. Skip it if you are allergic to pollen or bee products."],
    jar: { labelColor: "#004832", labelText: "#F6EDDD", honey: "#E6A52A", honeyDark: "#9C620C", specks: "pollen" },
    variants: variantsFor("bee-pollen"),
    uses: [
      { time: "6 AM", title: "The sunrise spoonful", body: "One spoonful, straight up, before the day starts." },
      { time: "8 AM", title: "Smoothie bowl", body: "Drizzled on top for crunch and color." },
      { time: "2 PM", title: "Afternoon lift", body: "Over sliced apples or a rice cake." },
    ],
    pairsWith: ["wildflower", "guarana-salt", "vanilla-bean"],
    photos: [],
  },
  {
    slug: "guarana-salt",
    number: "06",
    name: "Guarana + Salt",
    display: { lead: "Guarana ", em: "+ Salt." },
    descriptor: "Raw honey + guarana + salt",
    category: "Energy",
    tagline: "Turn it up.",
    bestAt: { time: "9 AM", moment: "before the paddle out" },
    description:
      "Raw San Diego County honey with guarana and a pinch of salt. Built for the paddle out, the bluff run, the long beach walk.",
    tastingNotes: "Bold and bright, with a salty snap that keeps it from being too sweet.",
    ingredients: "Raw honey, guarana, salt.",
    goodToKnow: [
      BABY_NOTE,
      "Contains guarana, a natural source of caffeine. Not recommended for children or anyone sensitive to caffeine.",
    ],
    jar: { labelColor: "#FF0000", labelText: "#F6EDDD", honey: "#C9781C", honeyDark: "#723A06", specks: "salt" },
    variants: variantsFor("guarana-salt"),
    uses: [
      { time: "6 AM", title: "Dawn patrol", body: "A spoonful on the drive to the break." },
      { time: "9 AM", title: "Before the paddle out", body: "Comes along for the paddle out, the bluff run, the long beach walk." },
      { time: "2 PM", title: "The afternoon slump", body: "Instead of the third coffee." },
    ],
    pairsWith: ["bee-pollen", "wildflower", "avocado-blossom"],
    photos: [],
  },
];

export const CATEGORIES: Category[] = ["Everyday", "Infused", "Wellness", "Energy"];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductByNumber(number: string): Product | undefined {
  return PRODUCTS.find((p) => p.number === number);
}

export function getVariant(product: Product, size: SizeId): Variant {
  const v = product.variants.find((x) => x.size === size);
  if (!v) throw new Error(`No ${size} variant for ${product.slug}`);
  return v;
}

export function fromPrice(product: Product): Price {
  return product.variants.reduce((min, v) => (v.price.money.amount < min.money.amount ? v.price : min), product.variants[0]!.price);
}

export function subscriberPrice(price: Price): Price {
  return {
    money: usd(Math.round(price.money.amount * (1 - SUBSCRIPTION.discountPercent / 100))),
    placeholder: price.placeholder || SUBSCRIPTION.discountIsPlaceholder,
  };
}

/* ------------------------------------------------------------------ */
/* Discovery Set                                                       */
/* ------------------------------------------------------------------ */

export const DISCOVERY_SET = {
  id: "discovery-set",
  name: "Discovery Set",
  eyebrow: "New here? Start here.",
  description:
    "No. 01 to No. 06 in 6 oz jars, in one box. A first taste, a gift, or the easiest way to find your favorite before you subscribe.",
  // TODO(pricing): placeholder set price — NOT real.
  price: { money: usd(6000), placeholder: true } satisfies Price,
  contents: PRODUCTS.map((p) => p.slug),
  shopifyVariantId: undefined as string | undefined,
};

/* ------------------------------------------------------------------ */
/* Batches                                                             */
/* ------------------------------------------------------------------ */

export type BatchStatus = "on-shelves" | "past";

export interface Batch {
  /** TODO(batches): placeholder batch codes — NOT real batch numbers. */
  code: string;
  productSlug: string;
  /** e.g. "Wildflower" for infused jars. null = TBD. */
  baseHoney: string | null;
  /** Beekeeper area within San Diego County. null = TBD. */
  area: string | null;
  /** e.g. "Spring 2026". null = TBD. */
  harvest: string | null;
  status: BatchStatus;
  placeholder: boolean;
}

/** How the batch "Honey" line reads for each jar. */
export function batchHoneyLabel(batch: Batch): { base: string | null; addition: string | null } {
  const product = getProduct(batch.productSlug);
  if (!product) return { base: batch.baseHoney, addition: null };
  if (product.category === "Everyday") return { base: batch.baseHoney ?? product.name, addition: null };
  const addition = product.descriptor.replace(/^Raw honey \+ /, "");
  return { base: batch.baseHoney, addition };
}

// TODO(batches): every record below is a placeholder until real batches are logged.
export const BATCHES: Batch[] = [
  ...PRODUCTS.map<Batch>((p) => ({
    code: `SB-${p.number}-C`,
    productSlug: p.slug,
    baseHoney: null,
    area: null,
    harvest: null,
    status: "on-shelves",
    placeholder: true,
  })),
  ...(
    [
      ["SB-01-B", "wildflower"],
      ["SB-02-B", "avocado-blossom"],
      ["SB-05-B", "bee-pollen"],
      ["SB-01-A", "wildflower"],
      ["SB-03-B", "vanilla-bean"],
      ["SB-06-B", "guarana-salt"],
      ["SB-04-A", "cinnamon"],
      ["SB-02-A", "avocado-blossom"],
    ] as const
  ).map<Batch>(([code, slug]) => ({
    code,
    productSlug: slug,
    baseHoney: null,
    area: null,
    harvest: null,
    status: "past",
    placeholder: true,
  })),
];

export function normalizeBatchCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function findBatch(query: string): Batch | undefined {
  const q = normalizeBatchCode(query);
  if (!q) return undefined;
  return BATCHES.find((b) => normalizeBatchCode(b.code) === q) ?? BATCHES.find((b) => normalizeBatchCode(b.code).endsWith(q));
}

export function currentBatchFor(slug: string): Batch | undefined {
  return BATCHES.find((b) => b.productSlug === slug && b.status === "on-shelves");
}
