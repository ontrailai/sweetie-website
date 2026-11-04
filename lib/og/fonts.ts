import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * OG images are generated at build time (static), so the fonts are read from
 * @fontsource packages in node_modules. Satori needs woff/ttf (not woff2).
 */
const dir = (pkg: string) => join(process.cwd(), "node_modules", "@fontsource", pkg, "files");

export async function ogFonts() {
  const [serif, serifItalic, mono] = await Promise.all([
    readFile(join(dir("instrument-serif"), "instrument-serif-latin-400-normal.woff")),
    readFile(join(dir("instrument-serif"), "instrument-serif-latin-400-italic.woff")),
    readFile(join(dir("courier-prime"), "courier-prime-latin-400-normal.woff")),
  ]);
  return [
    { name: "Serif", data: serif, style: "normal" as const, weight: 400 as const },
    { name: "Serif", data: serifItalic, style: "italic" as const, weight: 400 as const },
    { name: "Mono", data: mono, style: "normal" as const, weight: 400 as const },
  ];
}
