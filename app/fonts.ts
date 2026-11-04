/**
 * Brand fonts.
 *
 * Instrument Serif stands in for Perfectly Nineties, Courier Prime for
 * Courier Std. To swap in the licensed fonts, drop the files in
 * app/fonts/ and replace each loader with next/font/local, keeping the
 * same `variable` names, e.g.:
 *
 *   import localFont from "next/font/local";
 *   export const heading = localFont({
 *     src: [
 *       { path: "./fonts/PerfectlyNineties-Thin.woff2", weight: "400", style: "normal" },
 *       { path: "./fonts/PerfectlyNineties-ThinItalic.woff2", weight: "400", style: "italic" },
 *     ],
 *     variable: "--font-heading",
 *     display: "swap",
 *   });
 */
import { Courier_Prime, Instrument_Serif } from "next/font/google";

export const heading = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
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
