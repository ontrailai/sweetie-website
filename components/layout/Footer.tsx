import Link from "next/link";
import { Star } from "@/components/brand/Star";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { SplitText } from "@/components/motion/SplitText";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { HumToggle } from "@/components/fx/HumToggle";
import { PRODUCTS } from "@/lib/catalog";
import { MiniJar } from "@/components/jar/MiniJar";
import { FOOTER_NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="on-dark relative bg-nero text-canvas">
      <VelocityMarquee baseSpeed={60} className="border-b-2 border-canvas/20 pb-4 pt-[clamp(56px,6vw,100px)]" trackClassName="items-center">
        {PRODUCTS.map((p) => (
          <span key={p.slug} className="flex items-center gap-6 pr-6 font-serif text-[clamp(36px,5vw,64px)] italic leading-none">
            <MiniJar look={p.jar} className="h-[0.9em] w-auto -rotate-6" />
            {p.name}
            <Star className="size-[0.5em] text-peacock" />
          </span>
        ))}
      </VelocityMarquee>

      <div className="px-gutter">
        <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-6">
            <p className="t-eyebrow">Sweet Bee Honey · San Diego County</p>
            <p className="max-w-[38ch] text-[15px] leading-[1.7]">
              Raw, small-batch honey in six loud jars, traced back to the hive. Prices, batches, markets and stockists shown on this site are placeholders until launch.
            </p>
            <div className="flex flex-wrap gap-2">
              <MotionToggle className="text-canvas" />
              <HumToggle className="text-canvas" />
            </div>
          </div>
          <nav aria-label="Footer" className="contents">
            <ul className="flex flex-col gap-1 font-serif text-[30px] font-medium leading-tight tracking-[-0.02em]">
              {FOOTER_NAV.slice(0, 5).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1 underline-offset-[6px] transition-transform duration-300 ease-[var(--ease-pop)] hover:translate-x-2 hover:italic hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-1 font-serif text-[30px] font-medium leading-tight tracking-[-0.02em]">
              {FOOTER_NAV.slice(5).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1 underline-offset-[6px] transition-transform duration-300 ease-[var(--ease-pop)] hover:translate-x-2 hover:italic hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                {SITE.instagram.url ? (
                  <a href={SITE.instagram.url} className="inline-block py-1 italic underline-offset-[6px] hover:underline" rel="noopener noreferrer" target="_blank">
                    Instagram
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 py-1 italic">
                    Instagram <span className="tbd-tag">soon</span>
                  </span>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="overflow-hidden px-[2vw]">
        <p className="display buzz select-none whitespace-nowrap pb-[0.12em] text-center text-[clamp(64px,17.5vw,300px)]">
          <SplitText text="Feel the" className="text-canvas" />{" "}
          <em className="text-peacock">
            <SplitText text="hum." start={8} />
          </em>
        </p>
      </div>

      <div className="px-gutter pb-8">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 border-t border-canvas/30 pt-6 text-[13px]">
          <p>
            © {new Date().getFullYear()} {SITE.legalName} · San Diego County
          </p>
          <p>Raw · Local · Traceable · Zero sleepy honey</p>
        </div>
      </div>
    </footer>
  );
}
