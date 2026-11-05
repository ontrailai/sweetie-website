# Sweet Bee Honey — website

Raw local honey from San Diego County. *Feel the hum.*

Next.js (App Router) + TypeScript. **Redesign v2** (`feat/redesign-v2`):
an editorial, streetwear-meets-candy "drop" site with viewport-filling
kinetic type, full-bleed palette colour-blocking, photoreal jar packshots, a pinned
six-jar sequence and an interactive batch/hive explorer. It deploys to Vercel
with zero config, but **has not been deployed**.

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4; tokens + global layer in `app/globals.css` |
| Motion | `motion` (scroll-linked values, springs, layout), `lenis` (smooth scroll), CSS keyframes |
| Jars | Photoreal packshot cutouts via `next/image` (WebP + PNG, 1x/2x, built by `scripts/jar-assets/`) |
| Fonts | `next/font/google` (self-hosted at build): Fraunces (display), Courier Prime (body) |
| Commerce | Client-side cart behind a `CommerceAdapter` interface (Shopify-ready) |

## Libraries added in v2

| Package | Version | Why |
|---|---|---|
| `lenis` | 1.3.27 | Smooth wheel scrolling on desktop (never on touch, never with motion off) |

Considered and skipped: `three` (the WebGL jar was replaced by the
photoreal packshots, so it was removed) and `gsap`
(pinning is CSS `position: sticky` + `motion`'s `useScroll`, so one
animation library covers everything). All versions are pinned exactly.

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
| `/` | Hero ("Feel the hum." around the open No. 01 jar mid-pour with its lid floating free, a bee flying laps around it, sound rings) → velocity marquees → scroll-lit manifesto → **pinned six-jar sequence** (each jar irises open in its colour, honey rises, specks pop in, quick-add flies to the cart) → Discovery Set drop → sunrise-to-golden-hour sky (gradient shifts with scroll) → rotary subscription dial → hive-map teaser → community wall → signup |
| `/shop` | Giant headline, sticker filter pills, full-colour JarCards (3D tilt + quick-add with size), Discovery Set, size line-up, subscribe band |
| `/shop/[slug]` | Full-colour takeover in the jar's label colour: name, the jar photo (drag to swing it, mouse lean, glass sheen), specks, buy box ticket, day arc of uses, batch ticket + map pin, details, cross-sells, mobile quick-add bar |
| `/batches` | "Scan your jar" (manual entry, `?batch=` deep link, camera scan via `BarcodeDetector` where supported), how to read your jar, interactive hive map, batches on shelves, past batches, sourcing |
| `/about` | "Honey that hums." (breathing variable font), jar line-up, value bands, founders' note, Honey 101 (`#honey-101`), FAQ (`#faq`) |
| `/find-us` | Ladybug hero, market board, county map with market pins, stockists, community |
| 404 | `app/not-found.tsx`, "Lost the hum." (rolling-lid zero, tipped jar) |

Also: `/opengraph-image` and `/shop/[slug]/opengraph-image`, `/sitemap.xml`,
`/robots.txt`, `/icon.svg`.

## Where things live

```
app/                       routes, layout, globals.css (tokens, kinetic type, pinning, motion-off rules), fonts.ts
components/
  motion/                  MotionPreference (+ boot script), MotionToggle, SmoothScroll (Lenis), RevealObserver,
                           SplitText, VelocityMarquee, Magnetic, CustomCursor, capability.ts
  fx/                      CartFx (fly-to-cart + splash + toast), fly.ts, useQuickAdd, HumBee, hum-audio + HumToggle,
                           tilt.ts + TiltButton, HoneyDrip, Sticker
  jar/                     JarPhoto (the packshot everywhere), Jar (SVG, only if a product has no photo), MiniJar (icons), JarParticles, specks, jar-art
  home/                    Hero, MarqueeBands, Manifesto, JarSequence, DiscoveryDrop, SkyRituals, SubscriptionDial, TraceTeaser
  product/                 BuyBox, ProductJar, JarCard, DayArc, ShopFilter, SizeGuide, SizeChips
  batches/                 BatchScanner, HiveLocator, CountyMap, BatchShelf, PastBatches, BatchDetails
  cart/ layout/ sections/ forms/ ui/ brand/
lib/                       catalog.ts, site.ts, commerce/ (unchanged data/commerce layer), hooks/, og/
```

## Motion, fallbacks and accessibility

**One switch.** Motion is on unless the OS asks for reduced motion; the
**Pause motion** toggle (header, footer, mobile menu) overrides it and is
saved in `localStorage` (`sweetbee.motion`). An inline script sets
`<html data-motion="on|off">` before first paint; `useMotionPref()` exposes
the same value to React. Everything keys off it. Pausing also stops
JavaScript motion that is already running: Motion transitions go through
`useCalmTransition()` (instant when calm, because `MotionConfig.reducedMotion`
is only read when an element mounts), fly-to-cart WAAPI animations are
tracked and cancelled, and the product jar's spring/inertia stops and snaps
to a label panel.

| Feature | Motion on | Motion off / reduced |
|---|---|---|
| Smooth scroll | Lenis (fine pointers only; touch stays native) | Native scroll, Lenis destroyed |
| Six-jar sequence | Pinned (CSS sticky `.seq-pin`, only ≥1024px) with iris reveals; hidden panels `inert`; the rail lives inside the pinned wrapper so it stays on screen for the whole sequence | Calm vertical stack (desktop) or swipe/snap track (phones) — no pinning, nothing inert |
| Sunrise sky | Pinned, gradient interpolated from scroll | Three static panels, each with its own sky |
| Hero jar | Jar breathes, lid bobs and tumbles, both drift with the mouse at different depths; scrolling away lifts the lid off and tips the jar | One still composition |
| Marquees, drips, specks, bee, letter reveals, buzz | Animated; the bee flies laps around the hero jar (behind it on the far side), banks and turns, mouse steers it, touch never does | `animation: none` globally; marquees static; bee perches on the lid |
| Cursor, magnetic buttons, tilt | On (fine pointer / phones); the cursor hides on any keypress | Off (cursor elements hidden, not frozen) |
| Fly-to-cart | Jar arcs to the cart (the Discovery Set flies as the cart line's fan of three jars), badge squishes, honey + confetti burst | No animation; the same live "added" toast is announced |

**Jar photos.** Every jar shoppers see is a photoreal packshot cutout
(`components/jar/JarPhoto.tsx`, `next/image`), mapped from product slug in
`lib/jarAssets.ts`. The files in `public/jars/` (WebP for `next/image`, PNG
fallbacks, 1x/2x, a tiny transparent placeholder each) are generated from
the master PNGs by `node scripts/jar-assets/build.mjs [mastersDir]` (macOS:
the cutout mask is Apple Vision, on-device; edges are colour-decontaminated
against the studio backdrop; all six share one canvas so rows line up). The
two Wildflower masters were shot with different label layouts, so the build
first composites the sealed jar's label art onto the open-pour jar
(`scripts/jar-assets/relabel.mjs`: a local warp of the supplied pixels,
re-lit to the hero's own paper and ink, inside the hero label's edges). The
hero then splits the open-pour shot into jar + pour and a separate lid, and
continues the ribbon upward along the pour's own flare (a small extra layer,
then its top row stretched), so the pour falls from above the fold on
desktop and fades in just under the headline below `lg`. Masters never ship; jars below the fold are lazy, the hero and
product jar load eagerly with high priority. The SVG `Jar` remains only as
a fallback for a product without a photo, `MiniJar` for icon-sized jars,
and `lib/og` for share images.

**Sound.** The hive hum (WebAudio) is **off by default**, only starts from
a labelled button press (`aria-pressed`), and fades out when turned off.

**Device tilt.** Android starts listening automatically (motion on, coarse
pointer); iOS shows a "Tilt your phone" button because
`DeviceOrientationEvent.requestPermission()` must come from a tap.

**Accessibility.** Skip link; focus rings scoped to the surface they sit
on (`--focus` is reset by `.on-dark`, `.ticket`, `.chip`), plus a two-tone
`.ring-duo` (Canvas band + Nero outline) for controls that float over
changing colours: the header, map pins and dial options. Dialogs
(cart, menu) trap focus, close on Esc, lock scroll (and stop Lenis) and
return focus. Kinetic headings keep a real sr-only sentence (letters are
`aria-hidden`); decorative motion is `aria-hidden`. The jar sequence is a
labelled carousel with a button rail and a live "Showing No. 04…" message;
the product jar is a `role="slider"` (arrow keys turn it); map pins are real
buttons with a parallel button list. Contrast rule used throughout: small
text only on Canvas/Nero/Forest (or on a Canvas `.chip` / `.ticket` when it
sits on Peacock, Jade or Ladybug); bright panels carry ≥24px type only; jar
numbers on map pins and the jar rail sit on a Canvas/Nero badge inside the
jar-colour ring. Honey ambers appear only as honey; landscapes, suns and
interface use the six brand colours. The custom cursor hides on keyboard
use and over text fields, so it never covers a focus ring.

## Placeholder content (read before launch)

Prices, the subscribe-and-save discount, subscription frequencies and every
batch record are **placeholders**. They live in `lib/catalog.ts` (marked
`// TODO`) and always render with a visible *Placeholder* / *TBD* tag.
Markets, stockists, quotes, the founders' note, the Instagram handle and the
contact email are `null` in `lib/site.ts` and render as dashed-outline
placeholders until filled in. Search the code for `TODO(` to find them all.

## Swapping in the real fonts

The brand fonts are Perfectly Nineties (headings) and Courier Std (body).
The redesign uses **Fraunces** (variable: `wght`, `opsz`, `SOFT`, `WONK`) as
the display stand-in because the kinetic type animates its axes, and
Courier Prime for body. Drop the licensed files into `app/fonts/` and replace
the loaders in `app/fonts.ts` with `next/font/local`, **keeping the same
`variable` names** (`--font-heading`, `--font-body`). A static font simply
ignores the variation axes (headlines stop "breathing", nothing breaks).

## Adding the logo and photos

- **Logo:** put the files in `public/brand/` and set `SITE.assets.logo` and
  `SITE.assets.logoOnDark` in `lib/site.ts`. `<Wordmark>` switches from the
  typographic wordmark to the image automatically.
- **Product photos:** put them in `public/images/products/<slug>/` and add
  `{ src, alt }` entries to that product's `photos` array in
  `lib/catalog.ts`. A photo strip appears on the product page under the
  hero (`next/image`); with no photos the page is fully illustrated.
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
- Replace the decorative QR pattern with a real QR code to `/batches?batch=<code>` (the scanner and deep link already read that)
- Real (privacy-safe) hive areas for the map pins (`PIN_POS` in `components/batches/CountyMap.tsx`) and market pins (`MARKET_PINS` in `app/find-us/page.tsx`)
