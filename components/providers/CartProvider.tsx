"use client";

import * as React from "react";
import { createContext, useContext, ReactNode } from "react";
import { CartItem } from "@/types/supabase";
import {
  removeFromCart as removeFromCartAction,
  updateCartQuantity as updateCartQuantityAction,
} from "@/lib/actions/cart";
import { useRouter } from "next/navigation";
import { CART_EVENTS, emitCartUpdated } from "@/lib/utils/cartEvents";
import {
  getLocalCartAsCartItems,
  getLocalCartSubtotal,
  parseGuestCartId,
  removeFromLocalCart,
  updateLocalCartQuantity,
} from "@/lib/utils/localCart";

interface CartContextType {
  cartItems: CartItem[];
  subtotal: number;
  itemCount: number;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  initialCartItems?: CartItem[];
  initialSubtotal?: number;
}

export function CartProvider({
  children,
  initialCartItems = [],
  initialSubtotal = 0,
}: CartProviderProps) {
  const [cartItems, setCartItems] = React.useState<CartItem[]>(initialCartItems);
  const [subtotal, setSubtotal] = React.useState<number>(initialSubtotal);
  const router = useRouter();

  // Sync guest cart from localStorage on mount and when cart-updated fires
  React.useEffect(() => {
    const syncGuestCart = () => {
      const localItems = getLocalCartAsCartItems();
      const localSubtotal = getLocalCartSubtotal();
      setCartItems(localItems);
      setSubtotal(localSubtotal);
    };
    syncGuestCart();
    window.addEventListener(CART_EVENTS.UPDATED, syncGuestCart);
    return () => window.removeEventListener(CART_EVENTS.UPDATED, syncGuestCart);
  }, []);

  const itemCount = React.useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const removeFromCart = React.useCallback(async (cartItemId: string) => {
    const productId = parseGuestCartId(cartItemId);
    if (productId !== null) {
      removeFromLocalCart(productId);
      emitCartUpdated();
      setCartItems(getLocalCartAsCartItems());
      setSubtotal(getLocalCartSubtotal());
      return;
    }
    const result = await removeFromCartAction(cartItemId);
    if (result.success) {
      setCartItems((prev) => {
        const updated = prev.filter((item) => item.id !== cartItemId);
        const newSubtotal = updated.reduce(
          (acc, item) => acc + (item.product?.price ?? 0) * item.quantity,
          0
        );
        setSubtotal(newSubtotal);
        return updated;
      });
    }
  }, []);

  const updateQuantity = React.useCallback(async (cartItemId: string, quantity: number) => {
    const productId = parseGuestCartId(cartItemId);
    if (productId !== null) {
      updateLocalCartQuantity(productId, quantity);
      emitCartUpdated();
      setCartItems(getLocalCartAsCartItems());
      setSubtotal(getLocalCartSubtotal());
      return;
    }
    const result = await updateCartQuantityAction(cartItemId, quantity);
    if (result.success) {
      setCartItems((prev) => {
        const updated = prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        const newSubtotal = updated.reduce(
          (acc, item) => acc + (item.product?.price ?? 0) * item.quantity,
          0
        );
        setSubtotal(newSubtotal);
        return updated;
      });
    }
  }, []);

  const refreshCart = React.useCallback(async () => {
    router.refresh();
  }, [router]);

  const value = React.useMemo(
    () => ({
      cartItems,
      subtotal,
      itemCount,
      removeFromCart,
      updateQuantity,
      refreshCart,
    }),
    [cartItems, subtotal, itemCount, removeFromCart, updateQuantity, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
