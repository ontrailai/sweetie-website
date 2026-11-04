import { Bee, Honeycomb } from "@/components/brand/Illustrations";
import { Reveal } from "@/components/motion/Reveal";

const POINTS = [
  { lead: "Raw", em: "& unprocessed", body: "Unprocessed honey from local hives. Infused jars add only what is on the label." },
  { lead: "Traceable", em: "to the hive", body: "Scan any jar to see its batch, beekeeper area and harvest." },
  { lead: "Small", em: "batch", body: "Bottled in small runs, one batch at a time." },
  { lead: "San Diego", em: "County", body: "Sourced from local beekeepers across the county." },
];

export function SellingPoints() {
  return (
    <section aria-label="Why Sweet Bee" className="px-gutter relative pt-[clamp(110px,10vw,150px)]">
      <Bee className="bee-fly absolute right-[clamp(20px,6vw,96px)] top-[clamp(40px,5vw,72px)] w-[clamp(64px,6vw,96px)]" />
      <Honeycomb className="absolute left-[clamp(12px,3vw,40px)] top-[clamp(64px,7vw,96px)] hidden w-16 opacity-25 md:block" />
      <ul className="container-x grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-x-8">
        {POINTS.map((p, i) => (
          <Reveal as="li" key={p.lead} delay={i * 0.08} className="group relative flex flex-col gap-1.5 py-[22px]">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-nero" />
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-peacock transition-transform duration-500 group-hover:scale-x-100" />
            <span className="font-mono text-[13px] text-forest">0{i + 1}</span>
            <h2 className="text-[clamp(26px,2.4vw,34px)] leading-[1.05]">
              {p.lead} <em>{p.em}</em>
            </h2>
            <p className="text-[15px] leading-[1.55]">{p.body}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
