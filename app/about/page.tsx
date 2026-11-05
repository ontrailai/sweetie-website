import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/lib/catalog";
import { JarPhoto } from "@/components/jar/JarPhoto";
import { Bee } from "@/components/brand/Illustrations";
import { SplitText } from "@/components/motion/SplitText";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { FoundersNote } from "@/components/sections/Community";
import { SignupSection } from "@/components/sections/SignupSection";
import { RoundSticker } from "@/components/fx/Sticker";
import { Star } from "@/components/brand/Star";
import { Tbd } from "@/components/ui/Tbd";

export const metadata: Metadata = {
  title: "About",
  description: "Sweet Bee is raw, small-batch honey from San Diego County beekeepers. Our story, Honey 101 and FAQ.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { k: "Raw.", body: "Unprocessed honey from local hives. Infused jars add only what's on the label.", cls: "bg-forest text-canvas on-dark" },
  { k: "Local.", body: "Sourced from beekeepers across San Diego County. Not blended from who-knows-where.", cls: "bg-jade text-canvas on-jade" },
  { k: "Traceable.", body: "Every jar carries a batch number and a QR code that leads back to its hive.", cls: "bg-nero text-canvas on-dark" },
  { k: "Loud.", body: "Peacock pink, six numbered jars and zero sleepy honey. Honey can be fun.", cls: "bg-peacock text-canvas on-pink" },
];

const HONEY_101 = [
  { q: "What does raw mean?", a: "Raw honey goes from the hive to the jar without being processed. That's how we keep it." },
  { q: "Why did my honey go solid?", a: "Crystallization is natural for raw honey and nothing is wrong with it. Set the jar in warm (not boiling) water and stir to loosen it." },
  { q: "Why local?", a: "Local honey tastes like where it's from. Wildflower changes with the season's blooms; avocado blossom tastes like the groves." },
  { q: "What's in the infused jars?", a: "Raw honey plus exactly what's on the label: vanilla bean, cinnamon, bee pollen, or guarana and salt. Nothing else." },
];

const FAQ: [string, React.ReactNode][] = [
  ["Can babies have honey?", "No. Honey is not for infants under 12 months."],
  ["How do I store it?", "At room temperature, lid on, out of direct sun. No need to refrigerate."],
  ["Does No. 06 have caffeine?", "Yes. Guarana is a natural source of caffeine, so No. 06 isn't for kids or anyone sensitive to caffeine."],
  ["How does the subscription work?", "Pick your jars and how often they ship. Pause, skip, swap or cancel anytime."],
  ["Where do you ship?", <Tbd key="s">Shipping details coming soon</Tbd>],
  ["Can my shop stock Sweet Bee?", <>We&apos;d love that. <Tbd>Wholesale contact coming soon</Tbd></>],
];

export default function AboutPage() {
  return (
    <>
      <section aria-labelledby="about-title" className="pt-header px-gutter relative overflow-hidden bg-canvas pb-[clamp(56px,7vw,110px)]">
        <div className="container-x relative flex flex-col gap-10">
          <p className="t-eyebrow">About Sweet Bee · San Diego County</p>
          <h1 id="about-title" className="display text-[clamp(96px,16vw,300px)]">
            <SplitText text="Honey" mode="load" />
            <br />
            <SplitText text="that" mode="load" start={5} />{" "}
            <em className="breathe buzz inline-block text-peacock">
              <SplitText text="hums." mode="load" start={9} />
            </em>
          </h1>
          <RoundSticker
            text="EST. SAN DIEGO COUNTY · RAW HONEY · "
            bg="#ff007c"
            ink="#f6eddd"
            className="absolute right-0 top-0 w-[clamp(110px,13vw,200px)] max-md:hidden"
            center={<Bee className="w-full" />}
          />
          <div className="grid gap-8 md:grid-cols-2">
            <p className="font-serif text-[clamp(28px,2.8vw,42px)] leading-[1.15] tracking-[-0.02em]">
              Sweet Bee is raw, small-batch honey from San Diego County beekeepers, bottled in six numbered jars.
            </p>
            <p className="text-[16px] leading-[1.8]">
              We think honey should taste like where it&apos;s from, tell you exactly where it came from, and look good on the counter. So every jar is raw, every batch is logged, and every label is loud. Your daily spoonful, six ways.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="The six jars" className="on-pink relative z-10 bg-peacock">
        <div className="px-gutter overflow-hidden pb-6 pt-16">
          <ul className="container-x flex items-end justify-between gap-2 sm:gap-6">
            {PRODUCTS.map((p, i) => (
              <li key={p.slug} className="rise w-[14%]" style={{ ["--d" as string]: `${i * 80}ms` }}>
                <Link href={`/shop/${p.slug}`} className="group block">
                  <span className="sr-only">
                    No. {p.number} {p.name}
                  </span>
                  <span className="block transition-transform duration-500 ease-[var(--ease-pop)] group-hover:-translate-y-6 group-hover:-rotate-6 group-focus-visible:-translate-y-6">
                    <JarPhoto product={p} sizes="(min-width: 640px) 13vw, 14vw" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <VelocityMarquee baseSpeed={40} className="border-t-2 border-nero bg-nero py-3 text-canvas" trackClassName="items-center">
          {["Raw", "Local", "Traceable", "Loud", "Six jars", "Zero sleepy honey"].map((w) => (
            <span key={w} className="flex items-center gap-5 pr-5 font-serif text-[clamp(32px,4vw,56px)] italic leading-none">
              {w}
              <Star className="size-[0.5em] text-peacock" />
            </span>
          ))}
        </VelocityMarquee>
      </section>

      <section aria-labelledby="values-h">
        <h2 id="values-h" className="sr-only">
          What we stand for
        </h2>
        <ul>
          {VALUES.map((v, i) => (
            <li key={v.k} className={`px-gutter relative overflow-hidden py-[clamp(48px,6vw,96px)] ${v.cls}`}>
              <div className={`container-x flex flex-wrap items-center justify-between gap-8 ${i % 2 ? "flex-row-reverse" : ""}`}>
                <p className="display text-[clamp(96px,17vw,320px)] italic">
                  <SplitText text={v.k} />
                </p>
                <p className="ticket max-w-[380px] p-6 font-serif text-[clamp(24px,2vw,30px)] leading-tight tracking-[-0.01em] [--notch-y:40%]">{v.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="A note from the founders" className="px-gutter bg-canvas py-[clamp(72px,9vw,140px)]">
        <div className="container-x max-w-[1100px]">
          <FoundersNote />
        </div>
      </section>

      <section id="honey-101" aria-labelledby="honey101-h" className="on-dark px-gutter scroll-mt-20 bg-nero py-[clamp(80px,10vw,160px)] text-canvas">
        <div className="container-x flex flex-col gap-12">
          <h2 id="honey101-h" className="display text-[clamp(72px,9vw,170px)]">
            Honey <em className="text-peacock">101.</em>
          </h2>
          <ol className="grid gap-5 md:grid-cols-2">
            {HONEY_101.map((h, i) => (
              <li key={h.q} className="rise flex flex-col gap-4 rounded-[28px] border-2 border-canvas/30 p-7 transition-colors hover:border-peacock" style={{ ["--d" as string]: `${(i % 2) * 120}ms` }}>
                <span className="display text-[64px] italic text-peacock">0{i + 1}</span>
                <h3 className="font-serif text-[clamp(32px,2.8vw,44px)] font-medium leading-[1.02] tracking-[-0.02em]">{h.q}</h3>
                <p className="max-w-[52ch] text-[16px] leading-[1.7]">{h.a}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-h" className="px-gutter relative z-[1] scroll-mt-20 bg-canvas py-[clamp(80px,10vw,160px)]">
        <div className="container-x grid gap-x-16 gap-y-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-6">
            <h2 id="faq-h" className="display text-[clamp(80px,10vw,180px)]">
              <abbr title="Frequently asked questions" className="no-underline">FAQ</abbr>
              <em className="text-peacock">s.</em>
            </h2>
            <p className="text-[15px] leading-[1.7]">
              Something we missed? Find us at a market and ask in person.{" "}
              <Link href="/find-us" className="font-bold underline underline-offset-4">
                Find us
              </Link>
            </p>
          </div>
          <div className="border-t-2 border-nero">
            {FAQ.map(([q, a]) => (
              <details key={q} className="accordion group border-b-2 border-nero">
                <summary className="flex min-h-[76px] cursor-pointer items-center justify-between gap-6 py-4 font-serif text-[clamp(26px,2.6vw,38px)] font-medium leading-tight tracking-[-0.02em] transition-[padding] duration-300 hover:pl-3 hover:italic">
                  {q}
                  <span aria-hidden="true" className="plus grid size-11 shrink-0 place-items-center rounded-full border-2 border-nero font-mono text-[22px] leading-none group-open:bg-nero group-open:text-canvas">
                    +
                  </span>
                </summary>
                <div className="max-w-[60ch] pb-7 text-[16px] leading-[1.7]">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
      <SignupSection />
    </>
  );
}
