import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { SellingPoints } from "@/components/home/SellingPoints";
import { MarqueeBands } from "@/components/sections/MarqueeBands";
import { ShopGrid } from "@/components/sections/ShopGrid";
import { DiscoverySet } from "@/components/product/DiscoverySet";
import { Rituals } from "@/components/sections/Rituals";
import { Subscription } from "@/components/sections/Subscription";
import { Community } from "@/components/sections/Community";
import { SignupSection } from "@/components/sections/SignupSection";
import { Dipper } from "@/components/brand/Illustrations";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SellingPoints />
      <MarqueeBands className="mt-6" />
      <section id="shop" aria-labelledby="shop-h" className="px-gutter scroll-mt-20 py-[clamp(72px,9vw,136px)]">
        <div className="container-x flex flex-col gap-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="shop-h" className="text-[clamp(64px,8.4vw,132px)] leading-[0.9] tracking-[0.015em] text-peacock">
              Six jars. <em>Pick yours.</em>
            </h2>
            <div className="flex flex-col items-end gap-3">
              <Dipper className="float hidden h-[clamp(110px,11vw,160px)] w-auto sm:block" />
              <Link href="/shop" className="btn min-h-[52px] bg-peacock px-6 font-serif text-[24px] tracking-[0.025em] text-canvas">
                Shop all six
              </Link>
            </div>
          </div>
          <ShopGrid />
          <div className="mt-6">
            <DiscoverySet />
          </div>
        </div>
      </section>
      <Rituals />
      <Subscription />
      <Community />
      <SignupSection />
    </>
  );
}
