"use client";

import { useCallback, useState } from "react";
import { addToCart as serverAddToCart } from "@/lib/actions/cart";
import { emitCartUpdated } from "@/lib/utils/cartEvents";
import { addToLocalCart, type AddToLocalCartPayload } from "@/lib/utils/localCart";

/** Minimal product shape for add-to-cart (from card, carousel, or detail page) */
export interface AddToCartProduct {
  id: string;
  name: string;
  price: number;
  slug?: string;
  sku?: string;
  imageUrl?: string;
  images?: { image_url?: string }[];
}

function toPayload(product: AddToCartProduct, quantity: number): AddToLocalCartPayload {
  const image =
    product.imageUrl ??
    product.images?.[0]?.image_url;
  return {
    productId: product.id,
    sku: product.sku,
    price: product.price,
    name: product.name,
    image: typeof image === "string" ? image : undefined,
    quantity,
  };
}

export function useCartActions() {
  const [adding, setAdding] = useState(false);

  const addToCart = useCallback(
    async (product: AddToCartProduct, quantity: number = 1) => {
      setAdding(true);
      try {
        const result = await serverAddToCart(product.id, quantity);

        if (result?.useLocalStorage) {
          addToLocalCart(toPayload(product, quantity));
          emitCartUpdated();
          return { success: true };
        }

        if (result?.error) return { error: result.error };
        emitCartUpdated();
        return result;
      } finally {
        setAdding(false);
      }
    },
    []
  );

  return { addToCart, adding };
}
