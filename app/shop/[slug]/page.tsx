import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, batchHoneyLabel, currentBatchFor, getProduct } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { BuyBox } from "@/components/product/BuyBox";
import { ProductJar } from "@/components/product/ProductJar";
import { JarCard } from "@/components/product/JarCard";
import { DayArc } from "@/components/product/DayArc";
import { CountyMap } from "@/components/batches/CountyMap";
import { HoneyPool, JarParticles } from "@/components/jar/JarParticles";
import { SplitText } from "@/components/motion/SplitText";
import { HoneyDrip } from "@/components/fx/HoneyDrip";
import { RoundSticker } from "@/components/fx/Sticker";
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
  const p = product;

  const batch = currentBatchFor(p.slug);
  const honey = batch ? batchHoneyLabel(batch) : null;
  const pairs = p.pairsWith.map((s) => getProduct(s)).filter((x): x is NonNullable<typeof x> => !!x);
  const ink = p.jar.labelText ?? "#F6EDDD";
  const onLight = ink.toUpperCase() === "#262626";
  const surface = p.jar.labelColor.toUpperCase();
  const tone = onLight ? "" : surface === "#262626" || surface === "#004832" ? "on-dark" : "on-pink";

  const details: [string, React.ReactNode][] = [
    ["Tasting notes", p.tastingNotes],
    ["Ingredients", p.ingredients],
    ["Sizes", "6 oz, 16 oz and 32 oz, all in the tall slim jar."],
    ["Storage", "Keep it at room temperature with the lid on. Raw honey crystallizes naturally over time; set the jar in warm water to loosen it."],
    [
      "Shipping",
      <>
        <TbdTag>Placeholder</TbdTag> Where Sweet Bee ships, rates and delivery times are coming soon.
      </>,
    ],
    ["Good to know", p.goodToKnow.join(" ")],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Sweet Bee No. ${p.number} ${p.name}`,
    description: p.description,
    brand: { "@type": "Brand", name: SITE.name },
    category: "Honey",
    url: `${SITE.url}/shop/${p.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Takeover hero in the jar's own colour */}
      <section aria-labelledby="product-title" className={`${tone} relative z-10`} style={{ background: p.jar.labelColor, color: ink }}>
        <div className="relative isolate overflow-hidden">
          <JarParticles product={p} />
          <HoneyPool product={p} style={{ height: "12%" }} />
          <span aria-hidden="true" className="display text-stroke pointer-events-none absolute -bottom-[0.18em] -right-[0.04em] -z-10 text-[clamp(240px,40vw,720px)] opacity-25">
            {p.number}
          </span>
          <div className="pt-header px-gutter pb-[clamp(56px,8vw,120px)]">
            <div className="container-x flex flex-col gap-6">
              <nav aria-label="Breadcrumb">
                <ol className="chip gap-2">
                  <li>
                    <Link href="/shop" className="underline-offset-4 hover:underline">
                      Shop
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page">
                    No. {p.number} {p.name}
                  </li>
                </ol>
              </nav>
              <div className="grid items-start gap-x-10 gap-y-8 lg:grid-cols-[1.05fr_0.8fr_minmax(360px,0.95fr)]">
                <div className="flex flex-col gap-5 lg:pt-6">
                  <h1 id="product-title" className="display text-[clamp(76px,9vw,170px)]">
                    <SplitText text={p.display.lead.trim()} mode="load" />
                    {p.display.lead.endsWith(" ") ? <br /> : null}
                    <em>
                      <SplitText text={p.display.em} mode="load" start={p.display.lead.length} />
                    </em>
                  </h1>
                  <p className="font-serif text-[clamp(28px,2.8vw,42px)] italic leading-tight">{p.tagline}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="chip">No. {p.number} · {p.category}</span>
                    <span className="chip">
                      Best at {p.bestAt.time} · {p.bestAt.moment}
                    </span>
                  </div>
                  <p className="ticket max-w-[46ch] p-5 text-[15px] leading-[1.7] [--notch-y:30%]">{p.description}</p>
                </div>
                <div className="relative h-[62svh] min-h-[420px] lg:sticky lg:top-24 lg:h-[76svh]">
                  <RoundSticker
                    text={`RAW · SMALL BATCH · NO. ${p.number} · `}
                    className="absolute -left-2 top-2 z-10 w-[clamp(84px,8vw,120px)]"
                    center={<span className="font-serif text-[clamp(22px,2vw,30px)] font-semibold italic leading-none text-nero">{p.number}</span>}
                  />
                  <ProductJar product={p} />
                </div>
                <div className="ticket p-6 sm:p-7 lg:sticky lg:top-24 [--notch-y:120px]">
                  <BuyBox product={p} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <HoneyDrip color={p.jar.labelColor} className="absolute inset-x-0 top-[calc(100%-2px)] h-[clamp(36px,5vw,80px)]" />
      </section>

      {p.photos.length ? (
        <section aria-label={`Photos of No. ${p.number} ${p.name}`} className="px-gutter bg-canvas pt-[clamp(80px,9vw,140px)]">
          <ul className="container-x grid grid-cols-2 gap-4 md:grid-cols-3">
            {p.photos.map((ph) => (
              <li key={ph.src} className="relative aspect-[4/5] overflow-hidden rounded-[24px] border-2 border-nero">
                <Image src={ph.src} alt={ph.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="bg-canvas pt-[clamp(60px,6vw,100px)]" />
      <DayArc
        rituals={p.uses}
        title={
          <>
            A day with <em className="text-peacock">No. {p.number}.</em>
          </>
        }
      />

      {/* This batch, traced */}
      <section aria-labelledby="batch-h" className="on-dark px-gutter relative overflow-hidden bg-forest py-[clamp(80px,10vw,160px)] text-canvas">
        <div className="container-x grid items-center gap-x-16 gap-y-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-6">
            <h2 id="batch-h" className="display text-[clamp(64px,7.6vw,140px)]">
              This batch, <em>traced.</em>
            </h2>
            <p className="max-w-[46ch] text-[16px] leading-[1.7]">
              Every jar of No. {p.number} carries a batch number and a QR code. Scan it, or look up the batch on shelves right now.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/batches${batch ? `?batch=${batch.code}#scan` : "#scan"}`} className="btn bg-canvas text-nero">
                Scan your jar
              </Link>
              <Link href={`/batches${batch ? `#batch-${batch.code}` : ""}`} className="btn btn-sm bg-forest text-canvas [box-shadow:0_4px_0_0_#f6eddd] border-canvas">
                Every batch →
              </Link>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-[1fr_1fr] lg:grid-cols-1 xl:grid-cols-[1.1fr_1fr]">
            <div className="ticket flex flex-col gap-1 p-6 [--notch-y:58px]">
              <p className="t-eyebrow">Batch ticket</p>
              <p className="font-serif text-[40px] font-medium leading-none tracking-[-0.02em]">{batch ? batch.code : <OrTbd value={null} fallback="No." />}</p>
              {batch?.placeholder ? <TbdTag className="mb-2 self-start">Placeholder</TbdTag> : null}
              <dl className="mt-2 flex flex-col border-t-2 border-dashed border-nero/40 text-[14px]">
                {[
                  ["Honey", honey ? <><OrTbd value={honey.base} fallback="Base honey" />{honey.addition ? ` + ${honey.addition}` : ""}</> : p.name],
                  ["Beekeeper area", <><OrTbd key="a" value={batch?.area} fallback="Area" />, San Diego County</>],
                  ["Harvest", <OrTbd key="h" value={batch?.harvest} fallback="Season, year" />],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex justify-between gap-4 border-b border-nero/20 py-2.5">
                    <dt className="t-eyebrow text-[11px]">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <div aria-hidden="true" className="mt-3 h-10 w-full bg-[repeating-linear-gradient(90deg,#262626_0_2px,transparent_2px_5px,#262626_5px_6px,transparent_6px_10px)]" />
            </div>
            {batch ? <CountyMap batches={[batch]} compact /> : null}
          </div>
        </div>
      </section>

      {/* Details */}
      <section aria-labelledby="details-h" className="px-gutter bg-canvas py-[clamp(80px,10vw,160px)]">
        <div className="container-x grid gap-x-16 gap-y-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-6">
            <h2 id="details-h" className="display text-[clamp(72px,8vw,150px)]">
              The <em className="text-peacock">details.</em>
            </h2>
            <p className="font-serif text-[clamp(26px,2.4vw,34px)] italic leading-tight">“{p.tastingNotes}”</p>
          </div>
          <div className="border-t-2 border-nero">
            {details.map(([title, body], i) => (
              <details key={title} className="accordion group border-b-2 border-nero" open={i === 0}>
                <summary className="flex min-h-[76px] cursor-pointer items-center justify-between gap-6 py-4 font-serif text-[clamp(30px,3vw,46px)] font-medium tracking-[-0.02em] transition-[padding,font-style] duration-300 hover:pl-3 hover:italic">
                  {title}
                  <span aria-hidden="true" className="plus grid size-11 shrink-0 place-items-center rounded-full border-2 border-nero font-mono text-[22px] leading-none group-open:bg-nero group-open:text-canvas">
                    +
                  </span>
                </summary>
                <div className="max-w-[60ch] pb-7 text-[16px] leading-[1.7]">{body}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-sells */}
      <section aria-labelledby="pairs-h" className="px-gutter bg-canvas pb-[clamp(80px,10vw,160px)]">
        <div className="container-x flex flex-col gap-10">
          <h2 id="pairs-h" className="display text-[clamp(64px,7vw,130px)]">
            Try these <em className="text-peacock">next.</em>
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pairs.map((x, i) => (
              <li key={x.slug} className="rise" style={{ ["--d" as string]: `${i * 100}ms` }}>
                <JarCard product={x} sizes={false} tilt={[-2, 1.5, -1][i] ?? 0} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
