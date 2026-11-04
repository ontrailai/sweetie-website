import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { Bee, Flower, Honeycomb, Sun } from "@/components/brand/Illustrations";
import { Star } from "@/components/brand/Star";
import { Reveal } from "@/components/motion/Reveal";
import { FoundersNote } from "@/components/sections/Community";
import { SignupSection } from "@/components/sections/SignupSection";
import { Tbd } from "@/components/ui/Tbd";

export const metadata: Metadata = {
  title: "About",
  description: "Sweet Bee is raw, small-batch honey from San Diego County beekeepers. Our story, Honey 101 and FAQ.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { k: "Raw", body: "Unprocessed honey from local hives. Infused jars add only what is on the label." },
  { k: "Local", body: "Sourced from beekeepers across San Diego County. Not blended from who-knows-where." },
  { k: "Traceable", body: "Every jar carries a batch number and a QR code that leads back to its hive." },
  { k: "Loud", body: "Peacock pink, six numbered jars and zero sleepy honey. Honey can be fun." },
];

const HONEY_101 = [
  {
    q: "What does raw mean?",
    a: "Raw honey goes from the hive to the jar without being processed. That's how we keep it.",
  },
  {
    q: "Why did my honey go solid?",
    a: "Crystallization is natural for raw honey and nothing is wrong with it. Set the jar in warm (not boiling) water and stir to loosen it.",
  },
  {
    q: "Why local?",
    a: "Local honey tastes like where it's from. Wildflower changes with the season's blooms; avocado blossom tastes like the groves.",
  },
  {
    q: "What's in the infused jars?",
    a: "Raw honey plus exactly what's on the label: vanilla bean, cinnamon, bee pollen, or guarana and salt. Nothing else.",
  },
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
      <section aria-labelledby="about-title" className="px-gutter relative overflow-hidden pb-[clamp(64px,8vw,120px)] pt-[clamp(40px,6vw,96px)]">
        <Sun className="spin-slow absolute -right-16 -top-16 w-64 opacity-90" color="#FF007C" />
        <div className="container-x relative flex flex-col gap-10">
          <p className="t-eyebrow fade-up text-forest">About Sweet Bee</p>
          <h1 id="about-title" className="max-w-[12ch] text-[clamp(72px,11vw,184px)] leading-[0.84] tracking-[0.005em]">
            <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <span className="rise-in">Honey that</span>
            </span>{" "}
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <em className="rise-in text-peacock [animation-delay:0.1s]">
                <span className="hum">hums.</span>
              </em>
            </span>
          </h1>
          <div className="fade-up grid gap-8 [animation-delay:0.25s] md:grid-cols-2">
            <p className="font-serif text-[clamp(26px,2.6vw,36px)] leading-[1.2] tracking-[0.025em]">
              Sweet Bee is raw, small-batch honey from San Diego County beekeepers, bottled in six numbered jars.
            </p>
            <p className="text-base leading-[1.8]">
              We think honey should taste like where it&apos;s from, tell you exactly where it came from, and look good on the counter. So every jar is raw, every
              batch is logged, and every label is loud. Your daily spoonful, six ways.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="The six jars" className="on-pink overflow-hidden bg-peacock px-gutter py-16">
        <div className="container-x flex items-end justify-between gap-2 sm:gap-6">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.07} y={60} className="w-[14%]">
              <Link href={`/shop/${p.slug}`} className="block transition-transform duration-500 ease-[var(--ease-pop)] hover:-translate-y-4 hover:-rotate-3">
                <span className="sr-only">
                  No. {p.number} {p.name}
                </span>
                <Jar {...p.jar} number={p.number} name={p.name} descriptor={p.descriptor} decorative />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="values-h" className="px-gutter py-[clamp(72px,9vw,136px)]">
        <div className="container-x flex flex-col gap-12">
          <div className="flex items-end justify-between gap-6">
            <h2 id="values-h" className="text-[clamp(56px,6.4vw,100px)] leading-[0.9]">
              What we <em>stand for.</em>
            </h2>
            <Bee className="bee-fly w-24 shrink-0" />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal
                as="li"
                key={v.k}
                delay={i * 0.08}
                className={`flex min-h-[240px] flex-col justify-between gap-8 p-[clamp(24px,3vw,40px)] transition-transform duration-300 ease-[var(--ease-pop)] hover:-translate-y-1.5 ${
                  ["bg-forest text-canvas on-dark", "bg-canvas border-2 border-nero", "bg-nero text-canvas on-dark", "bg-peacock text-canvas on-pink"][i]
                }`}
              >
                <span className="font-serif text-[clamp(56px,6vw,96px)] italic leading-none">{v.k}.</span>
                <p className={`max-w-[40ch] leading-[1.6] ${i === 3 ? "font-serif text-[24px] tracking-[0.025em]" : "text-base"}`}>{v.body}</p>
              </Reveal>
            ))}
          </ul>
          <FoundersNote />
        </div>
      </section>

      <section id="honey-101" aria-labelledby="honey101-h" className="on-dark px-gutter scroll-mt-20 bg-nero py-[clamp(72px,9vw,136px)] text-canvas">
        <div className="container-x flex flex-col gap-12">
          <div className="flex items-end justify-between gap-6">
            <h2 id="honey101-h" className="text-[clamp(56px,6.4vw,100px)] leading-[0.9]">
              Honey <em className="text-peacock">101.</em>
            </h2>
            <Honeycomb className="w-24 shrink-0" color="#F6EDDD" />
          </div>
          <ol className="grid gap-x-10 gap-y-10 md:grid-cols-2">
            {HONEY_101.map((h, i) => (
              <Reveal as="li" key={h.q} delay={(i % 2) * 0.08} className="flex flex-col gap-3 border-t border-canvas/40 pt-5">
                <span className="font-mono text-[13px] text-honey">0{i + 1}</span>
                <h3 className="text-[34px] leading-[1.05]">{h.q}</h3>
                <p className="max-w-[52ch] text-base leading-[1.7]">{h.a}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-h" className="px-gutter scroll-mt-20 py-[clamp(72px,9vw,136px)]">
        <div className="container-x grid gap-x-16 gap-y-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="flex items-start justify-between gap-6 md:flex-col">
            <h2 id="faq-h" className="text-[clamp(56px,6.4vw,100px)] leading-[0.9]">
              <abbr title="Frequently asked questions" className="no-underline">FAQ</abbr>
              <em className="text-peacock">.</em>
            </h2>
            <Flower className="spin-slow w-[clamp(72px,9vw,128px)]" />
          </div>
          <div className="border-t-2 border-nero">
            {FAQ.map(([q, a]) => (
              <details key={q} className="accordion border-b border-nero/30">
                <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-4 font-serif text-[28px] leading-tight tracking-[0.025em] transition-colors hover:text-peacock">
                  {q}
                  <span aria-hidden="true" className="plus grid size-9 shrink-0 place-items-center rounded-full border-2 border-current font-mono text-[20px] leading-none">
                    +
                  </span>
                </summary>
                <div className="max-w-[60ch] pb-6 text-base leading-[1.7]">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="px-gutter pb-16">
        <p className="container-x flex items-center gap-3 text-[15px]">
          <Star className="size-4 text-peacock" /> Something we missed? Find us at a market and ask in person.{" "}
          <Link href="/find-us" className="underline underline-offset-4 hover:text-peacock">
            Find us
          </Link>
        </p>
      </div>
      <SignupSection />
    </>
  );
}
