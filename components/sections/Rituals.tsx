import type { ReactNode } from "react";
import { Sun, Sunset, Wave, Dipper } from "@/components/brand/Illustrations";
import { Reveal } from "@/components/motion/Reveal";
import type { Ritual } from "@/lib/catalog";

const BG = ["bg-peacock on-pink", "bg-nero on-dark", "bg-forest on-dark"];
const ART: ReactNode[] = [
  <Sun key="sun" className="w-20" />,
  <Wave key="wave" className="w-24" />,
  <Sunset key="sunset" className="w-24" />,
];

export const HOME_RITUALS: Ritual[] = [
  { time: "6 AM", title: "The sunrise spoonful", body: "Straight off the spoon before the surf check, or into cold brew on the way out." },
  { time: "9 AM", title: "Before the paddle out", body: "No. 06 Guarana + Salt comes along for the paddle out, the bluff run, the long beach walk." },
  { time: "6 PM", title: "Golden hour", body: "No. 03 Vanilla Bean or No. 04 Cinnamon, stirred into something warm as the sun drops." },
];

export function Rituals({
  rituals = HOME_RITUALS,
  title = (
    <>
      Sunrise <em>to golden hour.</em>
    </>
  ),
  id = "ritual-h",
}: {
  rituals?: Ritual[];
  title?: ReactNode;
  id?: string;
}) {
  return (
    <section aria-labelledby={id} className="px-gutter pb-[clamp(72px,9vw,136px)]">
      <div className="container-x flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id={id} className="text-[clamp(40px,4.4vw,64px)] leading-none tracking-[0.02em]">
            {title}
          </h2>
          <Dipper className="float h-[clamp(110px,11vw,170px)] w-auto" />
        </div>
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-4">
          {rituals.map((r, i) => (
            <Reveal
              as="li"
              key={r.time + r.title}
              delay={i * 0.1}
              className={`group relative flex min-h-[360px] flex-col justify-between gap-10 overflow-hidden p-[clamp(28px,3vw,44px)] text-canvas transition-transform duration-300 ease-[var(--ease-pop)] hover:-translate-y-1.5 ${BG[i % 3]}`}
            >
              <div className="absolute right-6 top-6 opacity-90 transition-transform duration-700 ease-[var(--ease-pop)] group-hover:-rotate-12 group-hover:scale-110" aria-hidden="true">
                {ART[i % 3]}
              </div>
              <span className="font-serif text-[clamp(72px,8vw,120px)] leading-[0.9] tracking-[0.025em]">{r.time}</span>
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[36px] leading-[1.05]">{r.title}</h3>
                <p className="font-serif text-[24px] italic leading-[1.3] tracking-[0.025em]">{r.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
