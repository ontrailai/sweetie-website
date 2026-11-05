#!/usr/bin/env node
/**
 * Builds the web jar assets in public/jars/ (and lib/jarAssets.generated.ts)
 * from the photoreal packshot masters.
 *
 *   node scripts/jar-assets/build.mjs [mastersDir]     (default: .qa/redesign/jars)
 *
 * macOS only (the cutout mask comes from Apple Vision, on-device, via
 * lift.swift; nothing is uploaded anywhere). Image work is sharp, which ships
 * with Next.js.
 *
 * Sealed jars: Vision subject mask → edge colour decontaminated against the
 * studio backdrop (so the cutouts sit clean on any colour) → trimmed and
 * normalised onto one shared 0.46 canvas (same height, bottom-aligned, so a
 * row of jars lines up) → WebP + palette PNG at 1x and 2x.
 *
 * Hero (open pour): first the sealed No. 01 label art is composited onto the
 * pour shot's jar (relabel.mjs; the two masters were shot with different
 * label layouts). Then the Vision mask keeps the jar and pour but drops the
 * lid and flung drops, so a colour key against the backdrop adds back
 * everything above the rim. The lid (the one dark shape up there) is split
 * onto its own layer so it can float independently. Above the shot, the
 * ribbon is continued upward as its own small layer: the photographed top
 * rows, widened row by row along the pour's own flare (broad and heavy up
 * high, thinning as it falls), with its top row as a 1px strip the page can
 * stretch further up, so the pour can fall from above the fold at any crop.
 *
 * Set JAR_ASSETS_DEBUG=<dir> to also write the relabelled hero master there.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { relabelHero } from "./relabel.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../..");
const SRC = process.argv[2] ?? join(ROOT, ".qa/redesign/jars");
const OUT = join(ROOT, "public/jars");
const MANIFEST = join(ROOT, "lib/jarAssets.generated.ts");

const SEALED = [
  ["01-wildflower", "wildflower"],
  ["02-avocado-blossom", "avocado-blossom"],
  ["03-vanilla-bean", "vanilla-bean"],
  ["04-cinnamon", "cinnamon"],
  ["05-bee-pollen", "bee-pollen"],
  ["06-guarana-salt", "guarana-salt"],
];
const HERO = "01-wildflower-open-pour";

/** Shared sealed-jar canvas (2x). Every jar is scaled to the same height. */
const JAR_W = 736;
const JAR_H = 1600;
const JAR_PAD = 0.02;
/** Hero art height (2x). */
const HERO_H = 1800;
/** Ribbon continuation above the shot: flare decay length and height (master px). */
const RIBBON_D = 300;
const RIBBON_H = 900;

const WEBP = { quality: 82, alphaQuality: 90, effort: 6, smartSubsample: true };
const PNG = { palette: true, quality: 92, effort: 10, dither: 0.9, compressionLevel: 9 };

const tmp = mkdtempSync(join(tmpdir(), "sweetbee-jars-"));
const lift = join(tmp, "lift");

function log(...a) {
  console.log("[jar-assets]", ...a);
}

function compileLift() {
  execFileSync("swiftc", ["-O", join(HERE, "lift.swift"), "-o", lift], { stdio: "inherit" });
}

async function readRgb(file) {
  const { data, info } = await sharp(file).removeAlpha().toColourspace("srgb").raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

async function readMask(file, w, h) {
  const { data, info } = await sharp(file).greyscale().resize(w, h, { fit: "fill" }).raw().toBuffer({ resolveWithObject: true });
  if (info.channels !== 1) throw new Error("mask should be 1 channel");
  return data;
}

/** Median backdrop colour from a band around the border. */
function backdrop({ data, w, h }) {
  const band = Math.round(Math.min(w, h) * 0.02);
  const ch = [[], [], []];
  for (let y = 0; y < h; y += 3) {
    for (let x = 0; x < w; x += 3) {
      if (x > band && x < w - band && y > band && y < h - band) continue;
      const i = (y * w + x) * 3;
      for (let c = 0; c < 3; c++) ch[c].push(data[i + c]);
    }
  }
  return ch.map((v) => v.sort((a, b) => a - b)[v.length >> 1]);
}

/** Straight-alpha RGBA with the backdrop un-mixed from soft edges. */
function decontaminate({ data, w, h }, alpha, bg) {
  const out = Buffer.alloc(w * h * 4);
  for (let p = 0; p < w * h; p++) {
    let a = alpha[p];
    if (a < 0.04) a = 0;
    const i = p * 3;
    const o = p * 4;
    if (a === 0) continue;
    for (let c = 0; c < 3; c++) {
      const v = a >= 0.98 ? data[i + c] : (data[i + c] - (1 - a) * bg[c]) / a;
      out[o + c] = v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
    }
    out[o + 3] = Math.round(a * 255);
  }
  return out;
}

function bbox(rgba, w, h, min = 10) {
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (rgba[(y * w + x) * 4 + 3] > min) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

const raw = (buf, w, h) => sharp(buf, { raw: { width: w, height: h, channels: 4 } });

async function writeVariants(img, name, w2, h2) {
  const two = await img.png().toBuffer();
  const files = {
    "2x.webp": await sharp(two).webp(WEBP).toBuffer(),
    "1x.webp": await sharp(two).resize(Math.round(w2 / 2), Math.round(h2 / 2)).webp(WEBP).toBuffer(),
    "2x.png": await sharp(two).png(PNG).toBuffer(),
    "1x.png": await sharp(two).resize(Math.round(w2 / 2), Math.round(h2 / 2)).png(PNG).toBuffer(),
  };
  for (const [suffix, buf] of Object.entries(files)) writeFileSync(join(OUT, `${name}-${suffix}`), buf);
  const blur = await sharp(two).resize(12, Math.max(1, Math.round((12 * h2) / w2))).webp({ quality: 40 }).toBuffer();
  log(name, Object.entries(files).map(([s, b]) => `${s} ${(b.length / 1024).toFixed(0)}KB`).join(", "));
  return {
    width: w2,
    height: h2,
    webp2x: `/jars/${name}-2x.webp`,
    webp1x: `/jars/${name}-1x.webp`,
    png2x: `/jars/${name}-2x.png`,
    png1x: `/jars/${name}-1x.png`,
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}

async function sealed(name) {
  const file = join(SRC, `${name}.png`);
  const maskFile = join(tmp, `${name}-mask.png`);
  execFileSync(lift, [file, maskFile]);
  const img = await readRgb(file);
  const mask = await readMask(maskFile, img.w, img.h);
  const bg = backdrop(img);
  const alpha = Float32Array.from(mask, (v) => v / 255);
  const rgba = decontaminate(img, alpha, bg);
  const box = bbox(rgba, img.w, img.h);
  const jh = Math.round(JAR_H * (1 - JAR_PAD * 2));
  const jw = Math.round((box.width / box.height) * jh);
  if (jw > JAR_W) throw new Error(`${name} is wider than the shared canvas`);
  const jar = await raw(rgba, img.w, img.h).extract(box).resize(jw, jh).png().toBuffer();
  const left = Math.floor((JAR_W - jw) / 2);
  const top = JAR_H - Math.round(JAR_H * JAR_PAD) - jh;
  const canvas = sharp(jar).extend({
    left,
    right: JAR_W - jw - left,
    top,
    bottom: JAR_H - jh - top,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  return { ...(await writeVariants(canvas, name, JAR_W, JAR_H)), backdrop: `rgb(${bg.join(" ")})` };
}

async function hero() {
  const img = relabelHero(await readRgb(join(SRC, `${HERO}.png`)), await readRgb(join(SRC, "01-wildflower.png")));
  const { data, w, h } = img;
  const file = join(tmp, `${HERO}-relabelled.png`);
  await sharp(data, { raw: { width: w, height: h, channels: 3 } }).png().toFile(file);
  if (process.env.JAR_ASSETS_DEBUG) {
    mkdirSync(process.env.JAR_ASSETS_DEBUG, { recursive: true });
    await sharp(file).toFile(join(process.env.JAR_ASSETS_DEBUG, `${HERO}-relabelled.png`));
  }
  const maskFile = join(tmp, `${HERO}-mask.png`);
  execFileSync(lift, [file, maskFile]);
  const N = w * h;
  const mask = await readMask(maskFile, w, h);
  const bg = backdrop(img);

  // Colour key: distance from the backdrop, softened.
  const key = new Float32Array(N);
  for (let p = 0; p < N; p++) {
    const i = p * 3;
    const d = Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]);
    const t = Math.max(0, Math.min(1, (d - 26) / (72 - 26)));
    key[p] = t * t * (3 - 2 * t);
  }

  // The rim: first row where the jar mask is a good fraction of its widest row.
  const rowCount = new Int32Array(h);
  let widest = 0;
  for (let y = 0; y < h; y++) {
    let n = 0;
    for (let x = 0; x < w; x++) if (mask[y * w + x] > 128) n++;
    rowCount[y] = n;
    if (n > widest) widest = n;
  }
  let rim = 0;
  while (rim < h && rowCount[rim] < widest * 0.6) rim++;
  const above = Math.min(h, rim + Math.round(h * 0.03));

  // Lid: the connected keyed shape that holds the dark pixels above the rim.
  const fg = new Uint8Array(N);
  for (let y = 0; y < above; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x;
    if (key[p] > 0.15 && mask[p] < 128) fg[p] = 1;
  }
  // Seed from the largest dark blob only (dark honey at the pour's edge
  // must not drag the stream into the lid layer).
  const dark = new Uint8Array(N);
  for (let y = 0; y < above; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x;
    const i = p * 3;
    const luma = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    if (fg[p] && key[p] > 0.6 && luma < 70) dark[p] = 1;
  }
  const lid = new Uint8Array(N);
  const queue = new Int32Array(N);
  const flood = (seed, ok, mark) => {
    let qh = 0, qt = 0;
    mark[seed] = 1;
    queue[qt++] = seed;
    while (qh < qt) {
      const p = queue[qh++];
      const x = p % w;
      for (const q of [p - 1, p + 1, p - w, p + w]) {
        if (q < 0 || q >= N || mark[q] || !ok[q]) continue;
        if ((q === p - 1 && x === 0) || (q === p + 1 && x === w - 1)) continue;
        mark[q] = 1;
        queue[qt++] = q;
      }
    }
    return qt;
  };
  const seen = new Uint8Array(N);
  let best = -1, bestSize = 0;
  for (let p = 0; p < N; p++) {
    if (!dark[p] || seen[p]) continue;
    const size = flood(p, dark, seen);
    if (size > bestSize) {
      bestSize = size;
      best = p;
    }
  }
  if (best < 0) throw new Error("No lid found in the open-pour shot");
  flood(best, fg, lid);
  // Grow the lid a few px so its soft edge comes with it.
  const R = 5;
  const lidGrown = new Uint8Array(N);
  for (let y = 0; y < above; y++) for (let x = 0; x < w; x++) {
    if (!lid[y * w + x]) continue;
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      const yy = y + dy, xx = x + dx;
      if (yy >= 0 && yy < h && xx >= 0 && xx < w) lidGrown[yy * w + xx] = 1;
    }
  }

  const baseA = new Float32Array(N);
  const lidA = new Float32Array(N);
  for (let p = 0; p < N; p++) {
    const y = (p / w) | 0;
    const m = mask[p] / 255;
    if (lidGrown[p]) lidA[p] = key[p] * (1 - m);
    else baseA[p] = y < above ? Math.max(m, key[p]) : m;
  }
  const base = decontaminate(img, baseA, bg);
  const lidRgba = decontaminate(img, lidA, bg);

  const bb = bbox(base, w, h, 12);
  const lb = bbox(lidRgba, w, h, 12);
  const art = {
    left: Math.min(bb.left, lb.left),
    top: Math.min(bb.top, lb.top),
  };
  art.width = Math.max(bb.left + bb.width, lb.left + lb.width) - art.left;
  art.height = Math.max(bb.top + bb.height, lb.top + lb.height) - art.top;
  const scale = HERO_H / art.height;
  const aw = Math.round(art.width * scale);
  // Even dimensions so the 1x halves are exact.
  const W2 = aw + (aw % 2);
  const pour = await writeVariants(raw(base, w, h).extract(art).resize(W2, HERO_H, { fit: "fill" }), "hero-pour", W2, HERO_H);

  const lw = Math.round(lb.width * scale);
  const lh = Math.round(lb.height * scale);
  const LW = lw + (lw % 2), LH = lh + (lh % 2);
  const lidOut = await writeVariants(raw(lidRgba, w, h).extract(lb).resize(LW, LH, { fit: "fill" }), "hero-lid", LW, LH);

  // The pour's top rows, averaged (6 rows) into one row of colour.
  const rows = 6;
  const y0 = art.top;
  let sx0 = -1, sx1 = -1;
  for (let x = art.left; x < art.left + art.width; x++) {
    if (base[(y0 * w + x) * 4 + 3] > 20) {
      if (sx0 < 0) sx0 = x;
      sx1 = x;
    }
  }
  const sw = sx1 - sx0 + 1;
  const strip = new Float32Array(sw * 4);
  for (let x = 0; x < sw; x++) {
    const acc = [0, 0, 0, 0];
    for (let r = 0; r < rows; r++) {
      const o = ((y0 + r) * w + sx0 + x) * 4;
      const a = base[o + 3];
      for (let c = 0; c < 3; c++) acc[c] += base[o + c] * a;
      acc[3] += a;
    }
    for (let c = 0; c < 3; c++) strip[x * 4 + c] = acc[3] ? acc[c] / acc[3] : 0;
    strip[x * 4 + 3] = acc[3] / rows;
  }

  // The pour's own flare: edge slopes over its top rows (x per row, + = right).
  const centre = (sx0 + sx1) / 2;
  const fitRows = Math.round(h * 0.03);
  const ys = [], ls = [], rs = [];
  for (let y = y0; y < y0 + fitRows; y++) {
    let l = Math.round(centre), r = l;
    if (base[(y * w + l) * 4 + 3] < 128) continue;
    while (l > 0 && base[(y * w + l - 1) * 4 + 3] >= 128) l--;
    while (r < w - 1 && base[(y * w + r + 1) * 4 + 3] >= 128) r++;
    ys.push(y - y0);
    ls.push(l);
    rs.push(r);
  }
  const slope = (xs) => {
    const n = ys.length;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (ys[i] - my) * (xs[i] - mx);
      den += (ys[i] - my) ** 2;
    }
    return num / den;
  };
  // Going up, each edge keeps moving outward at its measured rate, easing off.
  const outL = Math.max(0, slope(ls));
  const outR = Math.max(0, -slope(rs));
  const grow = (d) => RIBBON_D * (1 - Math.exp(-d / RIBBON_D));
  const topL = sx0 - outL * grow(RIBBON_H);
  const topR = sx1 + 1 + outR * grow(RIBBON_H);
  const rx0 = Math.floor(topL) - 1;
  const rw = Math.ceil(topR) + 1 - rx0;
  const ribbon = Buffer.alloc(rw * RIBBON_H * 4);
  for (let j = 0; j < RIBBON_H; j++) {
    const d = RIBBON_H - j; // rows above the shot's top edge
    const l = sx0 - outL * grow(d);
    const r = sx1 + 1 + outR * grow(d);
    for (let i = 0; i < rw; i++) {
      const x0 = rx0 + i, x1 = x0 + 1;
      const cover = Math.max(0, Math.min(x1, r) - Math.max(x0, l));
      if (cover <= 0) continue;
      // resample the strip across this row's width
      const u = ((x0 + 0.5 - l) / (r - l)) * sw - 0.5;
      const k = Math.max(0, Math.min(sw - 1, Math.floor(u)));
      const k1 = Math.min(sw - 1, k + 1);
      const f = Math.max(0, Math.min(1, u - k));
      const o = (j * rw + i) * 4;
      for (let c = 0; c < 4; c++) {
        const v = strip[k * 4 + c] * (1 - f) + strip[k1 * 4 + c] * f;
        ribbon[o + c] = Math.round(c === 3 ? v * cover : v);
      }
    }
  }
  const rW = Math.round(rw * scale), rH = Math.round(RIBBON_H * scale);
  const RW = rW + (rW % 2), RH = rH + (rH % 2);
  const ribbonImage = await writeVariants(raw(ribbon, rw, RIBBON_H).resize(RW, RH, { fit: "fill" }), "hero-ribbon", RW, RH);
  delete ribbonImage.blur; // never shown before the hero art, so no placeholder
  // Its top row → a 1px strip to stretch further up.
  const topRow = Buffer.from(ribbon.subarray(0, rw * 4));
  const stripPng = await raw(topRow, rw, 1).resize(Math.min(64, rw), 1, { fit: "fill" }).png().toBuffer();

  // The jar body (rim down) inside the art: for centring and the bee's orbit.
  let jx0 = w, jx1 = -1, jy1 = rim;
  for (let y = rim; y < h; y++) for (let x = 0; x < w; x++) {
    if (mask[y * w + x] > 128) {
      if (x < jx0) jx0 = x;
      if (x > jx1) jx1 = x;
      jy1 = y;
    }
  }

  const frac = (v) => +v.toFixed(4);
  return {
    pour: { ...pour, backdrop: `rgb(${bg.join(" ")})` },
    lid: {
      ...lidOut,
      /** Placement inside the pour art, as fractions of its width/height. */
      box: {
        left: frac((lb.left - art.left) / art.width),
        top: frac((lb.top - art.top) / art.height),
        width: frac(lb.width / art.width),
        height: frac(lb.height / art.height),
      },
    },
    /** The ribbon continued above the shot: sits on the art's top edge. */
    ribbon: {
      ...ribbonImage,
      /** Placement above the art, as fractions of its width/height. */
      box: {
        left: frac((rx0 - art.left) / art.width),
        width: frac(rw / art.width),
        height: frac(RIBBON_H / art.height),
      },
      /** The ribbon's top row, to stretch further up. */
      stream: `data:image/png;base64,${stripPng.toString("base64")}`,
    },
    /** The jar body (rim to base), as fractions of the art. */
    body: {
      left: frac((jx0 - art.left) / art.width),
      top: frac((rim - art.top) / art.height),
      width: frac((jx1 - jx0 + 1) / art.width),
      height: frac((jy1 - rim + 1) / art.height),
    },
  };
}

async function main() {
  if (process.platform !== "darwin") throw new Error("Needs macOS (Apple Vision) for the cutout masks.");
  for (const [n] of [...SEALED, [HERO]]) if (!existsSync(join(SRC, `${n}.png`))) throw new Error(`Missing master ${n}.png in ${SRC}`);
  mkdirSync(OUT, { recursive: true });
  compileLift();
  const jars = {};
  for (const [name, slug] of SEALED) jars[slug] = await sealed(name);
  const heroAssets = await hero();
  const src = `// GENERATED by scripts/jar-assets/build.mjs from ${basename(SRC)}/ — do not edit by hand.
// Re-run the script after replacing a master packshot.

export const SEALED_JARS = ${JSON.stringify(jars, null, 2)} as const;

export const HERO_POUR = ${JSON.stringify(heroAssets, null, 2)} as const;
`;
  writeFileSync(MANIFEST, src);
  log("wrote", MANIFEST.replace(ROOT + "/", ""));
  const total = [...SEALED.map(([n]) => n), "hero-pour", "hero-lid", "hero-ribbon"]
    .flatMap((n) => ["2x.webp", "1x.webp", "2x.png", "1x.png"].map((s) => statSync(join(OUT, `${n}-${s}`)).size))
    .reduce((a, b) => a + b, 0);
  log(`public/jars total ${(total / 1024 / 1024).toFixed(2)}MB`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => rmSync(tmp, { recursive: true, force: true }));
