/**
 * Puts the sealed No. 01 label artwork onto the open-pour hero jar.
 *
 * The two supplied Wildflower masters were shot with different label
 * layouts (the pour shot has a small "No. 01" over a big WILDFLOWER; the
 * sealed packshot, like every other jar in the range, has the big "No. 01"
 * over a spaced WILDFLOWER and a rule). This is a purely local composite of
 * the supplied pixels, nothing generated: the sealed label's printed face is
 * warped onto the hero label (cylinder edge to edge, following each label's
 * own top and bottom curves), re-lit with the hero label's own shading, and
 * feathered in inside the hero label's edges, so the hero keeps its own label
 * outline, rims and paper edge.
 *
 * Geometry was measured from the masters (2336×3504): label side edges and
 * elliptical top/bottom edges, y(x) = yS + sag·√(1 − ((x − cx)/r)²).
 * Re-measure if a master is replaced; `check()` fails loudly if the label
 * isn't where these numbers say.
 */

const HERO_LABEL = { left: 556, right: 1706, top: { yS: 1403, sag: 117 }, bottom: { yS: 2839, sag: 132 } };
const SEALED_LABEL = { left: 440, right: 1876, top: { yS: 933, sag: 71 }, bottom: { yS: 2827, sag: 115 } };
/** Horizontal span (fraction of the half-width) that holds the printed art; kept undistorted. */
const ART_SPAN = 0.84;
/** Hero pixels kept untouched inside the label edge, then a feather. */
const INSET = 20;
const FEATHER = 22;
/** Box-blur radius for the shading match. */
const SHADE_R = 48;

function geometry(l) {
  const cx = (l.left + l.right) / 2;
  const r = (l.right - l.left) / 2;
  const curve = (c) => (x) => {
    const t = (x - cx) / r;
    return c.yS + c.sag * Math.sqrt(Math.max(0, 1 - t * t));
  };
  return { ...l, cx, r, topAt: curve(l.top), botAt: curve(l.bottom) };
}

const isPaper = (r, g, b) => r > 110 && g < 60 && b > 25 && b < 130;

/**
 * Smooth monotone map from hero t ∈ [-1, 1] to sealed t: constant slope over
 * the printed art (so it keeps its proportions), the plain paper toward the
 * edges takes up the difference in label proportions.
 */
function makeHorizontalMap(k0) {
  const N = 2048;
  const smooth = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
  // slope dt_h/dt_s at |t_s|: k0 inside ART_SPAN, ramping so ∫0..1 = 1.
  const A = (1 - k0) / ((1 - ART_SPAN) / 2);
  const ts = new Float64Array(N + 1);
  const th = new Float64Array(N + 1);
  let acc = 0;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    ts[i] = t;
    th[i] = acc;
    const slope = k0 + A * smooth((t - ART_SPAN) / (1 - ART_SPAN));
    acc += slope / N;
  }
  const norm = th[N];
  for (let i = 0; i <= N; i++) th[i] /= norm;
  // invert: t_h → t_s
  return (t) => {
    const s = Math.sign(t);
    const a = Math.min(1, Math.abs(t));
    let lo = 0, hi = N;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (th[mid] <= a) lo = mid;
      else hi = mid;
    }
    const f = (a - th[lo]) / Math.max(1e-9, th[hi] - th[lo]);
    return s * (ts[lo] + f * (ts[hi] - ts[lo]));
  };
}

function sample(img, x, y, out) {
  const { data, w, h } = img;
  const x0 = Math.max(0, Math.min(w - 2, Math.floor(x)));
  const y0 = Math.max(0, Math.min(h - 2, Math.floor(y)));
  const fx = Math.max(0, Math.min(1, x - x0));
  const fy = Math.max(0, Math.min(1, y - y0));
  const i00 = (y0 * w + x0) * 3, i10 = i00 + 3, i01 = i00 + w * 3, i11 = i01 + 3;
  for (let c = 0; c < 3; c++) {
    const top = data[i00 + c] * (1 - fx) + data[i10 + c] * fx;
    const bot = data[i01 + c] * (1 - fx) + data[i11 + c] * fx;
    out[c] = top * (1 - fy) + bot * fy;
  }
}

/** Separable box blur over a w×h float plane (edge-clamped). */
function boxBlur(src, w, h, r) {
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    let s = 0;
    const row = y * w;
    for (let x = -r; x <= r; x++) s += src[row + Math.max(0, Math.min(w - 1, x))];
    for (let x = 0; x < w; x++) {
      tmp[row + x] = s;
      s += src[row + Math.min(w - 1, x + r + 1)] - src[row + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < w; x++) {
    let s = 0;
    for (let y = -r; y <= r; y++) s += tmp[Math.max(0, Math.min(h - 1, y)) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = s;
      s += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
    }
  }
  return out;
}

/** Fail loudly if a label isn't where its geometry says (e.g. a replaced master). */
function check(img, g, name) {
  let paper = 0, n = 0;
  for (let y = Math.round(g.topAt(g.cx) + 30); y < g.botAt(g.cx) - 30; y += 7) {
    for (const x of [g.left + 30, g.left + 60, g.right - 60, g.right - 30]) {
      const i = (y * img.w + Math.round(x)) * 3;
      n++;
      if (isPaper(img.data[i], img.data[i + 1], img.data[i + 2])) paper++;
    }
  }
  if (paper / n < 0.85) throw new Error(`relabel: ${name} label edges not found (${((paper / n) * 100).toFixed(0)}% paper) — re-measure the geometry`);
}

/**
 * hero, sealed: { data (RGB), w, h }. Returns a new hero { data, w, h } with
 * the sealed label art composited in.
 */
export function relabelHero(hero, sealed) {
  const H = geometry(HERO_LABEL);
  const S = geometry(SEALED_LABEL);
  check(hero, H, "hero");
  check(sealed, S, "sealed");

  // Scale at the label centre: the printed art keeps its proportions.
  const kv = (H.botAt(H.cx) - H.topAt(H.cx)) / (S.botAt(S.cx) - S.topAt(S.cx));
  const toSealedT = makeHorizontalMap((kv * S.r) / H.r);

  // Work in the label's bounding box only.
  const bx = H.left, by = Math.floor(H.top.yS), bw = H.right - H.left + 1;
  const bh = Math.ceil(H.bottom.yS + H.bottom.sag) - by + 1;
  const N = bw * bh;
  const warped = new Float32Array(N * 3);
  const mask = new Float32Array(N);
  const px = [0, 0, 0];
  for (let j = 0; j < bh; j++) {
    const y = by + j;
    for (let i = 0; i < bw; i++) {
      const x = bx + i;
      const top = H.topAt(x), bot = H.botAt(x);
      if (y < top || y > bot) continue;
      const d = Math.min(x - H.left, H.right - x, y - top, bot - y);
      const m = Math.max(0, Math.min(1, (d - INSET) / FEATHER));
      if (m <= 0) continue;
      const v = (y - top) / (bot - top);
      const xs = S.cx + S.r * toSealedT((x - H.cx) / H.r);
      const ys = S.topAt(xs) + v * (S.botAt(xs) - S.topAt(xs));
      sample(sealed, xs, ys, px);
      const p = j * bw + i;
      warped[p * 3] = px[0];
      warped[p * 3 + 1] = px[1];
      warped[p * 3 + 2] = px[2];
      mask[p] = m * m * (3 - 2 * m);
    }
  }

  // Re-light: split each warped pixel into paper and ink (a matte against
  // the sealed label's local paper/ink colours), then rebuild it from the
  // hero label's own local paper and ink colours, keeping the sealed paper
  // grain and print edges as detail. Low-frequency colours are normalised
  // box blurs over just that class of pixel.
  const heroAt = (p) => {
    const i = ((by + Math.floor(p / bw)) * hero.w + bx + (p % bw)) * 3;
    return [hero.data[i], hero.data[i + 1], hero.data[i + 2]];
  };
  const warpAt = (p) => [warped[p * 3], warped[p * 3 + 1], warped[p * 3 + 2]];
  const isInk = (r, g, b) => r > 200 && g > 150 && b > 110;
  const local = (get, test, r) => {
    const pm = new Float32Array(N);
    const ch = [new Float32Array(N), new Float32Array(N), new Float32Array(N)];
    for (let p = 0; p < N; p++) {
      if (!mask[p]) continue;
      const px3 = get(p);
      if (!test(...px3)) continue;
      pm[p] = 1;
      for (let c = 0; c < 3; c++) ch[c][p] = px3[c];
    }
    const wsum = boxBlur(pm, bw, bh, r);
    return { w: wsum, ch: ch.map((c) => boxBlur(c, bw, bh, r)) };
  };
  // Wide fallback where the near window has too few samples of a class.
  const colourAt = (near, far, p, c) => {
    const wn = near.w[p], wf = far.w[p];
    const vf = wf > 1 ? far.ch[c][p] / wf : NaN;
    if (wn < 1) return vf;
    const vn = near.ch[c][p] / wn;
    const t = Math.min(1, wn / 400);
    return Number.isFinite(vf) ? vn * t + vf * (1 - t) : vn;
  };
  const hPaper = [local(heroAt, isPaper, SHADE_R), local(heroAt, isPaper, SHADE_R * 4)];
  const hInk = [local(heroAt, isInk, SHADE_R * 2), local(heroAt, isInk, SHADE_R * 6)];
  const wPaper = [local(warpAt, isPaper, SHADE_R), local(warpAt, isPaper, SHADE_R * 4)];
  const wInk = [local(warpAt, isInk, SHADE_R * 2), local(warpAt, isInk, SHADE_R * 6)];

  const out = Buffer.from(hero.data);
  const hp = [0, 0, 0], hi = [0, 0, 0], wpc = [0, 0, 0], wic = [0, 0, 0];
  for (let p = 0; p < N; p++) {
    const m = mask[p];
    if (!m) continue;
    let ok = true;
    for (let c = 0; c < 3; c++) {
      hp[c] = colourAt(hPaper[0], hPaper[1], p, c);
      hi[c] = colourAt(hInk[0], hInk[1], p, c);
      wpc[c] = colourAt(wPaper[0], wPaper[1], p, c);
      wic[c] = colourAt(wInk[0], wInk[1], p, c);
      if (![hp[c], hi[c], wpc[c], wic[c]].every(Number.isFinite)) ok = false;
    }
    if (!ok) throw new Error("relabel: no paper/ink reference near the label centre");
    // matte: how far this pixel sits from local paper toward local ink
    let num = 0, den = 0;
    for (let c = 0; c < 3; c++) {
      const d = wic[c] - wpc[c];
      num += (warped[p * 3 + c] - wpc[c]) * d;
      den += d * d;
    }
    const a = Math.max(0, Math.min(1, num / Math.max(1, den)));
    const i = ((by + Math.floor(p / bw)) * hero.w + bx + (p % bw)) * 3;
    for (let c = 0; c < 3; c++) {
      const base = wpc[c] + a * (wic[c] - wpc[c]);
      const detail = warped[p * 3 + c] - base;
      const v = hp[c] + a * (hi[c] - hp[c]) + detail;
      const o = hero.data[i + c] * (1 - m) + v * m;
      out[i + c] = o < 0 ? 0 : o > 255 ? 255 : Math.round(o);
    }
  }
  return { data: out, w: hero.w, h: hero.h };
}
