/**
 * Custom events for cart updates so components (e.g. Header) can react
 * without polling localStorage.
 */
export const CART_EVENTS = {
  UPDATED: "cart-updated",
  ITEM_ADDED: "cart-item-added",
  ITEM_REMOVED: "cart-item-removed",
} as const;

export function emitCartUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CART_EVENTS.UPDATED));
}
