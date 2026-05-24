"use client";

import { CartItem, Product } from "@/types/supabase";
import { CONFIG } from "@/lib/constants";
import { logger } from "@/lib/utils/logger";

const LOCAL_CART_KEY = CONFIG.STORAGE_KEYS.CART;

/** Minimal data stored in localStorage to avoid bloat */
export interface LocalCartItem {
  productId: string;
  sku?: string;
  price: number;
  name: string;
  image?: string;
  quantity: number;
}

/** Payload for adding an item (e.g. from add-to-cart) */
export interface AddToLocalCartPayload {
  productId: string;
  sku?: string;
  price: number;
  name: string;
  image?: string;
  quantity: number;
}

/** Migrate legacy format (full Product) to minimal format */
function normalizeItem(item: unknown): LocalCartItem | null {
  if (!item || typeof item !== "object") return null;
  const o = item as Record<string, unknown>;
  const productId = o.productId ?? (o as { product?: { id?: string } }).product?.id;
  const quantity = typeof o.quantity === "number" ? o.quantity : 1;
  if (!productId || typeof productId !== "string") return null;

  const product = (o as { product?: Record<string, unknown> }).product;
  if (product && typeof product === "object") {
    const price = typeof product.price === "number" ? product.price : 0;
    const name = typeof product.name === "string" ? product.name : "Product";
    const image = product.image_url ?? product.imageUrl;
    const imageStr = typeof image === "string" ? image : undefined;
    return { productId, price, name, image: imageStr, quantity };
  }

  if (typeof o.price === "number" && typeof o.name === "string") {
    return {
      productId: String(productId),
      price: o.price,
      name: o.name,
      sku: typeof o.sku === "string" ? o.sku : undefined,
      image: typeof o.image === "string" ? o.image : undefined,
      quantity,
    };
  }
  return null;
}

export function getLocalCart(): LocalCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const cart = localStorage.getItem(LOCAL_CART_KEY);
    if (!cart) return [];
    const parsed = JSON.parse(cart) as unknown;
    if (!Array.isArray(parsed)) return [];
    const normalized = parsed.map(normalizeItem).filter((x): x is LocalCartItem => x !== null);
    return normalized;
  } catch {
    return [];
  }
}

export function setLocalCart(items: LocalCartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
  } catch (error) {
    logger.error("Failed to save cart to localStorage:", error);
  }
}

export function addToLocalCart(payload: AddToLocalCartPayload | (Product & { quantity?: number })): void {
  const cart = getLocalCart();
  const quantity = "quantity" in payload ? (payload.quantity ?? 1) : 1;
  const productId = "productId" in payload ? payload.productId : (payload as Product).id;
  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    const asMinimal = payload as AddToLocalCartPayload;
    if (typeof asMinimal.price === "number" && typeof asMinimal.name === "string") {
      cart.push({
        productId,
        sku: asMinimal.sku,
        price: asMinimal.price,
        name: asMinimal.name,
        image: asMinimal.image,
        quantity,
      });
    } else {
      const p = payload as Product;
      const img = p.images?.[0]?.image_url ?? p.imageUrl;
      cart.push({
        productId: p.id,
        price: p.price,
        name: p.name,
        image: typeof img === "string" ? img : undefined,
        quantity,
      });
    }
  }
  setLocalCart(cart);
}

export function removeFromLocalCart(productId: string): void {
  const cart = getLocalCart();
  setLocalCart(cart.filter((item) => item.productId !== productId));
}

export function updateLocalCartQuantity(productId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromLocalCart(productId);
    return;
  }
  const cart = getLocalCart();
  const item = cart.find((i) => i.productId === productId);
  if (item) {
    item.quantity = quantity;
    setLocalCart(cart);
  }
}

export function clearLocalCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_CART_KEY);
}

export function getLocalCartItemCount(): number {
  return getLocalCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getLocalCartSubtotal(): number {
  return getLocalCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/** Synthetic id for guest cart items so CartProvider can extract productId */
export const GUEST_CART_ID_PREFIX = "local-";

export function guestCartId(productId: string): string {
  return `${GUEST_CART_ID_PREFIX}${productId}`;
}

export function parseGuestCartId(cartItemId: string): string | null {
  if (!cartItemId.startsWith(GUEST_CART_ID_PREFIX)) return null;
  return cartItemId.slice(GUEST_CART_ID_PREFIX.length) || null;
}

/**
 * Convert minimal local cart to CartItem[] for CartSheet / CartPageClient.
 * Uses stable id `local-${productId}` for remove/update.
 */
export function getLocalCartAsCartItems(): CartItem[] {
  return getLocalCart().map((item) => ({
    id: guestCartId(item.productId),
    quantity: item.quantity,
    product_id: item.productId,
    cart_id: "local",
    product: {
      id: item.productId,
      name: item.name,
      price: item.price,
      slug: item.productId,
      imageUrl: item.image,
      images: item.image ? [{ image_url: item.image, id: "", product_id: item.productId, is_primary: true, image_public_id: null, created_at: "" }] : [],
    } as Product,
  }));
}
