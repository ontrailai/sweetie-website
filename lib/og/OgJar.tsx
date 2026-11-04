import type { JarLook } from "@/lib/catalog";

/** A simplified jar for OG images (Satori supports flexbox + gradients only). */
export function OgJar({ jar, number, name, width }: { jar: JarLook; number: string; name: string; width: number }) {
  const h = width * 3.1;
  const ink = jar.labelText ?? "#F6EDDD";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width, height: h }}>
      <div style={{ width: width * 0.94, height: h * 0.072, borderRadius: `${width * 0.03}px ${width * 0.03}px 4px 4px`, background: "linear-gradient(90deg,#0e0e0e,#5a5a5a 23%,#1c1c1c 70%,#3e3e3e 86%,#0e0e0e)" }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width,
          flex: 1,
          borderRadius: `${width * 0.07}px ${width * 0.07}px ${width * 0.09}px ${width * 0.09}px`,
          background: `linear-gradient(90deg, ${jar.honeyDark} 0%, ${jar.honey} 24%, #f6d58a 36%, ${jar.honey} 52%, ${jar.honeyDark} 100%)`,
          border: "2px solid rgba(38,38,38,0.15)",
          paddingTop: h * 0.2,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: h * 0.45,
            background: jar.labelColor,
            color: ink,
            gap: width * 0.04,
          }}
        >
          <div style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: width * 0.13 }}>Sweet Bee</div>
          <div style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: width * 0.2 }}>{`No. ${number}`}</div>
          <div style={{ fontFamily: "Serif", fontSize: width * 0.075, letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center", padding: "0 8%" }}>
            {name}
          </div>
        </div>
      </div>
    </div>
  );
}
