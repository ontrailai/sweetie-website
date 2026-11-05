"use client";

import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { memo, useId, useMemo } from "react";
import type { SpeckKind } from "@/lib/catalog";
import { STAR_PATH } from "@/components/brand/Star";
import { balance, labelTextFor, makeBubbles, makeQrPath, makeSpecks, mix } from "./jar-art";

export interface JarProps {
  /** "01" … "06" */
  number: string;
  name: string;
  descriptor: string;
  labelColor: string;
  /** Defaults to Nero on light labels, Canvas otherwise. */
  labelText?: string;
  honey: string;
  honeyDark: string;
  specks: SpeckKind;
  /**
   * Label rotation in viewBox units. 300 = one full turn of the jar.
   * Drive it with a MotionValue for spins without React re-renders.
   */
  spin?: MotionValue<number>;
  /** Shimmer, drifting specks and rising bubbles. */
  alive?: boolean;
  /** Hide from assistive tech when a visible caption already names the jar. */
  decorative?: boolean;
  /** Lid off: shows the threaded glass neck and the open mouth. */
  open?: boolean;
  className?: string;
}

// Geometry (viewBox 0 0 100 318; the jar is 100 × 310 like Jar.dc.html's 10:31).
const W = 100;
const LID_H = 22.3;
const NECK = { y: 22.3, h: 5.6 };
const BODY = { y: 27.9, b: 310 };
const HONEY = { x: 2.2, y: 40.6, w: 95.6, h: 259.2 };
const LABEL = { y: 104.1, h: 141 };
export const TURN = 300;

function roundedPath(x: number, y: number, w: number, h: number, tr: [number, number], br: [number, number]) {
  const [trx, try_] = tr;
  const [brx, bry] = br;
  return [
    `M${x + trx} ${y}`,
    `H${x + w - trx}`,
    `A${trx} ${try_} 0 0 1 ${x + w} ${y + try_}`,
    `V${y + h - bry}`,
    `A${brx} ${bry} 0 0 1 ${x + w - brx} ${y + h}`,
    `H${x + brx}`,
    `A${brx} ${bry} 0 0 1 ${x} ${y + h - bry}`,
    `V${y + try_}`,
    `A${trx} ${try_} 0 0 1 ${x + trx} ${y}`,
    "Z",
  ].join(" ");
}

const BODY_PATH = roundedPath(0, BODY.y, W, BODY.b - BODY.y, [7, 2.6], [9, 3.6]);
const HONEY_PATH = roundedPath(HONEY.x, HONEY.y, HONEY.w, HONEY.h, [5, 1.4], [7, 3]);

const serif = { fontFamily: "var(--font-serif), 'Instrument Serif', serif" } as const;
const mono = { fontFamily: "var(--font-mono), 'Courier Prime', monospace" } as const;

/** Stacks the front-label rows (heights from Jar.dc.html) and centres them on the label. */
function layoutFront(nameLineCount: number, descLineCount: number) {
  const gap = 2.6;
  const rows: [key: string, h: number, after: number][] = [
    ["mark", 11, gap + 3],
    ["num", 15.3, gap],
    ["name", nameLineCount * 8.5, gap],
    ["rule", 3.4, gap],
    ["desc", descLineCount * 6.5, gap],
    ["county", 6, gap],
    ["qr", 28.8 + 2.6, gap],
    ["scan", 3.4, 0],
  ];
  const total = rows.reduce((a, [, h, after]) => a + h + after, 0);
  const out: Record<string, number> = {};
  rows.reduce((y, [key, h, after]) => {
    out[key] = y;
    return y + h + after;
  }, LABEL.y + (LABEL.h - total) / 2);
  return {
    markY: out.mark!,
    numY: out.num!,
    nameY: out.name!,
    ruleY: out.rule!,
    descY: out.desc!,
    countyY: out.county!,
    qrY: out.qr! + 2.6,
    scanY: out.scan!,
  };
}

function FrontPanel({ number, name, descriptor, ink, labelColor }: { number: string; name: string; descriptor: string; ink: string; labelColor: string }) {
  const nameLines = balance(name.toUpperCase(), 12);
  const descLines = balance(descriptor, 20);
  const { markY, numY, nameY, ruleY, descY, countyY, qrY, scanY } = layoutFront(nameLines.length, descLines.length);
  const qrSize = 26;
  const qrX = 50 - qrSize / 2;
  const qr = makeQrPath(number, qrX, qrY + 1.4, qrSize);

  return (
    <g fill={ink}>
      <text x="50" y={markY + 9.2} textAnchor="middle" fontSize="12.5" style={serif}>
        <tspan fontStyle="italic">Sweet</tspan>
        <tspan dx="1.2" fontSize="12.5">
          Bee
        </tspan>
      </text>
      <text x="50" y={numY + 13} textAnchor="middle" fontSize="17" fontStyle="italic" style={{ ...serif, letterSpacing: "0.025em" }}>
        No. {number}
      </text>
      {nameLines.map((line, i) => (
        <text key={i} x="50" y={nameY + 6.6 + i * 8.5} textAnchor="middle" fontSize="7.4" style={{ ...serif, letterSpacing: "0.2em" }}>
          {line}
        </text>
      ))}
      <rect x="39" y={ruleY + 1.2} width="22" height="0.5" opacity="0.6" />
      {descLines.map((line, i) => (
        <text key={i} x="50" y={descY + 4.6 + i * 6.5} textAnchor="middle" fontSize="4.8" style={{ ...mono, letterSpacing: "0.06em" }}>
          {line}
        </text>
      ))}
      <text x="50" y={countyY + 5} textAnchor="middle" fontSize="4" opacity="0.85" style={{ ...mono, letterSpacing: "0.12em" }}>
        SAN DIEGO COUNTY
      </text>
      <rect x={qrX - 1.4} y={qrY} width={qrSize + 2.8} height={qrSize + 2.8} rx="0.6" fill="#F6EDDD" />
      <path d={qr} fill="#262626" />
      {labelColor.toUpperCase() === "#F6EDDD" ? (
        <rect x={qrX - 1.4} y={qrY} width={qrSize + 2.8} height={qrSize + 2.8} rx="0.6" fill="none" stroke="#262626" strokeOpacity="0.25" strokeWidth="0.4" />
      ) : null}
      <text x="50" y={scanY + 3} textAnchor="middle" fontSize="3.4" opacity="0.85" style={{ ...mono, letterSpacing: "0.1em" }}>
        SCAN FOR BATCH
      </text>
    </g>
  );
}

function HumPanel({ ink }: { ink: string }) {
  const cy = LABEL.y + LABEL.h / 2;
  return (
    <g fill={ink}>
      <text x="50" y={cy - 22} textAnchor="middle" fontSize="20" fontStyle="italic" style={serif}>
        Feel
      </text>
      <text x="50" y={cy - 4} textAnchor="middle" fontSize="20" fontStyle="italic" style={serif}>
        the
      </text>
      <text x="50" y={cy + 14} textAnchor="middle" fontSize="20" fontStyle="italic" style={serif}>
        hum.
      </text>
      <path d={STAR_PATH} transform={`translate(44 ${cy + 24}) scale(0.5)`} />
      <text x="50" y={cy + 45} textAnchor="middle" fontSize="3.6" style={{ ...mono, letterSpacing: "0.14em" }}>
        RAW · LOCAL · TRACEABLE
      </text>
    </g>
  );
}

function HivePanel({ ink, number }: { ink: string; number: string }) {
  const cy = LABEL.y + LABEL.h / 2;
  return (
    <g fill={ink}>
      <text x="50" y={cy - 30} textAnchor="middle" fontSize="4" style={{ ...mono, letterSpacing: "0.16em" }}>
        RAW HONEY
      </text>
      <g transform={`translate(30 ${cy - 22})`} fill="none" stroke={ink} strokeWidth="0.9" opacity="0.9">
        {[
          [10, 6], [20, 6], [30, 6], [15, 14.6], [25, 14.6], [10, 23.2], [20, 23.2], [30, 23.2],
        ].map(([x, y]) => (
          <polygon key={`${x}-${y}`} points={hexPoints(x!, y!, 5.4)} />
        ))}
      </g>
      <text x="50" y={cy + 20} textAnchor="middle" fontSize="13" fontStyle="italic" style={serif}>
        Small batch
      </text>
      <text x="50" y={cy + 30} textAnchor="middle" fontSize="4" style={{ ...mono, letterSpacing: "0.08em" }}>
        Traceable to the hive
      </text>
      <text x="50" y={cy + 46} textAnchor="middle" fontSize="7" style={{ ...serif, letterSpacing: "0.2em" }}>
        No. {number}
      </text>
    </g>
  );
}

function hexPoints(x: number, y: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return `${(x + r * Math.cos(a)).toFixed(2)},${(y + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

function JarImpl({
  number,
  name,
  descriptor,
  labelColor,
  labelText,
  honey,
  honeyDark,
  specks,
  spin,
  alive = true,
  decorative = false,
  open = false,
  className = "",
}: JarProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (s: string) => `jar-${uid}-${s}`;
  const ink = labelText ?? labelTextFor(labelColor);
  const lightLabel = ink.toUpperCase() === "#262626";

  const fallbackSpin = useMotionValue(0);
  const source = spin ?? fallbackSpin;
  const stripX = useTransform(source, (v) => -(((v % TURN) + TURN) % TURN));

  const art = useMemo(() => {
    const light = mix(honey, "#FFF4C8", 0.42);
    const mid = mix(honey, honeyDark, 0.35);
    return {
      light,
      mid,
      specks: makeSpecks(specks, number, HONEY),
      bubbles: makeBubbles(number, HONEY),
    };
  }, [honey, honeyDark, specks, number]);

  const half = Math.ceil(art.specks.length / 2);
  const panels = (offset: number) => (
    <g transform={`translate(${offset} 0)`} key={offset}>
      <FrontPanel number={number} name={name} descriptor={descriptor} ink={ink} labelColor={labelColor} />
      <g transform="translate(100 0)">
        <HumPanel ink={ink} />
      </g>
      <g transform="translate(200 0)">
        <HivePanel ink={ink} number={number} />
      </g>
    </g>
  );

  return (
    <svg
      viewBox="0 0 100 318"
      className={`jar block h-auto w-full overflow-visible ${className}`}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `Sweet Bee jar No. ${number}, ${name}`}
      data-alive={alive ? "true" : undefined}
    >
      <defs>
        <radialGradient id={id("shadow")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#262626" stopOpacity="0.42" />
          <stop offset="45%" stopColor="#262626" stopOpacity="0.16" />
          <stop offset="72%" stopColor="#262626" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("lid")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0e0e0e" />
          <stop offset="0.14" stopColor="#343434" />
          <stop offset="0.23" stopColor="#5a5a5a" />
          <stop offset="0.4" stopColor="#2b2b2b" />
          <stop offset="0.7" stopColor="#1c1c1c" />
          <stop offset="0.86" stopColor="#3e3e3e" />
          <stop offset="1" stopColor="#0e0e0e" />
        </linearGradient>
        <pattern id={id("ridges")} width="3" height="4" patternUnits="userSpaceOnUse">
          <rect width="0.6" height="4" fill="rgba(255,255,255,0.08)" />
        </pattern>
        <linearGradient id={id("neck")} x1="0" x2="1">
          <stop offset="0" stopColor="rgba(120,110,100,0.35)" />
          <stop offset="0.22" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="0.55" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="1" stopColor="rgba(120,110,100,0.4)" />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" x2="1">
          <stop offset="0" stopColor="rgba(200,190,175,0.55)" />
          <stop offset="0.14" stopColor="rgba(255,255,255,0.28)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="0.86" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="1" stopColor="rgba(200,190,175,0.6)" />
        </linearGradient>
        <linearGradient id={id("honey")} x1="0" x2="1">
          <stop offset="0" stopColor={honeyDark} />
          <stop offset="0.12" stopColor={art.mid} />
          <stop offset="0.24" stopColor={honey} />
          <stop offset="0.36" stopColor={art.light} />
          <stop offset="0.52" stopColor={honey} />
          <stop offset="0.8" stopColor={art.mid} />
          <stop offset="1" stopColor={honeyDark} />
        </linearGradient>
        <linearGradient id={id("depth")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FFF4C8" stopOpacity="0.28" />
          <stop offset="0.25" stopColor="#FFF4C8" stopOpacity="0" />
          <stop offset="0.8" stopColor={honeyDark} stopOpacity="0" />
          <stop offset="1" stopColor={honeyDark} stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={id("shimmer")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#FFF4C8" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFF4C8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFF4C8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("base")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.55)" />
        </linearGradient>
        <linearGradient id={id("labelShade")} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.34" />
          <stop offset="0.16" stopColor="#000" stopOpacity="0.08" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.46" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="0.86" stopColor="#000" stopOpacity="0.14" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={id("streak")} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("streak2")} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.42" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("rim")}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id("bodyClip")}>
          <path d={BODY_PATH} />
        </clipPath>
        <clipPath id={id("honeyClip")}>
          <path d={HONEY_PATH} />
        </clipPath>
        <clipPath id={id("labelClip")}>
          <rect x="0" y={LABEL.y} width={W} height={LABEL.h} />
        </clipPath>
      </defs>

      {/* shadow */}
      <ellipse className="jar-shadow" cx="50" cy="311" rx="46" ry="5.4" fill={`url(#${id("shadow")})`} />

      {open ? (
        <>
          {/* threaded glass neck + open mouth */}
          <rect x="6" y="12" width="88" height={NECK.y - 12} rx="1.5" fill={`url(#${id("neck")})`} />
          {[14.6, 17.6, 20.6].map((y) => (
            <path key={y} d={`M6.5 ${y} Q50 ${y + 1.8} 93.5 ${y}`} fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.7" />
          ))}
          <ellipse cx="50" cy="12" rx="44" ry="3.4" fill="rgba(38,38,38,0.28)" stroke="#fff" strokeOpacity="0.7" strokeWidth="0.8" />
        </>
      ) : (
        <>
          {/* lid */}
          <path d={roundedPath(3, 0, 94, LID_H, [3, 3], [1.6, 1.6])} fill={`url(#${id("lid")})`} />
          <path d={roundedPath(3, 0, 94, LID_H, [3, 3], [1.6, 1.6])} fill={`url(#${id("ridges")})`} />
          <rect x="4.5" y="1.2" width="91" height="1.4" rx="0.7" fill="#fff" opacity="0.12" />
        </>
      )}

      {/* neck */}
      <rect x="6" y={NECK.y} width="88" height={NECK.h} fill={`url(#${id("neck")})`} />

      {/* glass body */}
      <path d={BODY_PATH} fill={`url(#${id("glass")})`} />

      <g clipPath={`url(#${id("bodyClip")})`}>
        {/* honey */}
        <path d={HONEY_PATH} fill={`url(#${id("honey")})`} />
        <g clipPath={`url(#${id("honeyClip")})`}>
          <rect x={HONEY.x} y={HONEY.y} width={HONEY.w} height={HONEY.h} fill={`url(#${id("depth")})`} />
          {alive ? (
            <rect
              className="jar-shimmer"
              x="-40"
              y={HONEY.y - 20}
              width="34"
              height={HONEY.h + 40}
              fill={`url(#${id("shimmer")})`}
              transform="skewX(-12)"
            />
          ) : null}
          {art.specks.length ? (
            <>
              <g className={alive ? "jar-specks-a" : undefined}>
                {art.specks.slice(0, half).map((s, i) => (
                  <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={s.fill} opacity={s.opacity} transform={`rotate(${s.rot} ${s.cx} ${s.cy})`} />
                ))}
              </g>
              <g className={alive ? "jar-specks-b" : undefined}>
                {art.specks.slice(half).map((s, i) => (
                  <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={s.fill} opacity={s.opacity} transform={`rotate(${s.rot} ${s.cx} ${s.cy})`} />
                ))}
              </g>
            </>
          ) : null}
          {alive
            ? art.bubbles.map((b, i) => (
                <circle
                  key={i}
                  className="jar-bubble"
                  cx={b.cx}
                  cy={b.cy}
                  r={b.r}
                  fill="#FFF4C8"
                  style={{ animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s` }}
                />
              ))
            : null}
          <path d={`M${HONEY.x + 4} ${HONEY.y + 0.6} H${HONEY.x + HONEY.w - 4}`} stroke="#fff" strokeOpacity="0.55" strokeWidth="0.6" />
        </g>

        {/* glass base */}
        <rect x="0" y="299.3" width={W} height="10.7" fill={`url(#${id("base")})`} />
        <rect x="0" y="299.3" width={W} height="0.4" fill="#fff" opacity="0.35" />

        {/* label */}
        <g clipPath={`url(#${id("labelClip")})`}>
          <rect x="0" y={LABEL.y} width={W} height={LABEL.h} fill={labelColor} />
          <motion.g style={{ x: stripX }}>
            {panels(0)}
            {panels(TURN)}
          </motion.g>
          <rect x="0" y={LABEL.y} width={W} height={LABEL.h} fill={`url(#${id("labelShade")})`} />
          {lightLabel ? (
            <>
              <rect x="0" y={LABEL.y} width={W} height="0.5" fill="#262626" opacity="0.35" />
              <rect x="0" y={LABEL.y + LABEL.h - 0.5} width={W} height="0.5" fill="#262626" opacity="0.35" />
            </>
          ) : null}
        </g>

        {/* highlights */}
        <rect x="11" y="33.5" width="8" height="260" rx="4" fill={`url(#${id("streak")})`} />
        <rect x="89.4" y="36.4" width="2.6" height="256" rx="1.3" fill={`url(#${id("streak2")})`} />
        <ellipse cx="50" cy="38" rx="32" ry="1.7" fill={`url(#${id("rim")})`} />
      </g>
      <path d={BODY_PATH} fill="none" stroke="#262626" strokeOpacity="0.16" strokeWidth="0.5" />
    </svg>
  );
}

export const Jar = memo(JarImpl);
