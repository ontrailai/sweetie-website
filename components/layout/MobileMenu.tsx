"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Wordmark } from "@/components/brand/Wordmark";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { useMotionPref } from "@/components/motion/MotionPreference";
import { HumToggle } from "@/components/fx/HumToggle";
import { NAV, SITE } from "@/lib/site";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { useScrollLock } from "@/lib/hooks/useScrollLock";

const noopSubscribe = () => () => {};
const INSTANT = { duration: 0 } as const;

/** Each link is a full-bleed colour band; text colours keep AA at ≥24px. */
const BANDS = [
  "bg-peacock text-canvas",
  "bg-jade text-canvas",
  "bg-forest text-canvas",
  "bg-canvas text-nero",
  "bg-ladybug text-canvas",
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const close = useCallback(() => setOpen(false), []);
  const { enabled: motionOn } = useMotionPref();

  useFocusTrap(panelRef, open, close, undefined, toggleRef);
  useScrollLock(open);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-nero bg-canvas px-4 font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-nero shadow-[0_3px_0_0_#262626] lg:hidden"
      >
        <svg aria-hidden="true" width="16" height="12" viewBox="0 0 16 12">
          <path d="M0 1h16M0 6h11M0 11h16" stroke="currentColor" strokeWidth="2" />
        </svg>
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
                  data-lenis-prevent=""
                  className="on-dark fixed inset-0 z-[75] flex flex-col overflow-y-auto bg-nero text-canvas lg:hidden"
                  initial={motionOn ? { clipPath: "inset(0 0 100% 0 round 0 0 40px 40px)" } : false}
                  animate={{ clipPath: "inset(0 0 0% 0 round 0 0 0px 0px)" }}
                  exit={motionOn ? { clipPath: "inset(0 0 100% 0 round 0 0 40px 40px)" } : { opacity: 0 }}
                  transition={motionOn ? { duration: 0.6, ease: [0.7, 0, 0.2, 1] } : INSTANT}
                >
                  <div className="px-gutter flex items-center justify-between pb-4 pt-3">
                    <Link href="/" onClick={close} className="inline-flex min-h-11 items-center rounded-full border-2 border-nero bg-canvas px-4 text-nero">
                      <Wordmark size="sm" />
                    </Link>
                    <button
                      type="button"
                      onClick={close}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-canvas bg-canvas px-4 font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-nero"
                    >
                      Close <span aria-hidden="true">✕</span>
                    </button>
                  </div>
                  <nav aria-label="Mobile" className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col">
                      {NAV.map((l, i) => (
                        <motion.li
                          key={l.href}
                          className={`flex flex-1 ${BANDS[i % BANDS.length]}`}
                          initial={motionOn ? { x: i % 2 ? "-100%" : "100%" } : false}
                          animate={{ x: 0 }}
                          transition={motionOn ? { delay: 0.18 + i * 0.06, duration: 0.6, ease: [0.2, 0.9, 0.3, 1] } : INSTANT}
                        >
                          <Link
                            href={l.href}
                            onClick={close}
                            aria-current={pathname === l.href ? "page" : undefined}
                            className="px-gutter flex min-h-[72px] w-full items-center justify-between gap-4 font-serif text-[clamp(48px,15vw,96px)] font-medium italic leading-none tracking-[-0.03em] [font-variation-settings:'opsz'_144,'SOFT'_100,'WONK'_1]"
                          >
                            {l.label}
                            <span className="chip shrink-0 not-italic" aria-hidden="true">
                              0{i + 1}
                            </span>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </nav>
                  <div className="px-gutter flex flex-wrap items-center justify-between gap-3 pb-[max(20px,env(safe-area-inset-bottom))] pt-5">
                    <div className="flex flex-wrap gap-2">
                      <MotionToggle className="text-canvas" />
                      <HumToggle className="text-canvas" />
                    </div>
                    <p className="font-serif text-[26px] italic">{SITE.tagline}</p>
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
