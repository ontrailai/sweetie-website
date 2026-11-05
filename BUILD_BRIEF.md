# Sweet Bee Honey — Website Build Brief

Sweet Bee Honey: raw local honey from San Diego County. Build the Sweet Bee Honey website as a production-quality Next.js site, ready for Vercel later (do NOT deploy). Ryan wants the most dynamic, clean, modern, pop website in the honey space, clearly different from the big honey brands.

## Design source of truth: `mockup/`
Claude design-canvas exports: `Main.dc.html` (homepage), `Product.dc.html` (Wildflower product page), `Batches.dc.html`, `Jar.dc.html` (a parameterised jar: number, name, descriptor, label colour, two honey colours, specks of none | vanilla | cinnamon | pollen | salt), phone wrappers (`Mobile.dc.html`, `ProductPhone.dc.html`, `BatchesPhone.dc.html`), `canvas.json`, and brand tokens in `mockup/ds/sweetbee/tokens.json`.
The mockups reference a missing support.js and use `{{}}` templating, and their images point to private Claude blob URLs — read them for design intent only. **Leave `mockup/` untouched.**

### Colours (keep EXACT)
Peacock #ff007c (signature), Jade #308f32, Forest #004832, Ladybug #ff0000, Canvas #f6eddd, Nero #262626.

### Fonts
Instrument Serif for headings (stand-in for Perfectly Nineties) and Courier Prime for body (stand-in for Courier Std), loaded with `next/font` so the real fonts are a one-line swap later. Follow the type hierarchy in tokens.json (heading tracking 0.025em, subheading tracking 0.2em uppercase, etc.).

Keep the mockups' sections, copy, voice and layout ideas — and push the polish, motion and interactivity far beyond them.

## Mockup contents
- **Homepage:** header (Shop, Subscribe, Batches, Find us, About, Cart); pink hero "Feel the hum." with a rotating jar and Shop/Subscribe buttons; four selling points (Raw & unprocessed, Traceable to the hive, Small batch, San Diego County); a green marquee; a "Six jars. Pick yours." grid of No. 01–06 (Wildflower, Avocado Blossom, Vanilla Bean, Cinnamon, Bee Pollen, Guarana + Salt) with size chips; a Discovery Set (try all six); ways to use (sunrise spoonful, before the paddle out, golden hour); a subscription section; Find us (markets and stockists); email signup; footer.
- **Product page:** breadcrumb; buy box with size picker, one-time vs subscribe toggle, quantity and live price; ways to use; this batch; details; cross-sells.
- **Batches page:** hero, current batches on shelves, past batches, sourcing.

## Requirements
- Next.js App Router + TypeScript, zero-config deployable to Vercel, app at the repo root, `mockup/` untouched.
- Routes: `/`, `/shop`, `/shop/[slug]` (statically generated per jar via generateStaticParams), `/batches`, `/about`, `/find-us`. Plus a tasteful 404.
- All product and batch content in ONE typed data module. Prices and batch numbers are clearly marked TODO placeholders and are never presented as real (e.g. visibly flagged "placeholder price"/"TBD" in UI, `// TODO` in code).
- The jar is rebuilt as a reusable React/SVG component with the same parameters as Jar.dc.html (number, name, descriptor, labelColor, honey colours ×2, specks: none|vanilla|cinnamon|pollen|salt). It's the hero visual: make it beautiful and alive (rotation or tilt, honey shimmer, speck particles, hover response).
- Motion: premium and fun with no jank — scroll-driven reveals, smooth marquee, micro-interactions, page transitions (Framer Motion / `motion` or similar is fine). Respect `prefers-reduced-motion` AND add a visible pause-motion toggle (persisted).
- Mobile-first, great 390px and 1440px layouts, polished mobile menu (focus trap, Esc to close, body scroll lock).
- Commerce: Shopify later. Cart works client-side (add, remove, quantity, drawer, subtotal, persisted to localStorage) behind a small commerce interface (e.g. `lib/commerce/types.ts` + `localAdapter`) that a Shopify Storefront adapter can drop into later. Checkout shows a tasteful "coming soon".
- No logo or photos yet: typographic Sweet Bee wordmark and art-directed brand-colour placeholders/illustrations, structured so real assets drop into `public/` later. No stock photos, no external image URLs.
- Email signup is UI only (client validation + success state, no network).
- Quality: semantic HTML, accessible (keyboard, visible focus, alt text, contrast), metadata/OG (incl. generated OG image if feasible), Lighthouse 90+ targets, no console errors or hydration warnings, `npm run build` and `npm run lint` pass.
- Include a README section on how to run, swap fonts, add assets, and plug in Shopify.
