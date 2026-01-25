"use client";

import * as React from "react";
import { createContext, useContext, ReactNode } from "react";
import { CartItem } from "@/types/supabase";
import { removeFromCart as removeFromCartAction, updateCartQuantity as updateCartQuantityAction } from "@/lib/actions/cart";
import { useRouter } from "next/navigation";

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
  initialSubtotal = 0 
}: CartProviderProps) {
  const [cartItems, setCartItems] = React.useState<CartItem[]>(initialCartItems);
  const [subtotal, setSubtotal] = React.useState<number>(initialSubtotal);
  const router = useRouter();

  const itemCount = React.useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const removeFromCart = React.useCallback(async (cartItemId: string) => {
    const result = await removeFromCartAction(cartItemId);
    if (result.success) {
      setCartItems(prev => {
        const updated = prev.filter(item => item.id !== cartItemId);
        const newSubtotal = updated.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setSubtotal(newSubtotal);
        return updated;
      });
    }
  }, []);

  const updateQuantity = React.useCallback(async (cartItemId: string, quantity: number) => {
    const result = await updateCartQuantityAction(cartItemId, quantity);
    if (result.success) {
      setCartItems(prev => {
        const updated = prev.map(item => 
          item.id === cartItemId ? { ...item, quantity } : item
        );
        const newSubtotal = updated.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
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
