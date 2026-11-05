import type { SpeckKind } from "@/lib/catalog";

/** Big decorative particles for full-screen jar panels (seeded = SSR-safe). */
export interface Particle {
  x: number;
  y: number;
  size: number;
  rot: number;
  delay: number;
  drift: number;
  depth: number;
}

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function makeParticles(number: string, count = 26): Particle[] {
  const rnd = lcg(19 + parseInt(number, 10) * 211);
  return Array.from({ length: count }, () => ({
    x: +(rnd() * 100).toFixed(2),
    y: +(rnd() * 100).toFixed(2),
    size: +(0.5 + rnd() * 1.1).toFixed(2),
    rot: Math.round(rnd() * 360),
    delay: +(rnd() * 0.5).toFixed(2),
    drift: +(3 + rnd() * 5).toFixed(2),
    depth: +(0.3 + rnd() * 0.9).toFixed(2),
  }));
}

/** What floats around each jar: its specks, or blossoms for the plain honeys. */
export function particleShape(kind: SpeckKind, slug: string): { path: string; fill: string; stroke?: string; viewBox: string; base: number } {
  switch (kind) {
    case "vanilla":
      // a split vanilla pod with seeds
      return { viewBox: "0 0 40 12", base: 46, path: "M2 6 C 10 1, 30 1, 38 6 C 30 11, 10 11, 2 6 Z M8 6h24", fill: "#2d1608" };
    case "cinnamon":
      // a curled cinnamon quill
      return { viewBox: "0 0 40 16", base: 50, path: "M3 4h34a4 4 0 0 1 0 8H3a4 4 0 0 1 0-8Z M8 8h26", fill: "#b9661a", stroke: "#5e2a05" };
    case "pollen":
      return { viewBox: "0 0 20 20", base: 22, path: "M10 1a9 9 0 1 1 0 18a9 9 0 1 1 0-18Z", fill: "#ffb224", stroke: "#9c620c" };
    case "salt":
      return { viewBox: "0 0 20 20", base: 20, path: "M10 1L19 10L10 19L1 10Z", fill: "#f6eddd", stroke: "#262626" };
    default:
      // five-petal blossom (wildflower / avocado blossom)
      return {
        viewBox: "0 0 40 40",
        base: slug === "avocado-blossom" ? 30 : 38,
        path:
          "M20 20m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0 M20 4a6 7 0 0 1 0 12a6 7 0 0 1 0-12Z M35 15a7 6 0 0 1 -11 5a7 6 0 0 1 11-5Z M30 33a6 7 0 0 1 -9-8a6 7 0 0 1 9 8Z M10 33a6 7 0 0 1 9-8a6 7 0 0 1 -9 8Z M5 15a7 6 0 0 1 11 5a7 6 0 0 1 -11-5Z",
        fill: slug === "avocado-blossom" ? "#f6eddd" : "#ffd36b",
        stroke: "#262626",
      };
  }
}
