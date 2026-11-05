import type { Metadata } from "next";
import Link from "next/link";
import { getProduct } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { SplitText } from "@/components/motion/SplitText";
import { Magnetic } from "@/components/motion/Magnetic";
import { HumBee } from "@/components/fx/HumBee";
import { HoneyDrip } from "@/components/fx/HoneyDrip";

export const metadata: Metadata = { title: "Page not found" };

/** The "0": a jar lid that rolled off. */
function Lid() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="inline-block h-[0.74em] w-[0.74em] align-baseline">
      <g className="spin-slow" style={{ transformOrigin: "50px 50px", animationDuration: "6s" }}>
        <circle cx="50" cy="50" r="46" fill="#262626" stroke="#f6eddd" strokeWidth="3" />
        {Array.from({ length: 48 }, (_, i) => (
          <line key={i} x1="50" y1="5" x2="50" y2="13" stroke="#f6eddd" strokeOpacity="0.35" strokeWidth="1.5" transform={`rotate(${i * 7.5} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="28" fill="none" stroke="#f6eddd" strokeOpacity="0.25" strokeWidth="2" />
        <text x="50" y="58" textAnchor="middle" fontSize="22" fill="#f6eddd" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
          SB
        </text>
      </g>
    </svg>
  );
}

export default function NotFound() {
  const p = getProduct("guarana-salt")!;
  return (
    <section aria-labelledby="nf-title" className="on-pink relative z-10 bg-peacock text-canvas">
      <div className="pt-header px-gutter relative isolate min-h-[100svh] overflow-hidden pb-[clamp(72px,8vw,120px)]">
        <HumBee perch={{ x: 0.6, y: 0.18 }} />
        <div className="container-x grid items-end gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-7">
            <p aria-hidden="true" className="display whitespace-nowrap text-[clamp(120px,22vw,400px)] leading-[0.8] tracking-[-0.06em]">
              4<Lid />4
            </p>
            <h1 id="nf-title" className="display -mt-[0.2em] text-[clamp(64px,8vw,150px)]">
              <SplitText text="Lost the" mode="load" /> <em className="buzz inline-block text-nero"><SplitText text="hum." mode="load" start={7} /></em>
            </h1>
            <p className="ticket max-w-[440px] p-5 text-[15px] leading-[1.7] [--notch-y:50%]">
              This page flew the hive (error 404). The jar tipped, the lid rolled off and the bee is looking for it too. Let&apos;s get you back to the good stuff.
            </p>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <Link href="/shop" className="btn min-h-[60px] bg-nero px-8 text-[26px] text-canvas">
                  Shop the jars
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/" className="btn min-h-[60px] bg-canvas px-8 text-[26px] text-nero">
                  Back home
                </Link>
              </Magnetic>
              <Link href="/batches" className="btn btn-sm self-center bg-canvas text-nero">
                Scan a jar instead
              </Link>
            </div>
          </div>
          {/* the tipped jar and its puddle */}
          <div aria-hidden="true" className="relative mx-auto h-[clamp(240px,30vw,420px)] w-full max-w-[560px]">
            <svg viewBox="0 0 400 120" className="absolute bottom-[2%] left-0 w-[78%]">
              <path d="M10 92 C 60 64, 140 78, 220 84 C 300 90, 380 80, 392 98 C 360 118, 120 120, 18 110 Z" fill={p.jar.honey} stroke="#262626" strokeWidth="3" />
              <ellipse cx="120" cy="94" rx="46" ry="6" fill="#fff4c8" opacity="0.5" />
            </svg>
            <div className="absolute bottom-[12%] right-[6%] w-[clamp(70px,9vw,120px)] origin-bottom-right -rotate-[80deg]">
              <div className="wiggle origin-bottom" style={{ animationDuration: "4s" }}>
                <Jar {...p.jar} number={p.number} name={p.name} descriptor={p.descriptor} decorative alive={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <HoneyDrip color="#ff007c" className="absolute inset-x-0 top-[calc(100%-2px)] h-[clamp(36px,5vw,80px)]" />
    </section>
  );
}
