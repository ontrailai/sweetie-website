import Link from "next/link";
import { PRODUCTS, SUBSCRIPTION, fromPrice, subscriberPrice } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { Wordmark } from "@/components/brand/Wordmark";
import { Star } from "@/components/brand/Star";
import { Flower } from "@/components/brand/Illustrations";
import { Price } from "@/components/ui/Price";
import { Tbd, TbdTag } from "@/components/ui/Tbd";
import { Reveal } from "@/components/motion/Reveal";

const BOX_JARS = ["wildflower", "guarana-salt", "vanilla-bean"].map((s) => PRODUCTS.find((p) => p.slug === s)!);

export function Subscription() {
  const from = subscriberPrice(fromPrice(PRODUCTS[0]!));
  return (
    <section id="subscribe" aria-labelledby="box-h" className="on-dark px-gutter scroll-mt-20 bg-forest py-[clamp(72px,9vw,136px)] text-canvas">
      <div className="container-x flex flex-wrap items-center gap-x-24 gap-y-14">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-7">
          <span className="inline-flex min-h-9 items-center self-start bg-peacock px-4 font-serif text-[24px] italic text-canvas">Subscription</span>
          <h2 id="box-h" className="text-[clamp(64px,8vw,128px)] leading-[0.88] tracking-[0.015em]">
            Keep the <em>hum going.</em>
          </h2>
          <p className="max-w-[480px] text-[17px] leading-[1.7]">
            The Sweet Bee Box: your favorite jars, delivered on repeat so the ritual never runs dry.
          </p>
          <dl className="flex max-w-[520px] flex-col text-[15px]">
            <div className="flex justify-between gap-6 border-t border-canvas/35 py-4 max-sm:flex-col max-sm:gap-1">
              <dt className="t-eyebrow pt-0.5">Inside</dt>
              <dd className="sm:text-right">{SUBSCRIPTION.inside ?? <Tbd>What&apos;s inside each box</Tbd>}</dd>
            </div>
            <div className="flex justify-between gap-6 border-t border-canvas/35 py-4 max-sm:flex-col max-sm:gap-1">
              <dt className="t-eyebrow pt-0.5">Delivery</dt>
              <dd className="flex flex-col gap-1 sm:items-end sm:text-right">
                <span>
                  {SUBSCRIPTION.frequencies.map((f) => f.replace("Every ", "")).join(", ").replace(/, ([^,]*)$/, " or $1")}
                  {SUBSCRIPTION.frequenciesArePlaceholder ? <TbdTag className="ml-2">TBD</TbdTag> : null}
                </span>
                <Price price={from} prefix="from" tag="Placeholder" />
              </dd>
            </div>
            <div className="flex justify-between gap-6 border-y border-canvas/35 py-4 max-sm:flex-col max-sm:gap-1">
              <dt className="t-eyebrow pt-0.5">Flexible</dt>
              <dd className="sm:text-right">{SUBSCRIPTION.flexible}</dd>
            </div>
          </dl>
          <div>
            <Link href="/shop/wildflower" className="btn on-nero-shadow min-h-[60px] bg-peacock px-9 font-serif text-[26px] tracking-[0.025em] text-canvas">
              Join the box
            </Link>
          </div>
        </div>

        <Reveal className="relative aspect-square min-w-0 flex-[1_1_420px] overflow-hidden bg-canvas" y={40}>
          <Flower className="spin-slow absolute left-[5%] top-[5%] w-[18%]" />
          <div className="absolute right-[6%] top-[7%] grid size-[clamp(84px,9vw,120px)] rotate-12 place-items-center text-peacock">
            <Star className="spin-slow absolute inset-0 size-full" />
            <span className="relative text-center font-serif text-[clamp(18px,1.6vw,22px)] font-bold leading-tight text-canvas">
              Save
              <br />
              {SUBSCRIPTION.discountPercent}%*
            </span>
          </div>
          <div aria-hidden="true" className="absolute bottom-[7%] left-1/2 h-[4%] w-[82%] -translate-x-1/2 rounded-[50%] bg-nero/20" />
          <div className="float absolute inset-x-[22%] bottom-[20%] flex items-end justify-between">
            {BOX_JARS.map((p, i) => (
              <div key={p.slug} className="w-[30%]" style={{ transform: `rotate(${(i - 1) * 4}deg)` }}>
                <Jar {...p.jar} number={p.number} name={p.name} descriptor={p.descriptor} decorative />
              </div>
            ))}
          </div>
          <div className="absolute inset-x-[12%] bottom-[9%] z-[2] flex h-[38%] flex-col items-center justify-center gap-2.5 bg-peacock text-center text-canvas shadow-[inset_0_14px_0_rgba(38,38,38,0.14)]">
            <span className="mt-2.5">
              <Wordmark size="md" onDark className="!text-[clamp(28px,3.4vw,48px)]" />
            </span>
            <span className="font-serif text-[clamp(24px,2.2vw,32px)] italic tracking-[0.025em]">The Sweet Bee Box</span>
          </div>
          <p className="absolute bottom-2 right-3 text-[11px] text-nero/70">*Placeholder discount, TBD</p>
        </Reveal>
      </div>
    </section>
  );
}
