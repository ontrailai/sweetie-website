/**
 * Brand fonts (self-hosted at build time by next/font).
 *
 * Display: Fraunces, a variable "wonky" serif. Its axes (wght 100–900,
 * opsz 9–144, SOFT 0–100, WONK 0–1) are what make the kinetic type work:
 * headlines inflate, soften and "hum" by animating font-variation-settings
 * instead of swapping fonts. It stands in for Perfectly Nineties.
 *
 * Body: Courier Prime, standing in for Courier Std.
 *
 * To swap in licensed fonts, replace a loader with next/font/local and keep
 * the same `variable` names (--font-heading, --font-body), e.g.:
 *
 *   import localFont from "next/font/local";
 *   export const heading = localFont({
 *     src: [
 *       { path: "./fonts/PerfectlyNineties-Regular.woff2", weight: "400", style: "normal" },
 *       { path: "./fonts/PerfectlyNineties-Italic.woff2", weight: "400", style: "italic" },
 *     ],
 *     variable: "--font-heading",
 *     display: "swap",
 *   });
 *
 * (A static font simply ignores the variation axes; nothing breaks.)
 */
import { Courier_Prime, Fraunces } from "next/font/google";

export const heading = Fraunces({
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const body = Courier_Prime({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
