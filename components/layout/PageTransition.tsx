"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

/**
 * Plays a peacock "curtain" wipe and a gentle rise whenever the pathname
 * changes. Skipped on the first (server-rendered) page so it never delays
 * LCP and never causes a hydration mismatch.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [prev, setPrev] = useState(pathname);
  const [navigated, setNavigated] = useState(false);
  // "Adjust state while rendering" pattern: flips once the pathname changes.
  if (pathname !== prev) {
    setPrev(pathname);
    setNavigated(true);
  }
  // Keyed by pathname so the CSS entrance animations replay on each page.
  return (
    <TransitionFrame key={pathname} animate={navigated || pathname !== prev}>
      {children}
    </TransitionFrame>
  );
}

function TransitionFrame({ animate, children }: { animate: boolean; children: ReactNode }) {
  return (
    <>
      {animate ? <div className="curtain" aria-hidden="true" /> : null}
      <div className={animate ? "page-enter" : undefined}>{children}</div>
    </>
  );
}
