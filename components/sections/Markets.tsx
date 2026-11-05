import { MARKETS, STOCKISTS } from "@/lib/site";
import { OrTbd } from "@/components/ui/Tbd";

/** Market schedule as a departure board (Canvas ticket, so small text stays AA). */
export function MarketList({ limit }: { limit?: number }) {
  const rows = typeof limit === "number" ? MARKETS.slice(0, limit) : MARKETS;
  return (
    <div className="ticket p-2 [--notch-y:24px]">
      <ul className="divide-y-2 divide-dashed divide-nero/30">
        {rows.map((m, i) => (
          <li key={i} className="group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-1 rounded-2xl px-4 py-4 transition-colors hover:bg-nero hover:text-canvas sm:grid-cols-[110px_1fr_auto_auto]">
            <span className="grid size-12 place-items-center rounded-full border-2 border-current font-mono text-[12px] font-bold uppercase">
              <OrTbd value={m.day} fallback="Day" />
            </span>
            <span className="font-serif text-[clamp(26px,2.6vw,38px)] font-medium leading-none tracking-[-0.02em]">
              <OrTbd value={m.name} fallback="Market name" />
            </span>
            <span className="text-[14px] max-sm:col-start-2">
              <OrTbd value={m.neighborhood} fallback="Neighborhood" />
            </span>
            <span className="text-[14px] max-sm:col-start-2">
              <OrTbd value={m.time} fallback="Time" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const STOCKIST_BG = ["bg-peacock", "bg-jade", "bg-ladybug"];

export function StockistGrid() {
  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-5">
      {STOCKISTS.map((s, i) => (
        <li
          key={i}
          className={`${STOCKIST_BG[i % STOCKIST_BG.length]} flex min-h-[260px] flex-col justify-between gap-6 rounded-[28px] border-2 border-nero p-6 text-canvas shadow-[6px_6px_0_0_#262626] transition-transform duration-300 ease-[var(--ease-pop)] hover:-rotate-1 hover:-translate-y-1.5`}
          style={{ rotate: `${(i - 1) * 1.5}deg` }}
        >
          <span className="chip self-start">Stockist 0{i + 1}</span>
          <div className="flex flex-col gap-3">
            <span className="font-serif text-[clamp(36px,3.4vw,52px)] font-medium leading-none tracking-[-0.02em]">
              <OrTbd value={s.name} fallback="Shop name" />
            </span>
            <span className="chip self-start normal-case tracking-[0.04em]">
              <OrTbd value={s.neighborhood} fallback="Neighborhood" /> · carries <OrTbd value={s.carries} fallback="which jars" />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
