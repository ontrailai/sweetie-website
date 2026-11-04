import type { Metadata } from "next";
import Link from "next/link";
import { BatchFinder } from "@/components/batches/BatchFinder";
import { BatchShelf } from "@/components/batches/BatchShelf";
import { PastBatches } from "@/components/batches/PastBatches";
import { MarqueeBands } from "@/components/sections/MarqueeBands";
import { Bee, Flower } from "@/components/brand/Illustrations";
import { Jar } from "@/components/jar/Jar";
import { Reveal } from "@/components/motion/Reveal";
import { Drip } from "@/components/ui/Drip";
import { Tbd } from "@/components/ui/Tbd";
import { getProduct } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Batches",
  description: "Every Sweet Bee jar hums back to its hive. Look up your batch: honey, beekeeper area and harvest.",
  alternates: { canonical: "/batches" },
};

const STEPS = [
  { n: "01", title: "Find the number", body: <>Look for the batch number on your jar (<Tbd>placement on jar</Tbd>).</> },
  { n: "02", title: "Or scan the code", body: <>Every label carries a QR code that lands right here.</> },
  { n: "03", title: "Meet your hive", body: <>See the honey, the beekeeper area and the harvest it came from.</> },
];

export default function BatchesPage() {
  const demo = getProduct("bee-pollen")!;
  return (
    <>
      <section id="top" aria-labelledby="batches-title" className="on-pink relative z-10 bg-peacock text-canvas">
        <div className="px-gutter overflow-hidden pb-[clamp(72px,7vw,112px)] pt-[clamp(40px,6vw,96px)]">
          <div className="container-x flex flex-wrap items-end gap-x-16 gap-y-12">
            <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-7">
              <span className="t-eyebrow fade-up inline-flex min-h-9 items-center self-start bg-canvas px-4 text-forest">Batches · Thanks for scanning</span>
              <h1 id="batches-title" className="text-[clamp(64px,8.6vw,140px)] leading-[0.88] tracking-[0.01em]">
                <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                  <span className="rise-in">Every jar hums back</span>
                </span>{" "}
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span className="rise-in [animation-delay:0.12s]">
                    <em className="hum">to its hive.</em>
                  </span>
                </span>
              </h1>
              <p className="fade-up max-w-[520px] font-serif text-[clamp(24px,2.2vw,30px)] leading-[1.25] tracking-[0.025em] [animation-delay:0.3s]">
                Find the batch number on your jar, then match it below.
              </p>
            </div>
            <BatchFinder />
          </div>
        </div>
        <Drip className="absolute inset-x-0 top-[calc(100%-1px)] h-[clamp(40px,5vw,72px)] w-full text-peacock" />
      </section>

      <section aria-labelledby="how-read-h" className="px-gutter pb-6 pt-[clamp(96px,10vw,150px)]">
        <div className="container-x grid items-center gap-x-16 gap-y-10 md:grid-cols-[auto_minmax(0,1fr)]">
          <div className="relative mx-auto w-[clamp(120px,14vw,180px)]">
            <Bee className="bee-fly absolute -right-16 -top-6 w-20" />
            <Jar {...demo.jar} number={demo.number} name={demo.name} descriptor={demo.descriptor} />
          </div>
          <div className="flex flex-col gap-8">
            <h2 id="how-read-h" className="text-[clamp(44px,5vw,76px)] leading-[0.95]">
              How to read <em className="text-peacock">your jar.</em>
            </h2>
            <ol className="grid gap-6 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <Reveal as="li" key={s.n} delay={i * 0.1} className="flex flex-col gap-2 border-t-2 border-nero pt-4">
                  <span className="font-serif text-[48px] italic leading-none text-peacock">{s.n}</span>
                  <h3 className="text-[28px] leading-tight">{s.title}</h3>
                  <p className="text-[15px] leading-[1.6]">{s.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <MarqueeBands />

      <section id="on-shelves" aria-labelledby="current-h" className="px-gutter scroll-mt-24 pb-[clamp(72px,9vw,136px)] pt-12">
        <div className="container-x flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-end gap-6">
              <h2 id="current-h" className="text-[clamp(64px,8.4vw,132px)] leading-[0.9] tracking-[0.015em] text-peacock">
                On shelves <em>now.</em>
              </h2>
              <Flower className="spin-slow mb-3 hidden w-20 sm:block" />
            </div>
            <p className="text-[15px]">Updated with every new batch.</p>
          </div>
          <BatchShelf />
        </div>
      </section>

      <section aria-labelledby="past-h" className="px-gutter pb-[clamp(72px,9vw,136px)]">
        <div className="container-x flex flex-col gap-8">
          <h2 id="past-h" className="text-[clamp(48px,5.6vw,88px)] leading-[0.92]">
            Past <em>batches.</em>
          </h2>
          <PastBatches />
        </div>
      </section>

      <section aria-labelledby="source-h" className="on-dark px-gutter bg-forest py-[clamp(72px,9vw,136px)] text-canvas">
        <div className="container-x flex flex-wrap items-end justify-between gap-12">
          <div className="flex max-w-[760px] flex-col gap-6">
            <p className="t-eyebrow">How we source</p>
            <h2 id="source-h" className="text-[clamp(64px,8vw,128px)] leading-[0.88] tracking-[0.015em]">
              Raw. Local. <em className="text-honey">Traceable.</em>
            </h2>
            <p className="max-w-[56ch] text-[17px] leading-[1.7]">
              Every Sweet Bee jar starts with beekeepers across San Diego County. We keep it raw and unprocessed, and we log every batch here so you always know
              where your honey came from.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/#subscribe" className="btn on-nero-shadow min-h-[60px] bg-peacock px-8 font-serif text-[26px] tracking-[0.025em] text-canvas">
              Start a subscription
            </Link>
            <Link href="/shop" className="text-[15px] underline underline-offset-4 hover:text-peacock">
              Shop the jars
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
