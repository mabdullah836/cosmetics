"use client";

import { CartItem, Product } from "@/types/supabase";
import { CONFIG } from "@/lib/constants";
import { logger } from "@/lib/utils/logger";

const LOCAL_CART_KEY = CONFIG.STORAGE_KEYS.CART;

export interface LocalCartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export const getLocalCart = (): LocalCartItem[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const cart = localStorage.getItem(LOCAL_CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const setLocalCart = (items: LocalCartItem[]): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
  } catch (error) {
    logger.error("Failed to save cart to localStorage:", error);
  }
};

export const addToLocalCart = (product: Product, quantity: number = 1): void => {
  const cart = getLocalCart();
  const existingItem = cart.find((item) => item.productId === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      product,
      quantity,
    });
  }

  setLocalCart(cart);
};

export const removeFromLocalCart = (productId: string): void => {
  const cart = getLocalCart();
  const updated = cart.filter((item) => item.productId !== productId);
  setLocalCart(updated);
};

export const updateLocalCartQuantity = (productId: string, quantity: number): void => {
  if (quantity <= 0) {
    removeFromLocalCart(productId);
    return;
  }

  const cart = getLocalCart();
  const item = cart.find((item) => item.productId === productId);
  if (item) {
    item.quantity = quantity;
    setLocalCart(cart);
  }
};

export const clearLocalCart = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_CART_KEY);
};

export const getLocalCartItemCount = (): number => {
  const cart = getLocalCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

export const getLocalCartSubtotal = (): number => {
  const cart = getLocalCart();
  return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
};
