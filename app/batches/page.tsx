import type { Metadata } from "next";
import Link from "next/link";
import { BatchScanner } from "@/components/batches/BatchScanner";
import { HiveLocator } from "@/components/batches/HiveLocator";
import { BatchShelf } from "@/components/batches/BatchShelf";
import { PastBatches } from "@/components/batches/PastBatches";
import { MarqueeBands } from "@/components/home/MarqueeBands";
import { SplitText } from "@/components/motion/SplitText";
import { Magnetic } from "@/components/motion/Magnetic";
import { HoneyDrip } from "@/components/fx/HoneyDrip";
import { Tbd } from "@/components/ui/Tbd";

export const metadata: Metadata = {
  title: "Batches",
  description: "Scan your jar: every Sweet Bee jar hums back to its hive. Look up your batch, find its hive on the map, see the harvest.",
  alternates: { canonical: "/batches" },
};

const STEPS = [
  { n: "01", title: "Find the number", body: <>It&apos;s printed on your jar (<Tbd>placement on jar</Tbd>), like SB-01-C.</>, bg: "bg-peacock text-canvas on-pink" },
  { n: "02", title: "Or scan the code", body: <>Every label carries a QR code that lands right on this page.</>, bg: "bg-jade text-canvas on-jade" },
  { n: "03", title: "Meet your hive", body: <>The honey, the beekeeper&apos;s corner of the county and the harvest.</>, bg: "bg-ladybug text-canvas on-red" },
];

export default function BatchesPage() {
  return (
    <>
      <section id="scan" aria-labelledby="batches-title" className="on-dark relative z-10 scroll-mt-0 bg-nero text-canvas">
        <div className="pt-header px-gutter overflow-hidden pb-[clamp(72px,8vw,130px)]">
          <div className="container-x grid items-center gap-x-16 gap-y-12 lg:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col gap-7">
              <span className="sticker self-start [--r:-3deg]">Batches · thanks for scanning</span>
              <h1 id="batches-title" className="display text-[clamp(88px,12vw,230px)]">
                <SplitText text="Scan" mode="load" /> <SplitText text="your" mode="load" start={4} /> <em className="text-peacock"><SplitText text="jar." mode="load" start={8} /></em>
              </h1>
              <p className="max-w-[46ch] font-serif text-[clamp(26px,2.4vw,36px)] italic leading-tight">Every jar hums back to its hive. Point the camera at the code, or type the number.</p>
            </div>
            <BatchScanner />
          </div>
        </div>
        <HoneyDrip color="#262626" className="absolute inset-x-0 top-[calc(100%-2px)] h-[clamp(36px,5vw,80px)]" />
      </section>

      <section aria-labelledby="how-read-h" className="px-gutter bg-canvas pb-10 pt-[clamp(110px,11vw,180px)]">
        <div className="container-x flex flex-col gap-10">
          <h2 id="how-read-h" className="display text-[clamp(64px,7.6vw,140px)]">
            How to read <em className="text-peacock">your jar.</em>
          </h2>
          <ol className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                className={`rise flex min-h-[300px] flex-col justify-between gap-6 rounded-[28px] border-2 border-nero p-7 shadow-[6px_6px_0_0_#262626] ${s.bg}`}
                style={{ rotate: `${[-1.5, 1, -0.5][i]}deg`, ["--d" as string]: `${i * 120}ms` }}
              >
                <span className="display text-[clamp(96px,9vw,150px)] italic">{s.n}</span>
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-[clamp(32px,2.8vw,42px)] font-medium leading-none tracking-[-0.02em]">{s.title}</h3>
                  <p className="chip whitespace-normal rounded-2xl px-3 py-2 text-[14px] font-normal normal-case leading-snug tracking-[0.02em]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="map" aria-labelledby="map-h" className="px-gutter scroll-mt-24 bg-canvas py-[clamp(72px,9vw,140px)]">
        <div className="container-x flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="map-h" className="display text-[clamp(64px,7.6vw,140px)]">
              The hive <em>map.</em>
            </h2>
            <p className="max-w-[40ch] text-[15px] leading-[1.7]">
              San Diego County runs from the coast to the desert in an hour&apos;s drive. Each jar&apos;s current batch is pinned where its hives are (once we can share that).
            </p>
          </div>
          <HiveLocator />
        </div>
      </section>

      <MarqueeBands className="bg-canvas" />

      <section id="on-shelves" aria-labelledby="current-h" className="px-gutter scroll-mt-24 bg-canvas pb-[clamp(80px,10vw,160px)] pt-10">
        <div className="container-x flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="current-h" className="display text-[clamp(72px,9vw,170px)]">
              On shelves <em className="text-peacock">now.</em>
            </h2>
            <p className="t-eyebrow">Updated with every new batch</p>
          </div>
          <BatchShelf />
        </div>
      </section>

      <section id="past" aria-labelledby="past-h" className="on-dark px-gutter scroll-mt-24 bg-nero py-[clamp(80px,10vw,160px)] text-canvas">
        <div className="container-x flex flex-col gap-10">
          <h2 id="past-h" className="display text-[clamp(64px,7.6vw,140px)]">
            Past <em>batches.</em>
          </h2>
          <PastBatches />
        </div>
      </section>

      <section aria-labelledby="source-h" className="on-dark px-gutter relative z-[1] bg-forest py-[clamp(80px,10vw,160px)] text-canvas">
        <div className="container-x flex flex-wrap items-end justify-between gap-12">
          <div className="flex max-w-[900px] flex-col gap-6">
            <p className="t-eyebrow">How we source</p>
            <h2 id="source-h" className="display text-[clamp(72px,9vw,170px)]">
              Raw. Local. <em>Traceable.</em>
            </h2>
            <p className="max-w-[56ch] text-[16px] leading-[1.7]">
              Every Sweet Bee jar starts with beekeepers across San Diego County. We keep it raw and unprocessed, and we log every batch here so you always know where your honey came from.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Magnetic>
              <Link href="/#subscribe" className="btn min-h-[60px] bg-peacock px-8 text-[26px] text-canvas">
                Start a subscription
              </Link>
            </Magnetic>
            <Link href="/shop" className="font-mono text-[14px] font-bold uppercase tracking-[0.12em] underline underline-offset-4">
              Shop the jars
            </Link>
          </div>
        </div>
        <HoneyDrip color="#004832" className="absolute inset-x-0 top-[calc(100%-2px)] h-[clamp(36px,5vw,80px)]" />
      </section>
    </>
  );
}
