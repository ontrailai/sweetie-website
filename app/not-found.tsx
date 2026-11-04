import type { Metadata } from "next";
import Link from "next/link";
import { getProduct } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { Bee } from "@/components/brand/Illustrations";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  const p = getProduct("wildflower")!;
  return (
    <section aria-labelledby="nf-title" className="px-gutter relative overflow-hidden py-[clamp(64px,9vw,140px)]">
      <div className="container-x grid items-center gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-7">
          <p className="t-eyebrow text-forest">Error 404</p>
          <h1 id="nf-title" className="text-[clamp(72px,11vw,176px)] leading-[0.84]">
            Lost the <em className="hum text-peacock">hum.</em>
          </h1>
          <p className="max-w-[44ch] text-base leading-[1.7]">
            This page flew the hive. Let&apos;s get you back to the good stuff.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/shop" className="btn min-h-[60px] bg-peacock px-8 font-serif text-[26px] tracking-[0.025em] text-canvas">
              Shop the jars
            </Link>
            <Link href="/" className="btn min-h-[60px] bg-nero px-7 text-base text-canvas">
              Back home
            </Link>
          </div>
        </div>
        <div className="relative mx-auto h-[clamp(220px,28vw,360px)] w-full max-w-[520px]">
          <div aria-hidden="true" className="absolute bottom-[6%] left-[8%] h-[6%] w-[84%] rounded-[50%] bg-nero/15" />
          {/* A tipped-over jar with a honey puddle */}
          <svg viewBox="0 0 400 120" className="absolute bottom-[4%] left-0 w-[62%]" aria-hidden="true">
            <path d="M10 90 C 60 70, 140 80, 220 86 C 300 92, 380 84, 390 100 C 360 116, 120 118, 20 110 Z" fill="#D9921E" opacity="0.9" />
            <ellipse cx="120" cy="96" rx="40" ry="5" fill="#FFF4C8" opacity="0.4" />
          </svg>
          <div className="absolute bottom-[12%] right-[10%] w-[clamp(60px,8vw,96px)] origin-bottom-right -rotate-[78deg]">
            <Jar {...p.jar} number={p.number} name={p.name} descriptor={p.descriptor} decorative />
          </div>
          <Bee className="bee-fly absolute right-[6%] top-0 w-[clamp(72px,9vw,120px)]" />
        </div>
      </div>
    </section>
  );
}
