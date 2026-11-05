"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab / Shift+Tab inside `ref` while active, closes on Escape, moves
 * focus in on open and restores it to the previously focused element on close.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape: () => void,
  initialFocus?: RefObject<HTMLElement | null>,
  /** Fallback for focus on close when nothing useful was focused on open (e.g. Safari clicks). */
  returnFocus?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!active) return;
    const root = ref.current;
    if (!root) return;
    const previous = document.activeElement as HTMLElement | null;
    const fallback = returnFocus?.current ?? null;

    const focusables = () =>
      Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("inert") && el.getClientRects().length > 0,
      );

    const raf = requestAnimationFrame(() => {
      (initialFocus?.current ?? focusables()[0] ?? root).focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const current = document.activeElement;
      if (e.shiftKey && (current === first || !root.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !root.contains(current))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      const usable = (el: HTMLElement | null | undefined): el is HTMLElement => !!el && el !== document.body && document.contains(el);
      const target = usable(previous) ? previous : fallback;
      if (usable(target)) target.focus({ preventScroll: true });
    };
  }, [active, ref, onEscape, initialFocus, returnFocus]);
}
