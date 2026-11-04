import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { Star } from "@/components/brand/Star";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { FOOTER_NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="on-pink overflow-hidden bg-peacock text-canvas">
      <div className="px-gutter">
      <div className="container-x flex flex-col gap-12 pb-10 pt-14">
        <div className="flex flex-wrap items-start justify-between gap-12">
          <Link href="/" aria-label="Sweet Bee home" className="text-canvas">
            <Wordmark size="lg" onDark />
          </Link>
          <nav aria-label="Footer">
            <ul className="flex max-w-[720px] flex-wrap gap-x-10 gap-y-2 font-serif text-[26px] tracking-[0.025em]">
              {FOOTER_NAV.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1.5 underline-offset-[6px] hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                {SITE.instagram.url ? (
                  <a href={SITE.instagram.url} className="inline-block py-1.5 italic underline-offset-[6px] hover:underline" rel="noopener noreferrer" target="_blank">
                    Instagram
                  </a>
                ) : (
                  <span className="inline-block py-1.5 italic opacity-80" title="Instagram link coming soon">
                    Instagram <span className="tbd-tag">soon</span>
                  </span>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
      </div>
      <div aria-hidden="true" className="marquee overflow-hidden">
        <div className="marquee-track flex w-max font-serif text-[15.5vw] leading-[0.9] tracking-[-0.005em]" style={{ animationDuration: "40s" }}>
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="inline-flex items-center gap-[0.3em] pr-[0.3em] whitespace-nowrap">
              <span>
                Feel the <em>hum.</em>
              </span>
              <Star className="size-[0.5em]" />
            </span>
          ))}
        </div>
      </div>
      <div className="px-gutter pb-10">
        <div className="container-x">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-canvas/50 pt-6">
          <p className="font-serif text-[24px] tracking-[0.025em]">
            © {new Date().getFullYear()} {SITE.name} · <em>San Diego County</em>
          </p>
          <MotionToggle />
        </div>
        </div>
      </div>
    </footer>
  );
}
