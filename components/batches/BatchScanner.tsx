"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { BATCHES, findBatch, getProduct, type Batch } from "@/lib/catalog";
import { Jar } from "@/components/jar/Jar";
import { makeQrPath } from "@/components/jar/jar-art";
import { BatchCode, BatchDl } from "./BatchDetails";

export const SELECT_BATCH_EVENT = "sweetbee:select-batch";

type Result = { kind: "found"; batch: Batch } | { kind: "missing"; query: string } | null;

interface Detector {
  detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]>;
}
type DetectorCtor = new (opts: { formats: string[] }) => Detector;

/** Pull a batch code out of whatever a QR holds: a URL (?batch= or #batch-) or a bare code. */
function codeFromScan(raw: string): string {
  try {
    const u = new URL(raw);
    return u.searchParams.get("batch") || u.hash.replace(/^#batch-/, "") || raw;
  } catch {
    return raw;
  }
}

/**
 * "Scan your jar": a viewfinder with manual entry (always works), a deep
 * link (?batch=SB-01-C, what the QR on the label should point to) and, where
 * the browser has BarcodeDetector, a real camera scan.
 */
export function BatchScanner() {
  const id = useId();
  const [q, setQ] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [camera, setCamera] = useState<"off" | "on" | "error">("off");
  const [canScan, setCanScan] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const example = BATCHES[0]!.code;

  const lookup = useCallback((raw: string) => {
    const query = raw.trim();
    if (!query) return setResult(null);
    const batch = findBatch(query);
    setResult(batch ? { kind: "found", batch } : { kind: "missing", query });
    if (batch) window.dispatchEvent(new CustomEvent(SELECT_BATCH_EVENT, { detail: batch.code }));
  }, []);

  // Deep link from the QR code: /batches?batch=SB-01-C
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("batch");
    const has = "BarcodeDetector" in window && !!navigator.mediaDevices?.getUserMedia;
    const t = setTimeout(() => {
      setCanScan(has);
      if (code) {
        setQ(code);
        lookup(code);
      }
    }, 0);
    return () => clearTimeout(t);
  }, [lookup]);

  const stopCamera = useCallback(() => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setCamera("off");
  }, []);

  useEffect(() => () => stream.current?.getTracks().forEach((t) => t.stop()), []);

  useEffect(() => {
    if (camera !== "on") return;
    const Ctor = (window as unknown as { BarcodeDetector?: DetectorCtor }).BarcodeDetector;
    const v = video.current;
    if (!Ctor || !v) return;
    const detector = new Ctor({ formats: ["qr_code"] });
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      if (!alive) return;
      try {
        const codes = v.readyState >= 2 ? await detector.detect(v) : [];
        const hit = codes[0]?.rawValue;
        if (hit) {
          const code = codeFromScan(hit);
          setQ(code);
          lookup(code);
          stopCamera();
          return;
        }
      } catch {
        /* keep trying */
      }
      timer = setTimeout(tick, 250);
    };
    void tick();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [camera, lookup, stopCamera]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      stream.current = s;
      setCamera("on");
      requestAnimationFrame(() => {
        if (video.current) {
          video.current.srcObject = s;
          void video.current.play();
        }
      });
    } catch {
      setCamera("error");
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    lookup(q);
  };

  const product = result?.kind === "found" ? getProduct(result.batch.productSlug) : undefined;

  return (
    <div className="flex flex-col gap-6">
      {/* viewfinder */}
      <div className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-[36px] border-2 border-canvas/30 bg-[#1a1a1a]">
        {camera === "on" ? (
          <video ref={video} muted playsInline className="absolute inset-0 size-full object-cover" aria-label="Camera preview for scanning a jar QR code" />
        ) : (
          <div aria-hidden="true" className="absolute inset-[18%] grid place-items-center rounded-2xl bg-canvas p-[8%]">
            <svg viewBox="0 0 26 26" className="size-full">
              <path d={makeQrPath(product?.number ?? "01", 0, 0, 26)} fill="#262626" />
            </svg>
          </div>
        )}
        {/* corner brackets */}
        {["left-5 top-5 border-l-4 border-t-4 rounded-tl-2xl", "right-5 top-5 border-r-4 border-t-4 rounded-tr-2xl", "left-5 bottom-5 border-l-4 border-b-4 rounded-bl-2xl", "right-5 bottom-5 border-r-4 border-b-4 rounded-br-2xl"].map((c) => (
          <span key={c} aria-hidden="true" className={`absolute size-14 border-peacock ${c}`} />
        ))}
        <span aria-hidden="true" className="scanline absolute inset-x-[10%] h-1 rounded-full bg-peacock shadow-[0_0_24px_6px_rgba(255,0,124,0.6)]" />
        {camera === "on" ? (
          <button type="button" onClick={stopCamera} className="chip absolute bottom-4 left-1/2 min-h-11 -translate-x-1/2 border-2 border-nero px-4">
            Stop camera
          </button>
        ) : null}
      </div>

      <form role="search" aria-label="Batch lookup" onSubmit={onSubmit} className="ticket flex flex-col gap-3 p-6 [--notch-y:50%]">
        <label htmlFor={`${id}-batch`} className="t-eyebrow">
          Type the batch number from your jar
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            id={`${id}-batch`}
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder={`e.g. ${example}`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-describedby={`${id}-hint`}
            className="min-h-[56px] min-w-0 flex-[1_1_180px] rounded-full border-2 border-nero bg-white px-5 font-mono text-[18px] font-bold uppercase tracking-[0.12em] text-nero placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-nero/60"
          />
          <button type="submit" className="btn min-h-[56px] bg-peacock text-canvas">
            Find it
          </button>
        </div>
        <p id={`${id}-hint`} className="text-[13px] leading-normal">
          Batch numbers here are placeholders until launch. Try {example}.
        </p>
        {canScan ? (
          <button type="button" onClick={() => void (camera === "on" ? stopCamera() : startCamera())} className="btn btn-sm self-start bg-nero text-canvas">
            {camera === "on" ? "Stop camera" : "Scan with camera"}
          </button>
        ) : null}
        {camera === "error" ? <p className="text-[14px] font-bold">Couldn&apos;t open the camera. Type the number instead.</p> : null}

        <div aria-live="polite">
          <AnimatePresence mode="wait">
            {result?.kind === "found" && product ? (
              <motion.div
                key={result.batch.code}
                initial={{ opacity: 0, y: 16, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-2 flex gap-5 border-t-2 border-dashed border-nero/40 pt-5"
              >
                <div className="w-14 shrink-0">
                  <Jar {...product.jar} number={product.number} name={product.name} descriptor={product.descriptor} decorative alive={false} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <p className="t-eyebrow">
                    It&apos;s a match · No. {product.number} {product.name}
                  </p>
                  <p className="font-serif text-[30px] font-medium leading-none">
                    <BatchCode batch={result.batch} />
                  </p>
                  <BatchDl batch={result.batch} />
                  <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-bold">
                    <a href="#map" className="underline underline-offset-4">
                      See it on the hive map
                    </a>
                    <Link href={`/shop/${product.slug}`} className="underline underline-offset-4">
                      Shop No. {product.number}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : result?.kind === "missing" ? (
              <motion.p key="missing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2 border-t-2 border-dashed border-nero/40 pt-4 text-[15px] leading-normal">
                No batch matches <strong>{result.query}</strong> yet. Double-check the number on your jar, or browse every batch below.
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
