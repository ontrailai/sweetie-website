"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type FormEvent } from "react";
import { Bee } from "@/components/brand/Illustrations";
import { Star } from "@/components/brand/Star";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** UI-only signup: validates on the client, never sends anything. */
export function EmailSignup({ className = "" }: { className?: string }) {
  const id = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return setError("Add your email address first.");
    if (!EMAIL.test(v)) return setError("That email doesn't look quite right. Try again?");
    setError(null);
    // TODO(email): connect to the email provider (Klaviyo / Shopify Email) here.
    setDone(true);
  };

  return (
    <div className={`ticket relative p-7 [--notch-y:40%] ${className}`}>
      <Bee className="float absolute -top-14 right-5 w-[clamp(84px,9vw,120px)]" />
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div key="done" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[156px] flex-col justify-center gap-3">
            <Star className="spin-slow size-10 text-peacock" />
            <p className="display text-[56px]">
              You&apos;re <em className="text-peacock">in.</em>
            </p>
            <p className="text-[15px] leading-normal">Watch your inbox for the hum. (Sign-up isn&apos;t live yet, so nothing was sent.)</p>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0, y: -12 }} className="flex flex-col gap-3">
            <label htmlFor={`${id}-email`} className="t-eyebrow">
              Email address
            </label>
            <div className="flex flex-wrap gap-3">
              <input
                id={`${id}-email`}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError(null);
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={`${id}-hint${error ? ` ${id}-err` : ""}`}
                className="min-h-[56px] min-w-0 flex-[1_1_200px] rounded-full border-2 border-nero bg-white px-5 font-mono text-base text-nero placeholder:text-nero/60 aria-[invalid]:border-ladybug"
              />
              <button type="submit" className="btn min-h-[56px] bg-nero text-canvas">
                I&apos;m in
              </button>
            </div>
            <p id={`${id}-err`} aria-live="assertive" className="min-h-[1.2em] text-[15px] font-bold text-nero">
              {error ? <span aria-hidden="true" className="mr-1.5 text-ladybug">✶</span> : null}
              {error}
            </p>
            <p id={`${id}-hint`} className="text-[15px] leading-normal">
              New jars and launches, first. Unsubscribe anytime.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
