import { MARKETS, STOCKISTS } from "@/lib/site";
import { OrTbd } from "@/components/ui/Tbd";

export function MarketList({ limit }: { limit?: number }) {
  const rows = typeof limit === "number" ? MARKETS.slice(0, limit) : MARKETS;
  return (
    <ul className="border-t-2 border-nero">
      {rows.map((m, i) => (
        <li
          key={i}
          className="flex flex-wrap items-baseline gap-x-8 gap-y-1.5 border-b border-nero/25 py-[22px] transition-[background-color,padding,color] duration-200 hover:bg-peacock hover:px-5 hover:text-canvas"
        >
          <span className="t-eyebrow flex-[0_0_120px] text-[16px]">
            <OrTbd value={m.day} fallback="Day" />
          </span>
          <span className="flex-[1_1_260px] font-serif text-[clamp(30px,3vw,40px)] leading-none tracking-[0.025em]">
            <OrTbd value={m.name} fallback="Market name" />
          </span>
          <span className="flex-[0_1_200px] text-[15px]">
            <OrTbd value={m.neighborhood} fallback="Neighborhood" />
          </span>
          <span className="flex-[0_0_auto] text-[15px]">
            <OrTbd value={m.time} fallback="Time" />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function StockistGrid() {
  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4">
      {STOCKISTS.map((s, i) => (
        <li key={i} className="flex min-h-[200px] flex-col justify-between gap-6 border-2 border-nero p-6 transition-transform duration-300 ease-[var(--ease-pop)] hover:-translate-y-1.5">
          <span className="font-mono text-[13px] text-forest">Stockist 0{i + 1}</span>
          <div className="flex flex-col gap-2">
            <span className="font-serif text-[34px] leading-none tracking-[0.025em]">
              <OrTbd value={s.name} fallback="Shop name" />
            </span>
            <span className="text-[15px]">
              <OrTbd value={s.neighborhood} fallback="Neighborhood" />
            </span>
            <span className="text-[13px] text-forest">
              Carries: <OrTbd value={s.carries} fallback="Which jars" />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
