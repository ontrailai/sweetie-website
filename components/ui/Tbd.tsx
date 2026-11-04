import type { ReactNode } from "react";

/** Inline placeholder for content that isn't confirmed yet. */
export function Tbd({ children, label = "Placeholder, to be confirmed" }: { children: ReactNode; label?: string }) {
  return (
    <span className="tbd" title={label}>
      {children}
    </span>
  );
}

/** Renders the value, or a visibly flagged placeholder when it's null. */
export function OrTbd({ value, fallback }: { value: string | null | undefined; fallback: string }) {
  return value ? <>{value}</> : <Tbd>{fallback}</Tbd>;
}

export function TbdTag({ children = "Placeholder", className = "" }: { children?: ReactNode; className?: string }) {
  return <span className={`tbd-tag ${className}`}>{children}</span>;
}
