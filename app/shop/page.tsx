import type { Metadata } from "next";
import Link from "next/link";
import { ShopFilter } from "@/components/product/ShopFilter";
import { SizeGuide } from "@/components/product/SizeGuide";
import { DiscoveryDrop } from "@/components/home/DiscoveryDrop";
import { MarqueeBands } from "@/components/home/MarqueeBands";
import { SplitText } from "@/components/motion/SplitText";
import { Magnetic } from "@/components/motion/Magnetic";
import { RoundSticker } from "@/components/fx/Sticker";
import { HoneyDrip } from "@/components/fx/HoneyDrip";
import { SUBSCRIPTION } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop the jars",
  description: "Six jars of raw San Diego County honey, No. 01 to No. 06, in 6, 16 and 32 oz. Plus the Discovery Set.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      <section aria-labelledby="shop-title" className="pt-header px-gutter relative overflow-hidden bg-canvas pb-[clamp(64px,8vw,120px)]">
        <div className="container-x flex flex-col gap-12">
          <div className="relative flex flex-col gap-4">
            <p className="t-eyebrow">The shop · No. 01 – No. 06 · placeholder prices</p>
            <h1 id="shop-title" className="display pb-[0.14em] text-[clamp(96px,17vw,320px)]">
              <SplitText text="Six jars." mode="load" />
              <br />
              <em className="text-peacock">
                <SplitText text="Pick yours." mode="load" start={8} delay={120} />
              </em>
            </h1>
            <RoundSticker
              text="ZERO SLEEPY HONEY · RAW · LOCAL · "
              bg="#308f32"
              ink="#f6eddd"
              className="absolute right-0 top-4 w-[clamp(100px,12vw,180px)] max-md:hidden"
              center={<span className="font-serif text-[clamp(30px,3vw,48px)] font-bold italic leading-none text-canvas">×6</span>}
            />
            <p className="max-w-[52ch] text-[16px] leading-[1.7]">
              Two everyday honeys, two infused, one for wellness and one to turn it up. Raw, small batch and traceable to the hive. Tap a jar for the full story, or quick-add from here.
            </p>
          </div>
          <ShopFilter />
        </div>
      </section>
      <MarqueeBands className="bg-canvas" />
      <DiscoveryDrop />
      <SizeGuide />
      <section aria-labelledby="sub-band" className="on-dark px-gutter relative z-[1] bg-forest py-[clamp(64px,8vw,120px)] text-canvas">
        <div className="container-x flex flex-wrap items-center justify-between gap-10">
          <h2 id="sub-band" className="display text-[clamp(56px,7vw,130px)]">
            Subscribe &amp; <em>save {SUBSCRIPTION.discountPercent}%*</em>
          </h2>
          <div className="flex flex-col items-start gap-3">
            <Magnetic>
              <Link href="/#subscribe" className="btn min-h-[60px] bg-canvas px-8 text-[26px] text-nero">
                How the box works
              </Link>
            </Magnetic>
            <span className="text-[13px]">*Placeholder discount, to be confirmed.</span>
          </div>
        </div>
        <HoneyDrip color="#004832" className="absolute inset-x-0 top-[calc(100%-2px)] h-[clamp(36px,5vw,80px)]" />
      </section>
    </>
  );
}
