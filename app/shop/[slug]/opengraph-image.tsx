import { ImageResponse } from "next/og";
import { PRODUCTS, getProduct } from "@/lib/catalog";
import { ogFonts } from "@/lib/og/fonts";
import { OgJar } from "@/lib/og/OgJar";

export const alt = "A Sweet Bee honey jar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug) ?? PRODUCTS[0]!;
  const bg = p.jar.labelColor.toUpperCase() === "#F6EDDD" ? "#004832" : "#F6EDDD";
  const ink = bg === "#F6EDDD" ? "#262626" : "#F6EDDD";
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: bg, color: ink, padding: 64, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 700 }}>
          <div style={{ display: "flex", fontFamily: "Mono", fontSize: 24, letterSpacing: "0.2em", color: bg === "#F6EDDD" ? "#004832" : "#F6EDDD" }}>
            {`NO. ${p.number} · ${p.category.toUpperCase()}`}
          </div>
          <div style={{ display: "flex", fontFamily: "Serif", fontSize: 132, lineHeight: 0.9, color: bg === "#F6EDDD" ? "#FF007C" : "#F6EDDD" }}>{p.name}</div>
          <div style={{ display: "flex", fontFamily: "Serif", fontStyle: "italic", fontSize: 48 }}>{p.tagline}</div>
          <div style={{ display: "flex", fontFamily: "Serif", fontSize: 36 }}>
            <span style={{ fontStyle: "italic" }}>Sweet</span>
            <span style={{ marginLeft: 8 }}>Bee · San Diego County</span>
          </div>
        </div>
        <OgJar jar={p.jar} number={p.number} name={p.name} width={160} />
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
