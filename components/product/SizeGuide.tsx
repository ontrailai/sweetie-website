import { SIZES, getProduct } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { Reveal } from "@/components/motion/Reveal";

const SCALE: Record<string, number> = { "6oz": 0.58, "16oz": 0.8, "32oz": 1 };
const USE: Record<string, string> = {
  "6oz": "A first taste, a gift, a bag-sized jar.",
  "16oz": "The everyday jar. Our most-picked size.",
  "32oz": "For the daily-spoonful household.",
};

export function SizeGuide() {
  const p = getProduct("wildflower")!;
  return (
    <section aria-labelledby="sizes-h" className="on-dark px-gutter bg-nero py-[clamp(72px,9vw,128px)] text-canvas">
      <div className="container-x flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="sizes-h" className="text-[clamp(52px,6.4vw,100px)] leading-[0.9]">
            Three sizes, <em className="text-peacock">one tall jar.</em>
          </h2>
          <p className="max-w-[360px] text-[15px] leading-[1.7]">6 oz, 16 oz and 32 oz, all in the tall slim jar. Illustration, not to scale.</p>
        </div>
        <ol className="grid grid-cols-3 items-end gap-4 sm:gap-10">
          {SIZES.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 0.1} className="flex flex-col items-center gap-5 text-center">
              <div className="flex h-[clamp(240px,34vw,480px)] w-full items-end justify-center">
                <div className="transition-transform duration-500 ease-[var(--ease-pop)] hover:-translate-y-3" style={{ width: `${SCALE[s.id]! * 32}%`, minWidth: 44 }}>
                  <Jar {...p.jar} number={p.number} name={p.name} descriptor={p.descriptor} decorative />
                </div>
              </div>
              <span className="font-serif text-[clamp(36px,4vw,60px)] leading-none">{s.label}</span>
              <span className="max-w-[24ch] text-[13px] leading-normal sm:text-[15px]">{USE[s.id]}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
