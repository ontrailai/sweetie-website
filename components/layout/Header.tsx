"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { CartButton } from "@/components/cart/CartButton";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { HumToggle } from "@/components/fx/HumToggle";
import { NAV } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";

/**
 * Floating sticker header: every piece sits on its own Canvas/Nero pill, so
 * it reads on any full-bleed colour underneath. It tucks away while you
 * scroll down and comes back the moment you scroll up (always visible when
 * motion is off or focus is inside it).
 */
export function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setCompact(y > 24);
      const calm = document.documentElement.dataset.motion === "off";
      const focusInside = document.activeElement?.closest("header") != null;
      if (calm || focusInside || y < 160) setHidden(false);
      else if (Math.abs(y - last) > 6) setHidden(y > last);
      last = y;
    };
    const show = () => setHidden(false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("sweetbee:fly", show);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("sweetbee:fly", show);
    };
  }, []);

  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header
      onFocus={() => setHidden(false)}
      className={`px-gutter fixed inset-x-0 top-0 z-50 transition-[transform,padding] duration-500 ease-[var(--ease-out-soft)] ${compact ? "pt-2" : "pt-3 sm:pt-4"} ${
        hidden ? "-translate-y-[130%]" : "translate-y-0"
      }`}
    >
      <nav aria-label="Main" className="container-x flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full border-2 border-nero bg-canvas px-3 py-1 text-nero sm:px-4 shadow-[0_3px_0_0_#262626] transition-transform duration-300 ease-[var(--ease-pop)] hover:-rotate-3"
        >
          <Wordmark size="sm" />
        </Link>
        <ul className="hidden items-center gap-1 rounded-full border-2 border-nero bg-canvas p-1 shadow-[0_3px_0_0_#262626] lg:flex">
          {NAV.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className="relative inline-flex min-h-10 items-center rounded-full px-4 font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-nero decoration-peacock decoration-[3px] underline-offset-[6px] transition-colors hover:underline aria-[current=page]:bg-nero aria-[current=page]:text-canvas"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <MotionToggle variant="icon" className="border-nero bg-canvas text-nero shadow-[0_3px_0_0_#262626]" />
            <HumToggle compact className="border-nero bg-canvas px-3 text-nero shadow-[0_3px_0_0_#262626]" />
          </div>
          <CartButton className="shadow-[0_3px_0_0_#ff007c]" />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
