import Link from "next/link";
import type { ReactNode } from "react";
import { FOUNDERS_NOTE, QUOTES, SITE } from "@/lib/site";
import { Bee, Dipper, Flower, Honeycomb, Sun, Wave } from "@/components/brand/Illustrations";
import { SplitText } from "@/components/motion/SplitText";
import { OrTbd, Tbd } from "@/components/ui/Tbd";
import { MarketList } from "./Markets";

const TILES: { bg: string; art: ReactNode; rot: number }[] = [
  { bg: "bg-peacock", art: <Bee className="w-[52%]" />, rot: -4 },
  { bg: "bg-forest", art: <Sun className="w-[50%]" color="#ffd36b" />, rot: 3 },
  { bg: "bg-canvas", art: <Flower className="spin-slow w-[48%]" />, rot: -2 },
  { bg: "bg-nero", art: <Wave className="w-[60%]" />, rot: 5 },
  { bg: "bg-ladybug", art: <Dipper className="float w-[24%]" />, rot: -5 },
  { bg: "bg-canvas", art: <Honeycomb className="w-[50%]" />, rot: 2 },
];

export function InstagramHandle() {
  return SITE.instagram.handle ? <strong>@{SITE.instagram.handle}</strong> : <Tbd>@handle</Tbd>;
}

/** Placeholder "customer photo" polaroid stickers (until real UGC exists). */
export function CommunityTiles() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
      {TILES.map((t, i) => (
        <li
          key={i}
          className="rise group rounded-[14px] border-2 border-nero bg-canvas p-2 pb-3 text-nero shadow-[5px_5px_0_0_#262626] transition-transform duration-500 ease-[var(--ease-pop)] hover:z-10 hover:rotate-0 hover:scale-105"
          style={{ rotate: `${t.rot}deg`, ["--d" as string]: `${i * 70}ms` }}
        >
          <div className={`grid aspect-square place-items-center overflow-hidden rounded-[8px] ${t.bg}`} aria-hidden="true">
            <div className="grid size-full place-items-center transition-transform duration-500 ease-[var(--ease-pop)] group-hover:scale-110 group-hover:rotate-6">{t.art}</div>
          </div>
          <p className="mt-2 font-mono text-[12px] font-bold">
            <span className="tbd-tag">Customer photo {i + 1}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function Quotes() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6">
      {QUOTES.map((q, i) => (
        <figure key={i} className="ticket rise flex flex-col gap-4 p-6 [--notch-y:72%]" style={{ ["--d" as string]: `${i * 90}ms` }}>
          <blockquote className="font-serif text-[clamp(26px,2.4vw,34px)] font-normal italic leading-[1.1] tracking-[-0.02em]">
            “<OrTbd value={q.quote} fallback="Customer quote, in their words." />”
          </blockquote>
          <figcaption className="mt-auto text-[14px]">
            <OrTbd value={q.name} fallback="First name" /> · <OrTbd value={q.jar} fallback="Their jar" />
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function FoundersNote() {
  return (
    <figure className="on-dark relative flex flex-col gap-6 rounded-[28px] border-2 border-nero bg-forest p-[clamp(28px,4vw,56px)] text-canvas shadow-[8px_8px_0_0_#262626]">
      <span aria-hidden="true" className="display absolute -top-[0.35em] left-6 text-[160px] leading-none text-peacock">
        “
      </span>
      <blockquote className="font-serif text-[clamp(28px,3vw,48px)] font-normal italic leading-[1.15] tracking-[-0.02em]">
        <OrTbd value={FOUNDERS_NOTE.note} fallback="A short note from the two of you: why you started Sweet Bee, in two sentences." />
      </blockquote>
      <figcaption className="t-eyebrow">
        — <OrTbd value={FOUNDERS_NOTE.names} fallback="Your names" />, founders
      </figcaption>
    </figure>
  );
}

/** Home: "Come hum with us." on full-bleed Jade. */
export function Community() {
  return (
    <section id="community" aria-labelledby="community-h" className="on-jade px-gutter relative overflow-hidden bg-jade py-[clamp(80px,10vw,170px)] text-canvas">
      <div className="container-x flex flex-col gap-14">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2 id="community-h" className="display text-[clamp(72px,10vw,190px)]">
            <SplitText text="Come hum" /> <em><SplitText text="with us." start={7} /></em>
          </h2>
          <div className="ticket flex max-w-[380px] flex-col gap-3 p-5">
            <p className="text-[15px] leading-[1.6]">
              Find us at a market, or share your spoonful. Tag <InstagramHandle /> and <strong>{SITE.hashtag}</strong> to land here.
            </p>
            {SITE.instagram.url ? (
              <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm self-start bg-nero text-canvas">
                Follow on Instagram
              </a>
            ) : (
              <span className="tbd-tag self-start">Instagram coming soon</span>
            )}
          </div>
        </div>
        <CommunityTiles />
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-5">
            <h3 className="display text-[clamp(48px,5vw,88px)]">
              At the <em>market.</em>
            </h3>
            <p className="font-serif text-[26px] italic leading-tight">Taste before you buy. Schedule updated every week.</p>
            <Link href="/find-us" className="btn self-start bg-canvas text-nero">
              Full schedule &amp; stockists →
            </Link>
          </div>
          <MarketList />
        </div>
        <Quotes />
      </div>
    </section>
  );
}
