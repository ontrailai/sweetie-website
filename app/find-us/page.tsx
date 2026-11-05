import type { Metadata } from "next";
import { MarketList, StockistGrid } from "@/components/sections/Markets";
import { CommunityTiles, InstagramHandle, Quotes } from "@/components/sections/Community";
import { CountyMap } from "@/components/batches/CountyMap";
import { SplitText } from "@/components/motion/SplitText";
import { HumBee } from "@/components/fx/HumBee";
import { HoneyDrip } from "@/components/fx/HoneyDrip";
import { RoundSticker } from "@/components/fx/Sticker";
import { Tbd } from "@/components/ui/Tbd";
import { MARKETS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Find us",
  description: "Find Sweet Bee at San Diego County farmers markets and local stockists.",
  alternates: { canonical: "/find-us" },
};

// TODO(markets): placeholder pin spots until the market schedule is set.
const MARKET_PINS = [
  { x: 24, y: 30 },
  { x: 30, y: 66 },
  { x: 47, y: 44 },
];

export default function FindUsPage() {
  return (
    <>
      <section aria-labelledby="find-title" className="on-red relative z-10 bg-ladybug text-canvas">
        <div className="pt-header px-gutter relative isolate overflow-hidden pb-[clamp(72px,8vw,130px)]">
          <HumBee perch={{ x: 0.7, y: 0.3 }} />
          <div className="container-x relative flex flex-col gap-8">
            <span className="sticker self-start [--r:-3deg]">Markets · Stockists · Community</span>
            <h1 id="find-title" className="display text-[clamp(140px,26vw,460px)] leading-[0.74]">
              <SplitText text="Find" mode="load" /> <em><SplitText text="us." mode="load" start={4} /></em>
            </h1>
            <p className="ticket max-w-[440px] p-6 font-serif text-[clamp(24px,2vw,30px)] leading-tight tracking-[-0.01em] [--notch-y:50%]">
              Taste before you buy at a San Diego County market, or grab a jar at a shop near you.
            </p>
            <RoundSticker
              text="TASTE BEFORE YOU BUY · SAN DIEGO · "
              className="absolute bottom-0 right-0 w-[clamp(110px,13vw,190px)] max-md:hidden"
              center={<span className="font-serif text-[clamp(26px,2.6vw,40px)] font-bold italic leading-none text-nero">Hi!</span>}
            />
          </div>
        </div>
        <HoneyDrip color="#ff0000" className="absolute inset-x-0 top-[calc(100%-2px)] h-[clamp(36px,5vw,80px)]" />
      </section>

      <section id="markets" aria-labelledby="markets-h" className="px-gutter scroll-mt-24 bg-canvas pb-[clamp(72px,9vw,140px)] pt-[clamp(110px,11vw,180px)]">
        <div className="container-x grid items-start gap-x-16 gap-y-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-7">
            <h2 id="markets-h" className="display text-[clamp(64px,7.6vw,140px)]">
              At the <em className="text-peacock">market.</em>
            </h2>
            <MarketList />
            <p className="t-eyebrow">Schedule updated every week. Rain or shine, unless the bees say otherwise.</p>
          </div>
          <CountyMap batches={[]} caption="Illustrated, not to scale. Market pins are placeholders until the schedule is set.">
            {MARKETS.map((m, i) => {
              const pos = MARKET_PINS[i % MARKET_PINS.length]!;
              return (
                <span key={i} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                  <span className="sticker block text-[11px] [--r:-4deg]">{m.name ?? `Market ${i + 1} · TBD`}</span>
                </span>
              );
            })}
          </CountyMap>
        </div>
      </section>

      <section id="stockists" aria-labelledby="stockists-h" className="px-gutter scroll-mt-24 bg-canvas pb-[clamp(80px,10vw,160px)]">
        <div className="container-x flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="stockists-h" className="display text-[clamp(64px,7.6vw,140px)]">
              On <em>shelves.</em>
            </h2>
            <p className="max-w-[380px] text-[15px] leading-[1.7]">
              Want Sweet Bee in your shop?{" "}
              {SITE.email ? (
                <a href={`mailto:${SITE.email}`} className="font-bold underline underline-offset-4">
                  Get in touch
                </a>
              ) : (
                <Tbd>Wholesale contact coming soon</Tbd>
              )}
            </p>
          </div>
          <StockistGrid />
        </div>
      </section>

      <section id="instagram" aria-labelledby="ig-h" className="on-jade px-gutter relative z-[1] scroll-mt-24 bg-jade py-[clamp(80px,10vw,160px)] text-canvas">
        <div className="container-x flex flex-col gap-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="ig-h" className="display text-[clamp(72px,9vw,170px)]">
              Come hum <em>with us.</em>
            </h2>
            <p className="ticket max-w-[380px] p-5 text-[15px] leading-[1.7]">
              Share your spoonful. Tag <InstagramHandle /> and <strong>{SITE.hashtag}</strong> to land here.
            </p>
          </div>
          <CommunityTiles />
          <Quotes />
        </div>
        <HoneyDrip color="#308f32" className="absolute inset-x-0 top-[calc(100%-2px)] h-[clamp(36px,5vw,80px)]" />
      </section>
    </>
  );
}
