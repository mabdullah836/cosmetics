"use client";

import * as React from "react";
import { createContext, useContext, ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { CartItem } from "@/types/supabase";
import {
  removeFromCart as removeFromCartAction,
  updateCartQuantity as updateCartQuantityAction,
  getHeaderCart,
} from "@/lib/actions/cart";
import { createClient } from "@/lib/supabase/client";
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
  isAuthenticated: boolean;
  isSessionReady: boolean;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = React.useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isSessionReady, setIsSessionReady] = React.useState(false);
  const isAuthenticatedRef = React.useRef(false);
  const isMountedRef = React.useRef(false);

  const applyGuestCart = React.useCallback(() => {
    if (!isMountedRef.current) return;
    setCartItems(getLocalCartAsCartItems());
    setSubtotal(getLocalCartSubtotal());
  }, []);

  const loadServerCart = React.useCallback(async () => {
    const result = await getHeaderCart();
    if (!isMountedRef.current) return;
    if (result.isAuthenticated) {
      setCartItems(result.cartItems);
      setSubtotal(result.subtotal);
    }
  }, []);

  const refreshCart = React.useCallback(async () => {
    if (!isMountedRef.current) return;
    if (isAuthenticatedRef.current) {
      await loadServerCart();
    } else {
      applyGuestCart();
    }
  }, [loadServerCart, applyGuestCart]);

  React.useEffect(() => {
    isMountedRef.current = true;
    const supabase = createClient();

    const handleSession = (session: Session | null) => {
      if (!isMountedRef.current) return;

      // Defer cart updates until after hydration to avoid SSR/client mismatches.
      queueMicrotask(() => {
        if (!isMountedRef.current) return;

        if (session?.user) {
          isAuthenticatedRef.current = true;
          setIsAuthenticated(true);
          void loadServerCart().finally(() => {
            if (isMountedRef.current) {
              setIsSessionReady(true);
            }
          });
          return;
        }

        isAuthenticatedRef.current = false;
        setIsAuthenticated(false);
        applyGuestCart();
        setIsSessionReady(true);
      });
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [loadServerCart, applyGuestCart]);

  React.useEffect(() => {
    const handleCartUpdate = () => {
      void refreshCart();
    };
    window.addEventListener(CART_EVENTS.UPDATED, handleCartUpdate);
    return () => window.removeEventListener(CART_EVENTS.UPDATED, handleCartUpdate);
  }, [refreshCart]);

  const itemCount = React.useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const removeFromCart = React.useCallback(async (cartItemId: string) => {
    const productId = parseGuestCartId(cartItemId);
    if (productId !== null) {
      removeFromLocalCart(productId);
      emitCartUpdated();
      return;
    }
    const result = await removeFromCartAction(cartItemId);
    if (!isMountedRef.current || !result.success) return;

    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== cartItemId);
      const newSubtotal = updated.reduce(
        (acc, item) => acc + (item.product?.price ?? 0) * item.quantity,
        0
      );
      if (isMountedRef.current) {
        setSubtotal(newSubtotal);
      }
      return updated;
    });
  }, []);

  const updateQuantity = React.useCallback(async (cartItemId: string, quantity: number) => {
    const productId = parseGuestCartId(cartItemId);
    if (productId !== null) {
      updateLocalCartQuantity(productId, quantity);
      emitCartUpdated();
      return;
    }
    const result = await updateCartQuantityAction(cartItemId, quantity);
    if (!isMountedRef.current || !result.success) return;

    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      );
      const newSubtotal = updated.reduce(
        (acc, item) => acc + (item.product?.price ?? 0) * item.quantity,
        0
      );
      if (isMountedRef.current) {
        setSubtotal(newSubtotal);
      }
      return updated;
    });
  }, []);

  const value = React.useMemo(
    () => ({
      cartItems,
      subtotal,
      itemCount,
      isAuthenticated,
      isSessionReady,
      removeFromCart,
      updateQuantity,
      refreshCart,
    }),
    [
      cartItems,
      subtotal,
      itemCount,
      isAuthenticated,
      isSessionReady,
      removeFromCart,
      updateQuantity,
      refreshCart,
    ]
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
