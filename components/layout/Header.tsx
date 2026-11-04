"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { CartButton } from "@/components/cart/CartButton";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { NAV } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header
      className={`sticky top-0 z-50 bg-canvas/95 backdrop-blur-sm transition-[box-shadow,padding] duration-300 ${
        scrolled ? "py-2.5 shadow-[0_2px_0_0_#262626]" : "py-[18px]"
      }`}
    >
      <div className="px-gutter">
      <nav aria-label="Main" className="container-x flex items-center justify-between gap-6">
        <Link href="/" className="group -my-1 inline-flex items-center py-1 text-nero transition-colors hover:text-peacock">
          <Wordmark size="md" />
        </Link>
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className="nav-link group t-eyebrow relative inline-flex py-3 text-nero transition-colors hover:text-forest"
              >
                {l.label}
                <span aria-hidden="true" className="absolute inset-x-0 bottom-2 h-[2px] origin-left scale-x-0 bg-peacock transition-transform duration-300 group-hover:scale-x-100 group-aria-[current=page]:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <MotionToggle variant="icon" className="hidden text-nero lg:grid" />
          <CartButton />
          <MobileMenu />
        </div>
      </nav>
      </div>
    </header>
  );
}
