import type { Metadata } from "next";
import Link from "next/link";
import { ShopFilter } from "@/components/product/ShopFilter";
import { DiscoverySet } from "@/components/product/DiscoverySet";
import { SizeGuide } from "@/components/product/SizeGuide";
import { MarqueeBands } from "@/components/sections/MarqueeBands";
import { Star } from "@/components/brand/Star";
import { SUBSCRIPTION } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop the jars",
  description: "Six jars of raw San Diego County honey, No. 01 to No. 06, in 6, 16 and 32 oz. Plus the Discovery Set.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      <section aria-labelledby="shop-title" className="px-gutter pb-16 pt-[clamp(40px,6vw,88px)]">
        <div className="container-x flex flex-col gap-14">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="flex flex-col gap-5">
              <p className="t-eyebrow fade-up text-forest">The shop · No. 01 – No. 06</p>
              <h1 id="shop-title" className="text-[clamp(72px,11vw,176px)] leading-[0.85] tracking-[0.01em] text-peacock">
                <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                  <span className="rise-in">Six jars.</span>
                </span>{" "}
                <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                  <em className="rise-in [animation-delay:0.1s]">Pick yours.</em>
                </span>
              </h1>
            </div>
            <p className="fade-up max-w-[420px] text-base leading-[1.7] [animation-delay:0.25s]">
              Two everyday honeys, two infused, one for wellness and one to turn it up. Raw, small batch and traceable to the hive.
            </p>
          </div>
          <ShopFilter />
        </div>
      </section>
      <MarqueeBands />
      <section aria-label="Discovery Set" className="px-gutter py-[clamp(56px,7vw,112px)]">
        <div className="container-x">
          <DiscoverySet headingLevel={2} />
        </div>
      </section>
      <SizeGuide />
      <section aria-labelledby="sub-band" className="on-pink px-gutter bg-peacock py-16 text-canvas">
        <div className="container-x flex flex-wrap items-center justify-between gap-8">
          <h2 id="sub-band" className="flex items-center gap-4 text-[clamp(40px,5vw,72px)] leading-none">
            <Star className="spin-slow size-[0.7em] shrink-0" />
            Subscribe &amp; save {SUBSCRIPTION.discountPercent}%<span className="text-[max(24px,0.4em)]">*</span>
          </h2>
          <div className="flex flex-col items-start gap-2">
            <Link href="/#subscribe" className="btn bg-canvas px-7 py-2 font-serif text-[26px] tracking-[0.025em] text-peacock">
              How the box works
            </Link>
            <span className="bg-canvas px-2 py-0.5 text-[13px] text-nero">*Placeholder discount, to be confirmed.</span>
          </div>
        </div>
      </section>
    </>
  );
}
