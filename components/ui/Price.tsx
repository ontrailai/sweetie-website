import type { Price as PriceT } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";
import { TbdTag } from "./Tbd";

/** A price that always flags itself when it's a placeholder. */
export function Price({
  price,
  prefix,
  className = "",
  tagClassName = "",
  tag = "Placeholder price",
}: {
  price: PriceT;
  prefix?: string;
  className?: string;
  tagClassName?: string;
  tag?: string;
}) {
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`}>
      <span>
        {prefix ? `${prefix} ` : null}
        {formatMoney(price.money)}
        {price.placeholder ? <span className="sr-only"> (placeholder price, not final)</span> : null}
      </span>
      {price.placeholder ? (
        <TbdTag className={tagClassName}>
          <span aria-hidden="true">{tag}</span>
        </TbdTag>
      ) : null}
    </span>
  );
}
