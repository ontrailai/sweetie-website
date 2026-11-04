import type { Metadata } from "next";
import { MarketList, StockistGrid } from "@/components/sections/Markets";
import { CommunityTiles, InstagramHandle, Quotes } from "@/components/sections/Community";
import { Bee, Sun, Wave } from "@/components/brand/Illustrations";
import { Star } from "@/components/brand/Star";
import { Drip } from "@/components/ui/Drip";
import { Tbd } from "@/components/ui/Tbd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Find us",
  description: "Find Sweet Bee at San Diego County farmers markets and local stockists.",
  alternates: { canonical: "/find-us" },
};

/** Stylised, not-to-scale coast illustration with placeholder pins. */
function CoastMap() {
  const pins = [
    { x: 168, y: 120, c: "#FF007C" },
    { x: 214, y: 220, c: "#308F32" },
    { x: 150, y: 300, c: "#FF0000" },
    { x: 300, y: 170, c: "#262626" },
  ];
  return (
    <figure className="relative aspect-[4/5] w-full overflow-hidden border-2 border-nero bg-forest">
      <svg viewBox="0 0 400 500" className="absolute inset-0 size-full" role="img" aria-label="Illustrated San Diego County coastline with market pins. Not to scale; locations to be confirmed.">
        <defs>
          <pattern id="land-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="7" cy="7" r="1.6" fill="#262626" opacity="0.18" />
          </pattern>
        </defs>
        <path
          id="coast"
          d="M120 0 C 110 60, 140 90, 120 140 C 100 190, 150 210, 130 260 C 110 300, 90 330, 112 380 C 130 420, 100 460, 116 500 L 400 500 L 400 0 Z"
          fill="#F6EDDD"
        />
        <path d="M120 0 C 110 60, 140 90, 120 140 C 100 190, 150 210, 130 260 C 110 300, 90 330, 112 380 C 130 420, 100 460, 116 500 L 400 500 L 400 0 Z" fill="url(#land-dots)" />
        <path d="M120 0 C 110 60, 140 90, 120 140 C 100 190, 150 210, 130 260 C 110 300, 90 330, 112 380 C 130 420, 100 460, 116 500" fill="none" stroke="#262626" strokeWidth="3" />
        <path d="M250 0 C 270 120, 380 160, 360 300 S 330 440, 400 500" fill="none" stroke="#308F32" strokeOpacity="0.35" strokeWidth="26" strokeLinecap="round" />
        <text x="250" y="60" fill="#004832" fontSize="14" style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.2em" }}>
          SAN DIEGO COUNTY
        </text>
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M${18 + (i % 2) * 20} ${40 + i * 64} q 14 -10 28 0 t 28 0`} fill="none" stroke="#F6EDDD" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
        ))}
        <path d="M190 40 C 260 90, 240 160, 320 200 S 360 330, 300 420" fill="none" stroke="#262626" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="6 8" />
        {pins.map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <circle r="18" fill={p.c} opacity="0.18" className="twinkle" style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: `${i * -0.6}s` }} />
            <path d="M0 0 C -12 -14, -12 -30, 0 -32 C 12 -30, 12 -14, 0 0 Z" fill={p.c} stroke="#262626" strokeWidth="2" />
            <circle cy="-21" r="4.5" fill="#F6EDDD" />
          </g>
        ))}
        <text x="20" y="482" fill="#F6EDDD" fontSize="13" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}>
          PACIFIC
        </text>
        <text x="380" y="482" textAnchor="end" fill="#262626" fontSize="12" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}>
          NOT TO SCALE · PINS TBD
        </text>
      </svg>
      <Wave className="absolute bottom-[18%] left-[4%] w-16" />
    </figure>
  );
}

export default function FindUsPage() {
  return (
    <>
      <section aria-labelledby="find-title" className="on-pink relative z-10 bg-peacock text-canvas">
        <div className="px-gutter overflow-hidden pb-[clamp(72px,7vw,112px)] pt-[clamp(40px,6vw,96px)]">
          <div className="container-x relative flex flex-wrap items-end justify-between gap-10">
            <Sun className="spin-slow absolute -right-10 -top-10 w-40 opacity-90" />
            <div className="flex flex-col gap-6">
              <span className="t-eyebrow fade-up inline-flex min-h-9 items-center self-start bg-canvas px-4 text-forest">Markets · Stockists · Community</span>
              <h1 id="find-title" className="text-[clamp(88px,14vw,220px)] leading-[0.82]">
                <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                  <span className="rise-in">Find</span>
                </span>{" "}
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <em className="rise-in [animation-delay:0.1s]">us.</em>
                </span>
              </h1>
            </div>
            <p className="fade-up max-w-[440px] font-serif text-[clamp(24px,2.2vw,30px)] leading-[1.25] tracking-[0.025em] [animation-delay:0.25s]">
              Taste before you buy at a San Diego County market, or grab a jar at a shop near you.
            </p>
          </div>
        </div>
        <Drip className="absolute inset-x-0 top-[calc(100%-1px)] h-[clamp(40px,5vw,72px)] w-full text-peacock" />
      </section>

      <section id="markets" aria-labelledby="markets-h" className="px-gutter scroll-mt-24 pb-[clamp(72px,9vw,120px)] pt-[clamp(110px,10vw,150px)]">
        <div className="container-x grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <div className="flex items-end justify-between gap-4">
              <h2 id="markets-h" className="text-[clamp(52px,6vw,96px)] leading-[0.9]">
                At the <em className="text-peacock">market.</em>
              </h2>
              <Bee className="bee-fly w-20 shrink-0" />
            </div>
            <MarketList />
            <p className="flex items-center gap-2 text-[15px]">
              <Star className="size-3.5 text-peacock" /> Schedule updated every week. Rain or shine, unless the bees say otherwise.
            </p>
          </div>
          <CoastMap />
        </div>
      </section>

      <section id="stockists" aria-labelledby="stockists-h" className="px-gutter scroll-mt-24 pb-[clamp(72px,9vw,136px)]">
        <div className="container-x flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="stockists-h" className="text-[clamp(52px,6vw,96px)] leading-[0.9]">
              On <em>shelves.</em>
            </h2>
            <p className="max-w-[380px] text-[15px] leading-[1.7]">
              Want Sweet Bee in your shop?{" "}
              {SITE.email ? (
                <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">
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

      <section id="instagram" aria-labelledby="ig-h" className="px-gutter scroll-mt-24 bg-nero/[0.04] py-[clamp(72px,9vw,136px)]">
        <div className="container-x flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="ig-h" className="text-[clamp(52px,6vw,96px)] leading-[0.9] text-peacock">
              Come hum <em>with us.</em>
            </h2>
            <p className="max-w-[380px] text-[15px] leading-[1.7]">
              Share your spoonful. Tag <InstagramHandle /> and <strong>{SITE.hashtag}</strong> to land here.
            </p>
          </div>
          <CommunityTiles />
          <Quotes />
        </div>
      </section>
    </>
  );
}
