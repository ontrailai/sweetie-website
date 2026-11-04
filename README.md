# Sweet Bee Honey — website

Raw local honey from San Diego County. *Feel the hum.*

A Next.js (App Router) + TypeScript site built from the design canvas in
[`mockup/`](./mockup) (read-only design source; see `BUILD_BRIEF.md`). It
deploys to Vercel with zero config, but **has not been deployed**.

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4: brand tokens live in `app/globals.css` (`@theme`) |
| Motion | [`motion`](https://motion.dev) (Framer Motion) + CSS keyframes |
| Fonts | `next/font/google`: Instrument Serif (headings), Courier Prime (body) |
| Commerce | Client-side cart behind a `CommerceAdapter` interface (Shopify-ready) |

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all routes are static)
npm run start      # serve the production build
npm run lint       # ESLint (flat config, next/core-web-vitals + TS)
npm run typecheck  # tsc --noEmit
```

Node 20.9+ is required (Next 16).

## Routes

| Route | What |
|---|---|
| `/` | Homepage: hero with the rotating jar, selling points, marquee, six-jar grid, Discovery Set, rituals, subscription, markets & community, email signup |
| `/shop` | All six jars with a category filter, Discovery Set, size guide |
| `/shop/[slug]` | Product page per jar (static via `generateStaticParams`): turnable jar, buy box (size, subscribe/one-time, quantity, live price), ways to use, this batch, details, cross-sells, mobile quick-add bar |
| `/batches` | Batch finder, how to read your jar, batches on shelves (filterable), past batches, sourcing |
| `/about` | Story, values, founders' note, Honey 101 (`#honey-101`), FAQ (`#faq`) |
| `/find-us` | Markets, illustrated coast map, stockists, community |
| 404 | `app/not-found.tsx`, "Lost the hum." |

Also: `/opengraph-image` and `/shop/[slug]/opengraph-image` (generated OG
images), `/sitemap.xml`, `/robots.txt`, `/icon.svg`.

## Where things live

```
app/                    routes, layout, globals.css (tokens + keyframes), fonts.ts
components/
  jar/Jar.tsx           the parametric SVG jar (see below)
  jar/TurnableJar.tsx   drag / arrow-key "turn the jar" slider (product page)
  home/Hero.tsx         homepage hero (autoplay ring, pointer tilt, spin-in)
  cart/                 CartProvider (context), CartDrawer, CartButton
  motion/               MotionPreference (toggle + reduced motion), Reveal, Marquee
  layout/               Header, MobileMenu, Footer, PageTransition
  product/ batches/ sections/ forms/ ui/ brand/
lib/
  catalog.ts            ★ ONE typed module for products, prices, sizes, Discovery Set, subscription, batches
  site.ts               site config, nav, markets, stockists, quotes, founders' note
  commerce/             types.ts (interface), local-adapter.ts, shopify-adapter.ts (stub), index.ts
  hooks/                useFocusTrap, useScrollLock
  og/                   fonts + simplified jar for generated OG images
mockup/                 design source — do not edit
```

### The jar

`<Jar number name descriptor labelColor labelText? honey honeyDark specks />`
mirrors the parameters of `mockup/Jar.dc.html` (specks: `none | vanilla |
cinnamon | pollen | salt`). The label is a wrap-around strip (front, "Feel the
hum." side, small-batch side), so passing a `spin` MotionValue turns the jar
(300 units = one full turn). With `alive` on, the honey shimmers, specks drift
and bubbles rise. Everything is seeded and deterministic, so server and client
renders match.

### Motion & accessibility

- Motion is on unless the OS asks for reduced motion. The **Pause motion**
  toggle (header, hero, footer, mobile menu) overrides that and is saved in
  `localStorage` (`sweetbee.motion`). An inline script applies it to
  `<html data-motion>` before first paint, which pauses every CSS loop and
  switches `motion` to reduced mode.
- Mobile menu and cart drawer: focus trap, Esc to close, body scroll lock,
  focus returned to the trigger.
- Skip link, visible focus rings (colour-aware per section), semantic
  landmarks, radio-group size pickers, slider semantics on the turnable jar.

## Placeholder content (read before launch)

Prices, the subscribe-and-save discount, subscription frequencies and every
batch record are **placeholders**. They live in `lib/catalog.ts` (marked
`// TODO`) and always render with a visible *Placeholder* / *TBD* tag.
Markets, stockists, quotes, the founders' note, the Instagram handle and the
contact email are `null` in `lib/site.ts` and render as dashed-outline
placeholders until filled in. Search the code for `TODO(` to find them all.

## Swapping in the real fonts

The brand fonts are Perfectly Nineties (headings) and Courier Std (body).
Drop the licensed files into `app/fonts/` and replace the two loaders in
`app/fonts.ts` with `next/font/local`, **keeping the same `variable` names**
(`--font-heading`, `--font-body`). Nothing else changes. There's a ready-made
example in the comment at the top of that file.

## Adding the logo and photos

- **Logo:** put the files in `public/brand/` and set `SITE.assets.logo` and
  `SITE.assets.logoOnDark` in `lib/site.ts`. `<Wordmark>` switches from the
  typographic wordmark to the image automatically.
- **Product photos:** put them in `public/images/products/<slug>/` and add
  `{ src, alt }` entries to that product's `photos` array in
  `lib/catalog.ts`. The gallery tiles switch from the illustrated
  placeholders to `next/image`.
- No external image URLs are used anywhere; keep it that way, or add the
  host to `images.remotePatterns` in `next.config.ts`.

## Plugging in Shopify

Components never talk to storage directly. They go through
`lib/commerce` → `CommerceAdapter`:

```ts
getCart(); addLines(lines); updateLine(id, qty); removeLine(id); clear(); checkout(); subscribe?(cb)
```

1. Create a Storefront API access token (Shopify admin → Headless).
2. Implement `lib/commerce/shopify-adapter.ts` with the Cart API
   (`cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`;
   persist the cart id in `localStorage`; subscriptions pass a
   `sellingPlanId`; `checkout()` returns `{ kind: "redirect", url: cart.checkoutUrl }`).
3. Map variants: set `shopifyVariantId` on each variant in `lib/catalog.ts`,
   or load the catalog from Shopify into the same `Product` type.
4. Set env vars: `NEXT_PUBLIC_COMMERCE_PROVIDER=shopify`,
   `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`.

Until then, the local adapter keeps the cart in `localStorage`
(`sweetbee.cart.v1`) and checkout shows a "coming soon" panel.

## Deploying (later)

Import the repo in Vercel; no config needed. Set `NEXT_PUBLIC_SITE_URL` to the
real domain (used for canonical URLs, OG images, sitemap and robots).

## Open TODOs

- Real prices, discount, subscription frequencies and box contents
- Real batch records (codes, beekeeper areas, harvests) and where the number sits on the jar
- Markets, stockists, Instagram handle, contact email, customer quotes, founders' note
- Shipping details
- Logo files, product and lifestyle photography, licensed fonts
- Confirm the draft tasting notes and "good to know" copy
- Email signup provider (form is UI-only), Shopify adapter
- Replace the decorative QR pattern with a real QR code to `/batches`
