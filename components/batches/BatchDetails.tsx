import { batchHoneyLabel, getProduct, type Batch } from "@/lib/catalog";
import { OrTbd, TbdTag } from "@/components/ui/Tbd";

export function BatchHoney({ batch }: { batch: Batch }) {
  const h = batchHoneyLabel(batch);
  return (
    <>
      <OrTbd value={h.base} fallback="Base honey" />
      {h.addition ? ` + ${h.addition}` : ""}
    </>
  );
}

export function BatchCode({ batch }: { batch: Batch }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span>Batch {batch.code}</span>
      {batch.placeholder ? <TbdTag>Placeholder</TbdTag> : null}
    </span>
  );
}

export function BatchDl({ batch, dark = false }: { batch: Batch; dark?: boolean }) {
  const product = getProduct(batch.productSlug);
  const rows: [string, React.ReactNode][] = [
    ["Honey", <BatchHoney key="h" batch={batch} />],
    ["Beekeeper area", <><OrTbd value={batch.area} fallback="Area" />, San Diego County</>],
    ["Harvest", <OrTbd key="hv" value={batch.harvest} fallback="Season, year" />],
    [
      "Status",
      <span key="s" className="inline-flex items-center gap-2">
        <span aria-hidden="true" className={`size-2 rounded-full ${batch.status === "on-shelves" ? "bg-jade" : dark ? "bg-canvas/50" : "bg-nero/40"}`} />
        {batch.status === "on-shelves" ? "On shelves now" : "Past batch"}
      </span>,
    ],
  ];
  return (
    <dl className="flex flex-col text-[15px]" aria-label={product ? `Batch details for No. ${product.number} ${product.name}` : undefined}>
      {rows.map(([k, v]) => (
        <div key={k} className={`flex justify-between gap-4 border-t py-2.5 max-sm:flex-col max-sm:gap-0.5 ${dark ? "border-canvas/30" : "border-nero/20"}`}>
          <dt className="t-eyebrow text-[13px]">{k}</dt>
          <dd className="sm:text-right">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
