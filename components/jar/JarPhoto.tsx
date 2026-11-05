import Image from "next/image";
import type { Product } from "@/lib/catalog";
import { jarPhoto } from "@/lib/jarAssets";
import { Jar } from "./Jar";

export type JarPhotoProduct = Pick<Product, "slug" | "number" | "name" | "descriptor" | "jar">;

/**
 * A jar as shoppers see it: the photoreal packshot (a transparent cutout, so
 * it sits on any colour), served through next/image. Lazy by default; pass
 * `eager` (+ `priority` for the LCP image) above the fold.
 *
 * Every packshot shares one 736×1600 canvas, so a given width always gives
 * the same jar height. Falls back to the SVG jar only if a product has no
 * photo yet.
 */
export function JarPhoto({
  product: p,
  sizes,
  alt = "",
  className = "h-auto w-full",
  eager = false,
  priority = false,
  placeholder = true,
}: {
  product: JarPhotoProduct;
  /** Rendered width, for the srcset (e.g. "(min-width: 1024px) 20vw, 40vw"). */
  sizes: string;
  /** Empty (decorative) by default: most jars sit next to their name. */
  alt?: string;
  className?: string;
  eager?: boolean;
  priority?: boolean;
  /** Soft silhouette while loading (skip for tiny thumbnails). */
  placeholder?: boolean;
}) {
  const photo = jarPhoto(p.slug);
  if (!photo) {
    return (
      <div className={className} style={{ aspectRatio: "100 / 318" }}>
        <Jar {...p.jar} number={p.number} name={p.name} descriptor={p.descriptor} decorative={!alt} alive={false} />
      </div>
    );
  }
  return (
    <Image
      src={photo.webp2x}
      width={photo.width}
      height={photo.height}
      alt={alt}
      sizes={sizes}
      loading={eager || priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      // next's "blur" placeholder flattens alpha to black, so hand it the
      // tiny transparent WebP directly.
      placeholder={placeholder ? (photo.blur as `data:image/${string}`) : "empty"}
      draggable={false}
      data-jar-photo={p.slug}
      className={`block select-none ${className}`}
    />
  );
}
