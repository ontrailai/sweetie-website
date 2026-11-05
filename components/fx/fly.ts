/**
 * Fly-to-cart event bus. Any "add" button calls flyToCart(sourceEl, look);
 * <CartFx> (mounted once in the layout) animates a mini jar along an arc
 * into the cart button, squishes the badge and bursts honey + confetti.
 * A bundle (the Discovery Set) passes its jars and flies as a small fan of
 * them, the same fan the cart line shows, never as one of its jars.
 */
export interface FlyLook {
  labelColor: string;
  honey: string;
}
export interface FlyJar {
  /** The jar photo already on screen in the source (so the flight needs no new download); null → drawn jar. */
  photo: string | null;
  look: FlyLook;
}
export interface FlyDetail {
  rect: { x: number; y: number; w: number; h: number } | null;
  /** One jar for a single product; several (fanned) for a bundle. */
  jars: FlyJar[];
  bundle: boolean;
  look: FlyLook;
  label: string;
}

export const FLY_EVENT = "sweetbee:fly";
export const LANDED_EVENT = "sweetbee:landed";

function shownPhoto(source: Element | null, slug?: string) {
  const img = source?.querySelector<HTMLImageElement>(slug ? `img[data-jar-photo="${slug}"]` : "img[data-jar-photo]");
  return img?.complete && img.naturalWidth ? img.currentSrc || img.src : null;
}

/**
 * `bundle`: the jars that stand for a set (slug + look each). Their photos
 * are taken from the source when it shows them; otherwise they're drawn.
 */
export function flyToCart(source: Element | null, look: FlyLook, label: string, bundle?: readonly { slug: string; look: FlyLook }[]) {
  const r = source?.getBoundingClientRect();
  const jars = bundle?.length
    ? bundle.map((j) => ({ photo: shownPhoto(source, j.slug), look: j.look }))
    : [{ photo: shownPhoto(source), look }];
  const detail: FlyDetail = { rect: r ? { x: r.left, y: r.top, w: r.width, h: r.height } : null, jars, bundle: !!bundle?.length, look, label };
  window.dispatchEvent(new CustomEvent<FlyDetail>(FLY_EVENT, { detail }));
}
