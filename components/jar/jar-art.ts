/**
 * Pure helpers for the Sweet Bee jar SVG — deterministic, so server and
 * client renders are identical (no hydration mismatches).
 * Ported from mockup/Jar.dc.html (same seeds, same speck recipes).
 */
import type { SpeckKind } from "@/lib/catalog";

export function mix(hex: string, to: string, amt: number): string {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const t = to.replace("#", "");
  let out = "#";
  for (let i = 0; i < 3; i++) {
    const a = parseInt(h.substr(i * 2, 2), 16);
    const b = parseInt(t.substr(i * 2, 2), 16);
    out += Math.round(a + (b - a) * amt).toString(16).padStart(2, "0");
  }
  return out;
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const c = [0, 2, 4].map((i) => {
    const v = parseInt(h.substr(i, 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
}

/** Nero on light labels, Canvas on everything else (matches the mockup). */
export function labelTextFor(labelColor: string): string {
  return luminance(labelColor) > 0.5 ? "#262626" : "#F6EDDD";
}

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export interface Speck {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number;
  fill: string;
  opacity: number;
}

const KINDS: Record<Exclude<SpeckKind, "none">, { n: number; colors: string[]; min: number; max: number; round: boolean }> = {
  vanilla: { n: 70, colors: ["rgba(28,14,6,0.85)", "rgba(45,22,8,0.7)"], min: 0.35, max: 0.9, round: false },
  cinnamon: { n: 55, colors: ["rgba(96,40,10,0.6)", "rgba(130,60,18,0.5)"], min: 0.5, max: 1.4, round: false },
  pollen: { n: 34, colors: ["rgba(255,178,36,0.95)", "rgba(236,128,18,0.9)", "rgba(255,205,80,0.9)"], min: 1.1, max: 2.2, round: true },
  salt: { n: 30, colors: ["rgba(255,255,255,0.8)", "rgba(255,255,255,0.55)"], min: 0.5, max: 1.1, round: false },
};

/** Specks positioned inside the honey box (x, y, w, h in viewBox units). */
export function makeSpecks(kind: SpeckKind, num: string, box: { x: number; y: number; w: number; h: number }): Speck[] {
  if (kind === "none") return [];
  const k = KINDS[kind];
  const rnd = lcg(7 + parseInt(num, 10) * 131);
  const out: Speck[] = [];
  for (let i = 0; i < k.n; i++) {
    const w = k.min + rnd() * (k.max - k.min);
    const h = k.round ? w * (0.8 + rnd() * 0.3) : w * (0.35 + rnd() * 0.5);
    const left = (3 + rnd() * 92) / 100;
    const top = (2 + rnd() * 95) / 100;
    const rot = Math.round(rnd() * 180);
    const fill = k.colors[Math.floor(rnd() * k.colors.length)]!;
    const opacity = 0.55 + rnd() * 0.45;
    out.push({
      cx: +(box.x + left * box.w + w / 2).toFixed(2),
      cy: +(box.y + top * box.h + h / 2).toFixed(2),
      rx: +(w / 2).toFixed(2),
      ry: +(h / 2).toFixed(2),
      rot,
      fill,
      opacity: +opacity.toFixed(2),
    });
  }
  return out;
}

/** Decorative 21×21 QR-style grid as one SVG path (finder patterns + seeded noise). */
export function makeQrPath(num: string, x0: number, y0: number, size: number): string {
  const rnd = lcg(3 + parseInt(num, 10) * 977);
  const finder = (r: number, c: number, r0: number, c0: number): boolean | null => {
    const y = r - r0;
    const x = c - c0;
    if (y < 0 || x < 0 || y > 7 || x > 7) return null;
    if (y === 7 || x === 7) return false;
    if (y === 0 || y === 6 || x === 0 || x === 6) return true;
    return y >= 2 && y <= 4 && x >= 2 && x <= 4;
  };
  const m = size / 21;
  let d = "";
  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      let on = finder(r, c, 0, 0);
      if (on === null) on = finder(r, c, 0, 13) === null ? null : finder(r, 20 - c, 0, 0);
      if (on === null) on = finder(r, c, 13, 0) === null ? null : finder(20 - r, c, 0, 0);
      if (on === null && r === 6) on = c % 2 === 0;
      if (on === null && c === 6) on = r % 2 === 0;
      if (on === null) on = rnd() < 0.48;
      if (on) d += `M${(x0 + c * m).toFixed(2)} ${(y0 + r * m).toFixed(2)}h${(m + 0.02).toFixed(2)}v${(m + 0.02).toFixed(2)}h-${(m + 0.02).toFixed(2)}z`;
    }
  }
  return d;
}

/** Splits text into at most two balanced lines when longer than `max` chars. */
export function balance(text: string, max: number): string[] {
  if (text.length <= max || !text.includes(" ")) return [text];
  const words = text.split(" ");
  let best: string[] = [text];
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const score = Math.max(a.length, b.length);
    if (score < bestScore) {
      bestScore = score;
      best = [a, b];
    }
  }
  return best;
}

/** Bubbles rising through the honey: deterministic per jar. */
export function makeBubbles(num: string, box: { x: number; y: number; w: number; h: number }) {
  const rnd = lcg(11 + parseInt(num, 10) * 53);
  return Array.from({ length: 6 }, () => ({
    cx: +(box.x + 8 + rnd() * (box.w - 16)).toFixed(2),
    cy: +(box.y + box.h - 6 - rnd() * 30).toFixed(2),
    r: +(0.5 + rnd() * 0.9).toFixed(2),
    delay: +(rnd() * -14).toFixed(2),
    duration: +(11 + rnd() * 8).toFixed(2),
  }));
}
