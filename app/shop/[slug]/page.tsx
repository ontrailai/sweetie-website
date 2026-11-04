import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, batchHoneyLabel, currentBatchFor, getProduct } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { ProductGallery } from "@/components/product/ProductGallery";
import { BuyBox } from "@/components/product/BuyBox";
import { CrossSellCard } from "@/components/product/CrossSells";
import { Rituals } from "@/components/sections/Rituals";
import { Flower, Honeycomb } from "@/components/brand/Illustrations";
import { Reveal } from "@/components/motion/Reveal";
import { OrTbd, TbdTag } from "@/components/ui/Tbd";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const title = `No. ${p.number} ${p.name}`;
  return {
    title,
    description: `${p.tagline} ${p.description}`,
    alternates: { canonical: `/shop/${p.slug}` },
    openGraph: { title: `${title} · ${SITE.name}`, description: p.description, type: "website" },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const batch = currentBatchFor(product.slug);
  const honey = batch ? batchHoneyLabel(batch) : null;
  const pairs = product.pairsWith.map((s) => getProduct(s)).filter((p): p is NonNullable<typeof p> => !!p);

  const details: [string, React.ReactNode][] = [
    ["Tasting notes", product.tastingNotes],
    ["Ingredients", product.ingredients],
    ["Sizes", "6 oz, 16 oz and 32 oz, all in the tall slim jar."],
    [
      "Storage",
      "Keep it at room temperature with the lid on. Raw honey crystallizes naturally over time; set the jar in warm water to loosen it.",
    ],
    [
      "Shipping",
      <>
        <TbdTag>Placeholder</TbdTag> Where Sweet Bee ships, rates and delivery times are coming soon.
      </>,
    ],
    ["Good to know", product.goodToKnow.join(" ")],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Sweet Bee No. ${product.number} ${product.name}`,
    description: product.description,
    brand: { "@type": "Brand", name: SITE.name },
    category: "Honey",
    url: `${SITE.url}/shop/${product.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="px-gutter pb-[clamp(64px,8vw,112px)] pt-[clamp(20px,3vw,36px)]">
        <div className="container-x flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="text-[15px]">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/shop" className="underline-offset-4 hover:text-peacock hover:underline">
                  Shop
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">
                No. {product.number} {product.name}
              </li>
            </ol>
          </nav>
          <div className="grid gap-x-16 gap-y-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <ProductGallery product={product} />
            <div className="flex flex-col gap-5 md:pt-4">
              <p className="t-eyebrow fade-up text-forest">
                No. {product.number} · {product.category}
              </p>
              <h1 className="text-[clamp(72px,8vw,128px)] leading-[0.86] tracking-[0.01em]">
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span className="rise-in">
                    {product.display.lead.trim()}
                    {product.display.lead.endsWith(" ") ? " " : ""}
                    <em className="text-peacock">{product.display.em}</em>
                  </span>
                </span>
              </h1>
              <p className="fade-up font-serif text-[30px] italic tracking-[0.025em] [animation-delay:0.15s]">{product.tagline}</p>
              <p className="fade-up max-w-[52ch] text-base leading-[1.7] [animation-delay:0.25s]">{product.description}</p>
              <div className="fade-up [animation-delay:0.35s]">
                <BuyBox product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Rituals
        id="how-h"
        rituals={product.uses}
        title={
          <>
            Three ways <em>to use it.</em>
          </>
        }
      />

      <section aria-labelledby="batch-h" className="on-dark px-gutter relative overflow-hidden bg-nero py-[clamp(64px,8vw,112px)] text-canvas">
        <Honeycomb className="absolute -right-6 top-8 w-48 opacity-20" color="#F6EDDD" />
        <div className="container-x flex flex-wrap items-start gap-x-24 gap-y-10">
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
            <h2 id="batch-h" className="text-[clamp(56px,6.4vw,100px)] leading-[0.9]">
              This batch, <em className="text-peacock">traced.</em>
            </h2>
            <p className="max-w-[46ch] text-base leading-[1.7]">
              Every jar of No. {product.number} carries a QR code. Scan it, or check the batch on shelves now.
            </p>
            <div>
              <Link href={`/batches${batch ? `#batch-${batch.code}` : ""}`} className="btn on-nero-shadow min-h-[52px] bg-peacock px-6 font-serif text-[24px] text-canvas">
                See every batch
              </Link>
            </div>
          </div>
          <dl className="flex min-w-0 flex-[1_1_420px] flex-col text-[15px]">
            {[
              ["Batch", batch ? <><span className="mr-2">{batch.code}</span>{batch.placeholder ? <TbdTag>Placeholder</TbdTag> : null}</> : <OrTbd value={null} fallback="No." />],
              ["Honey", honey ? <><OrTbd value={honey.base} fallback="Base honey" />{honey.addition ? ` + ${honey.addition}` : ""}</> : product.name],
              ["Beekeeper area", <><OrTbd key="a" value={batch?.area} fallback="Area" />, San Diego County</>],
              ["Harvest", <OrTbd key="h" value={batch?.harvest} fallback="Season, year" />],
            ].map(([k, v]) => (
              <div key={k as string} className="flex justify-between gap-6 border-t border-canvas/35 py-4 last:border-b max-sm:flex-col max-sm:gap-1">
                <dt className="t-eyebrow">{k}</dt>
                <dd className="sm:text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="details-h" className="px-gutter py-[clamp(64px,8vw,112px)]">
        <div className="container-x grid gap-x-16 gap-y-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="flex items-start justify-between gap-6 md:flex-col">
            <h2 id="details-h" className="text-[clamp(56px,6.4vw,100px)] leading-[0.9]">
              The <em>details.</em>
            </h2>
            <Flower className="spin-slow w-[clamp(72px,9vw,128px)]" petal={product.jar.labelColor} />
          </div>
          <div className="border-t-2 border-nero">
            {details.map(([title, body], i) => (
              <details key={title} className="accordion group border-b border-nero/30" open={i === 0}>
                <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-4 font-serif text-[30px] tracking-[0.025em] transition-colors hover:text-peacock">
                  {title}
                  <span aria-hidden="true" className="plus grid size-9 shrink-0 place-items-center rounded-full border-2 border-current font-mono text-[20px] leading-none">
                    +
                  </span>
                </summary>
                <div className="max-w-[60ch] pb-6 text-base leading-[1.7]">{body}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="pairs-h" className="px-gutter pb-[clamp(64px,8vw,112px)]">
        <div className="container-x flex flex-col gap-10">
          <h2 id="pairs-h" className="text-[clamp(48px,5.6vw,88px)] leading-[0.92] text-peacock">
            Try these <em>next.</em>
          </h2>
          <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-3">
            {pairs.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <CrossSellCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
