/**
 * Fly-to-cart event bus. Any "add" button calls flyToCart(sourceEl, look);
 * <CartFx> (mounted once in the layout) animates a mini jar along an arc
 * into the cart button, squishes the badge and bursts honey + confetti.
 */
export interface FlyLook {
  labelColor: string;
  honey: string;
}
export interface FlyDetail {
  rect: { x: number; y: number; w: number; h: number } | null;
  look: FlyLook;
  label: string;
}

export const FLY_EVENT = "sweetbee:fly";
export const LANDED_EVENT = "sweetbee:landed";

export function flyToCart(source: Element | null, look: FlyLook, label: string) {
  const r = source?.getBoundingClientRect();
  const detail: FlyDetail = { rect: r ? { x: r.left, y: r.top, w: r.width, h: r.height } : null, look, label };
  window.dispatchEvent(new CustomEvent<FlyDetail>(FLY_EVENT, { detail }));
}
