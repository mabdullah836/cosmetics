"use client";

import * as React from "react";
import { createContext, useContext, ReactNode } from "react";
import { CartItem } from "@/types/supabase";

interface CartContextType {
  cartItems: CartItem[];
  subtotal: number;
  itemCount: number;
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
  initialSubtotal = 0 
}: CartProviderProps) {
  const [cartItems, setCartItems] = React.useState<CartItem[]>(initialCartItems);
  const [subtotal, setSubtotal] = React.useState<number>(initialSubtotal);

  const itemCount = React.useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const refreshCart = React.useCallback(async () => {
    // This can be implemented when an API route is available
    // For now, it's a placeholder that components can call
    try {
      // Future: fetch from /api/cart or use server action
      window.location.reload();
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      cartItems,
      subtotal,
      itemCount,
      refreshCart,
    }),
    [cartItems, subtotal, itemCount, refreshCart]
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
