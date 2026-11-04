import { ImageResponse } from "next/og";
import { PRODUCTS } from "@/lib/catalog";
import { ogFonts } from "@/lib/og/fonts";
import { OgJar } from "@/lib/og/OgJar";

export const alt = "Sweet Bee Honey. Feel the hum. Raw honey from San Diego County.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#FF007C", color: "#F6EDDD", padding: 64, justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontFamily: "Serif", fontSize: 48 }}>
            <span style={{ fontStyle: "italic" }}>Sweet</span>
            <span style={{ marginLeft: 10 }}>Bee</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Serif", fontSize: 168, lineHeight: 0.85 }}>
            <span>Feel the</span>
            <span style={{ fontStyle: "italic" }}>hum.</span>
          </div>
          <div style={{ display: "flex", background: "#F6EDDD", color: "#004832", fontFamily: "Mono", fontSize: 22, padding: "8px 16px", letterSpacing: "0.12em" }}>
            RAW HONEY · SAN DIEGO COUNTY
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
          {PRODUCTS.slice(0, 3).map((p, i) => (
            <div key={p.slug} style={{ display: "flex", marginBottom: i === 1 ? 40 : 0 }}>
              <OgJar jar={p.jar} number={p.number} name={p.name} width={120} />
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
