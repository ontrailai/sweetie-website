import { PRODUCTS, SIZES } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";

const HEIGHTS: Record<string, number> = { "6oz": 46, "16oz": 74, "32oz": 100 };

/** Three sizes, standing at their relative heights (illustrative). */
export function SizeGuide() {
  const p = PRODUCTS[0]!;
  return (
    <section aria-labelledby="sizes-h" className="on-jade px-gutter relative overflow-hidden bg-jade py-[clamp(80px,10vw,160px)] text-canvas">
      <div className="container-x grid items-end gap-x-16 gap-y-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <h2 id="sizes-h" className="display text-[clamp(72px,9vw,170px)]">
            Pick a <em>size.</em>
          </h2>
          <p className="font-serif text-[clamp(26px,2.4vw,34px)] italic leading-tight">All six jars come in three. Same tall slim jar, more or less honey.</p>
          <span className="chip self-start">Jar heights illustrative</span>
        </div>
        <ul className="flex items-end justify-around gap-4 border-b-4 border-nero pb-0">
          {SIZES.map((s, i) => (
            <li key={s.id} className="rise flex w-[24%] flex-col items-center gap-3" style={{ ["--d" as string]: `${i * 140}ms` }}>
              <div className="relative flex w-full items-end justify-center" style={{ height: "clamp(220px,32vw,460px)" }}>
                <div className="transition-transform duration-500 ease-[var(--ease-pop)] hover:-translate-y-3" style={{ height: `${HEIGHTS[s.id]}%`, aspectRatio: "100 / 318" }}>
                  <Jar {...p.jar} number={p.number} name={p.name} descriptor={p.descriptor} decorative alive={false} />
                </div>
              </div>
              <span className="font-serif text-[clamp(32px,3.4vw,52px)] font-semibold leading-none">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
