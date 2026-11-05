import type { CSSProperties, ElementType } from "react";

/**
 * Letter-by-letter kinetic text. Server-renderable: the sentence is real
 * (sr-only) text for assistive tech and search; the animated letters are
 * aria-hidden. Words never break mid-word.
 *
 * mode="load"  plays on first paint (transform only, so a headline stays LCP)
 * mode="view"  pops in when scrolled into view (via <RevealObserver>)
 */
export function SplitText({
  text,
  as: Tag = "span",
  mode = "view",
  start = 0,
  delay = 0,
  className = "",
  buzz = false,
}: {
  text: string;
  as?: ElementType;
  mode?: "load" | "view";
  /** Index offset so several SplitTexts can share one stagger. */
  start?: number;
  /** ms */
  delay?: number;
  className?: string;
  /** Letters buzz on hover. */
  buzz?: boolean;
}) {
  let i = start;
  const words = text.split(" ");
  return (
    <Tag className={`${mode === "load" ? "split-load" : "split"} ${buzz ? "buzz" : ""} ${className}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="inline-block whitespace-nowrap">
              {Array.from(w).map((c, ci) => (
                <span key={ci} className="ch" style={{ "--i": i++ } as CSSProperties}>
                  {c}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
