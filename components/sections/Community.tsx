import Link from "next/link";
import type { ReactNode } from "react";
import { FOUNDERS_NOTE, QUOTES, SITE } from "@/lib/site";
import { Bee, Dipper, Flower, Honeycomb, Sun, Wave } from "@/components/brand/Illustrations";
import { Star } from "@/components/brand/Star";
import { Reveal } from "@/components/motion/Reveal";
import { OrTbd, Tbd, TbdTag } from "@/components/ui/Tbd";
import { MarketList } from "./Markets";

const TILES: { bg: string; art: ReactNode }[] = [
  { bg: "bg-peacock", art: <Bee className="bee-fly w-[46%]" /> },
  { bg: "bg-forest", art: <Sun className="w-[46%]" color="#E6A52A" /> },
  { bg: "bg-canvas border-2 border-nero", art: <Flower className="spin-slow w-[42%]" /> },
  { bg: "bg-nero", art: <Wave className="w-[56%]" /> },
  { bg: "bg-jade", art: <Dipper className="float w-[22%]" /> },
  { bg: "bg-ladybug", art: <Honeycomb className="w-[46%]" color="#F6EDDD" /> },
];

export function InstagramHandle() {
  return SITE.instagram.handle ? <strong>@{SITE.instagram.handle}</strong> : <Tbd>@handle</Tbd>;
}

export function CommunityTiles() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {TILES.map((t, i) => (
        <Reveal as="li" key={i} delay={i * 0.06} className={`group relative grid aspect-square place-items-center overflow-hidden ${t.bg}`}>
          <div className="grid size-full place-items-center transition-transform duration-500 ease-[var(--ease-pop)] group-hover:scale-110" aria-hidden="true">
            {t.art}
          </div>
          {/* Canvas-backed caption: small Canvas text fails contrast on Peacock, Jade and Ladybug. */}
          <span className="absolute bottom-3 left-3">
            <TbdTag className="bg-canvas text-nero">Customer photo {i + 1}</TbdTag>
          </span>
        </Reveal>
      ))}
    </ul>
  );
}

export function Quotes() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-8 gap-y-10">
      {QUOTES.map((q, i) => (
        <Reveal key={i} delay={i * 0.08}>
          <figure className="flex flex-col gap-[18px] border-t-2 border-nero pt-[22px]">
            <blockquote className="font-serif text-[clamp(28px,2.6vw,36px)] leading-[1.15] tracking-[0.02em]">
              “<OrTbd value={q.quote} fallback="Customer quote, in their words." />”
            </blockquote>
            <figcaption className="text-[15px]">
              <OrTbd value={q.name} fallback="First name" /> ·{" "}
              <span className="t-eyebrow text-forest">
                <OrTbd value={q.jar} fallback="Their jar" />
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

export function FoundersNote() {
  return (
    <div className="on-dark flex flex-wrap items-center gap-x-12 gap-y-6 bg-forest p-[clamp(28px,3vw,40px)] text-canvas">
      <p className="min-w-0 flex-[1_1_480px] font-serif text-[clamp(26px,2.4vw,34px)] italic leading-[1.25] tracking-[0.02em]">
        “<OrTbd value={FOUNDERS_NOTE.note} fallback="A short note from the two of you: why you started Sweet Bee, in two sentences." />”
      </p>
      <p className="flex-none font-serif text-[26px] tracking-[0.025em]">
        — <OrTbd value={FOUNDERS_NOTE.names} fallback="Your names" />
      </p>
    </div>
  );
}

export function Community() {
  return (
    <section id="community" aria-labelledby="community-h" className="px-gutter py-[clamp(72px,9vw,136px)]">
      <div className="container-x flex flex-col gap-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-[18px]">
            <p className="t-eyebrow text-forest">Community</p>
            <h2 id="community-h" className="text-[clamp(64px,8.4vw,132px)] leading-[0.9] tracking-[0.015em] text-peacock">
              Come hum <em>with us.</em>
            </h2>
          </div>
          <div className="flex max-w-[360px] flex-col items-start gap-3">
            <p className="text-[15px] leading-[1.7]">
              Find us at a market, or share your spoonful. Tag <InstagramHandle /> and <strong>{SITE.hashtag}</strong> to land here.
            </p>
            {SITE.instagram.url ? (
              <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="btn min-h-[52px] bg-nero px-6 text-[15px] text-canvas">
                Follow on Instagram
              </a>
            ) : (
              <span className="inline-flex min-h-[52px] items-center gap-2 border-2 border-dashed border-nero px-6 text-[15px]">
                Instagram coming soon
              </span>
            )}
          </div>
        </div>

        <div id="find" className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="text-[clamp(40px,4.4vw,64px)] leading-none tracking-[0.02em]">
              At the <em>market.</em>
            </h3>
            <Link href="/find-us" className="btn min-h-[52px] bg-nero px-6 text-[15px] text-canvas">
              Full schedule &amp; stockists
            </Link>
          </div>
          <MarketList />
          <p className="flex items-center gap-2 text-[15px]">
            <Star className="size-3.5 text-peacock" /> Schedule updated every week.
          </p>
        </div>

        <h3 className="text-[clamp(40px,4.4vw,64px)] leading-none tracking-[0.02em]">
          Out <em>there.</em>
        </h3>
        <CommunityTiles />
        <Quotes />
        <FoundersNote />
      </div>
    </section>
  );
}
