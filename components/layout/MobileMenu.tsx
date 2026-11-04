"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Wordmark } from "@/components/brand/Wordmark";
import { Bee } from "@/components/brand/Illustrations";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { NAV, SITE } from "@/lib/site";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { useScrollLock } from "@/lib/hooks/useScrollLock";

const noopSubscribe = () => () => {};

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  // Portal target only exists on the client.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const close = useCallback(() => setOpen(false), []);

  useFocusTrap(panelRef, open, close);
  useScrollLock(open);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="t-eyebrow inline-flex min-h-11 items-center border-2 border-nero px-[18px] lg:hidden"
      >
        Menu
      </button>
      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  id="mobile-menu"
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Menu"
                  className="on-pink fixed inset-0 z-[75] flex flex-col overflow-y-auto bg-peacock text-canvas lg:hidden"
                  initial={{ clipPath: "circle(0% at 100% 0%)" }}
                  animate={{ clipPath: "circle(150% at 100% 0%)" }}
                  exit={{ clipPath: "circle(0% at 100% 0%)" }}
                  transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }}
                >
                  <div className="px-gutter flex items-center justify-between py-[18px]">
                    <Link href="/" onClick={close} aria-label="Sweet Bee home" className="text-canvas">
                      <Wordmark size="md" onDark />
                    </Link>
                    <button type="button" onClick={close} className="t-eyebrow inline-flex min-h-11 items-center border-2 border-canvas px-[18px]">
                      Close
                    </button>
                  </div>
                  <nav aria-label="Mobile" className="px-gutter flex flex-1 flex-col justify-center py-8">
                    <ul className="flex flex-col">
                      {NAV.map((l, i) => (
                        <motion.li
                          key={l.href}
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.2, 0.9, 0.3, 1] }}
                          className="border-b-2 border-canvas/40 first:border-t-2"
                        >
                          <Link
                            href={l.href}
                            onClick={close}
                            aria-current={pathname === l.href ? "page" : undefined}
                            className="group flex items-baseline justify-between py-3 font-serif text-[56px] leading-none tracking-[0.025em]"
                          >
                            <span className="transition-transform duration-300 group-hover:translate-x-2 group-aria-[current=page]:italic">{l.label}</span>
                            <span className="font-mono text-[13px] tracking-[0.075em]">0{i + 1}</span>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </nav>
                  <div className="px-gutter flex flex-wrap items-end justify-between gap-6 pb-8">
                    <div className="flex flex-col gap-3">
                      <MotionToggle />
                      <p className="font-serif text-[24px] italic">{SITE.tagline}</p>
                    </div>
                    <Bee className="bee-fly w-24" />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
