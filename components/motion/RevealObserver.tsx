"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = ".split:not(.is-in), .rise:not(.is-in), [data-inview]:not(.is-in)";

/**
 * One IntersectionObserver for the whole site. Server-rendered elements opt
 * in with a class (.split, .rise) or [data-inview]; when they scroll into
 * view they get .is-in, which starts their CSS entrance. When motion is off
 * the CSS rules simply never animate, so content is always visible.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    const scan = () => document.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}
