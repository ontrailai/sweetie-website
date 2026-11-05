import Link from "next/link";
import { BATCHES } from "@/lib/catalog";
import { CountyMap } from "@/components/batches/CountyMap";
import { SplitText } from "@/components/motion/SplitText";
import { Magnetic } from "@/components/motion/Magnetic";

const onShelves = BATCHES.filter((b) => b.status === "on-shelves");

/** Traceability as the hook: a county of humming hive pins + "scan your jar". */
export function TraceTeaser() {
  return (
    <section aria-labelledby="trace-h" className="on-dark px-gutter relative overflow-hidden bg-nero py-[clamp(80px,10vw,170px)] text-canvas">
      <div className="container-x grid items-center gap-x-16 gap-y-12 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-7">
          <p className="t-eyebrow flex items-center gap-3">
            <span className="relative inline-block size-3">
              <span className="pulse-pin absolute inset-0 rounded-full bg-peacock" />
              <span className="absolute inset-0 rounded-full bg-peacock" />
            </span>
            Traceable to the hive
          </p>
          <h2 id="trace-h" className="display text-[clamp(64px,8vw,150px)]">
            <SplitText text="Every jar hums back" /> <em className="text-peacock"><SplitText text="to its hive." start={19} /></em>
          </h2>
          <p className="max-w-[46ch] text-[16px] leading-[1.7]">
            Every label carries a batch number and a QR code. Scan it (or type it in) and meet the honey, the beekeeper&apos;s corner of San Diego County and the harvest it came from.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link href="/batches#scan" className="btn min-h-[60px] bg-canvas px-8 text-[26px] text-nero">
                Scan your jar
              </Link>
            </Magnetic>
            <Link href="/batches#map" className="font-mono text-[14px] font-bold uppercase tracking-[0.12em] underline underline-offset-4">
              Explore the hive map
            </Link>
          </div>
        </div>
        <div className="relative">
          <CountyMap batches={onShelves} compact />
          <span className="sticker absolute -bottom-5 left-6 [--r:-5deg]">Batch SB-01-C · placeholder</span>
        </div>
      </div>
    </section>
  );
}
