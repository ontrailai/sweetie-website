/**
 * Jar photography — the ONE map from product slug to its photoreal packshot,
 * plus the open-pour hero.
 *
 * Files live in public/jars/ and are generated (cutouts, WebP + PNG, 1x/2x,
 * tiny placeholders) by scripts/jar-assets/build.mjs from the master PNGs;
 * dimensions and placeholders come from ./jarAssets.generated.ts. The
 * masters themselves never ship.
 *
 * Every sealed jar shares one canvas (same height, bottom-aligned), so jars
 * line up in rows without per-jar tweaks.
 */
import { HERO_POUR, SEALED_JARS } from "./jarAssets.generated";

export interface JarPhotoAsset {
  /** Intrinsic size of the 2x file (used for aspect ratio + srcset). */
  width: number;
  height: number;
  /** next/image source (the optimizer resizes it per `sizes`). */
  webp2x: string;
  webp1x: string;
  /** PNG fallbacks for consumers that cannot take WebP (OG images, email). */
  png2x: string;
  png1x: string;
  /** Tiny WebP with alpha, used as a data-URL placeholder. */
  blur: string;
  /** The studio backdrop the jar was shot on (≈ its label colour). */
  backdrop: string;
}

const SEALED: Readonly<Record<string, JarPhotoAsset>> = SEALED_JARS;

/** The sealed packshot for a product slug (undefined → draw the SVG jar). */
export function jarPhoto(slug: string): JarPhotoAsset | undefined {
  return SEALED[slug];
}

/** width / height of every sealed packshot. */
export const JAR_PHOTO_ASPECT = SEALED_JARS.wildflower.width / SEALED_JARS.wildflower.height;

/** Slug of the jar in the hero pour shot. */
export const HERO_SLUG = "wildflower";

/**
 * The hero: No. 01 open, mid-pour. `pour` (jar + ribbon + drops) and `lid`
 * are separate cutouts so the lid can float on its own; `lid.box` places it
 * inside the pour art. `ribbon` continues the pour above the art (`box`
 * places it on the art's top edge) and `ribbon.stream` is its top row, to
 * stretch further up so the pour can start above the fold at any crop.
 */
export const HERO_JAR = HERO_POUR;
