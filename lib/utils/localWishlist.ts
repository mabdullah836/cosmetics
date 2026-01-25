/**
 * Local storage utilities for wishlist (guest users)
 */

import { CONFIG } from "@/lib/constants";

export interface LocalWishlistItem {
  productId: string;
  addedAt: string;
}

const WISHLIST_STORAGE_KEY = CONFIG.STORAGE_KEYS.WISHLIST;

export function getLocalWishlist(): LocalWishlistItem[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToLocalWishlist(productId: string): void {
  if (typeof window === "undefined") return;
  
  const wishlist = getLocalWishlist();
  
  // Check if already in wishlist
  if (wishlist.some(item => item.productId === productId)) {
    return;
  }
  
  wishlist.push({
    productId,
    addedAt: new Date().toISOString(),
  });
  
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
}

export function removeFromLocalWishlist(productId: string): void {
  if (typeof window === "undefined") return;
  
  const wishlist = getLocalWishlist();
  const filtered = wishlist.filter(item => item.productId !== productId);
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(filtered));
}

export function isInLocalWishlist(productId: string): boolean {
  const wishlist = getLocalWishlist();
  return wishlist.some(item => item.productId === productId);
}

export function clearLocalWishlist(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WISHLIST_STORAGE_KEY);
}

export function getLocalWishlistCount(): number {
  return getLocalWishlist().length;
}
