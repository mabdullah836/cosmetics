"use server";

import { createClient } from "@/lib/supabase/server";
import { getLocalCart, LocalCartItem } from "@/lib/utils/localCart";
import { logger } from "@/lib/utils/logger";

/**
 * Migrates local cart items to Supabase after user login
 * This is called client-side after successful authentication
 */
export const migrateLocalCartToSupabase = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  // This will be called from client, so we need to get local cart from client
  // For now, we'll create a client action that handles this
  return { success: true };
};

/**
 * Server action to create Supabase cart from local cart items
 * Called after successful login
 */
export const createCartFromLocalItems = async (
  localCartItems: LocalCartItem[],
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  if (localCartItems.length === 0) {
    return { success: true };
  }

  const supabase = await createClient();

  try {
    // Create or get existing cart
    let { data: cart, error: cartError } = await supabase
      .from("carts")
      .select()
      .eq("user_id", userId)
      .maybeSingle();

    if (cartError && cartError.code !== "PGRST116") {
      return { success: false, error: cartError.message };
    }

    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from("carts")
        .insert({ user_id: userId })
        .select()
        .single();

      if (createError) {
        return { success: false, error: createError.message };
      }
      cart = newCart;
    }

    if (!cart) {
      return { success: false, error: "Failed to create cart" };
    }

    // Get existing cart items
    const { data: existingItems } = await supabase
      .from("cart_items")
      .select("product_id, quantity")
      .eq("cart_id", cart.id);

    const existingProductIds = new Set(
      existingItems?.map((item) => item.product_id) || []
    );

    // Prepare items to insert/update
    const itemsToInsert: Array<{
      cart_id: string;
      product_id: string;
      quantity: number;
    }> = [];

    const itemsToUpdate: Array<{
      id: string;
      quantity: number;
    }> = [];

    for (const localItem of localCartItems) {
      const existingItem = existingItems?.find(
        (item) => item.product_id === localItem.productId
      );

      if (existingItem) {
        // Update quantity (merge with existing)
        const existingCartItem = existingItems?.find(
          (item) => item.product_id === localItem.productId
        );
        if (existingCartItem) {
          // We need the cart_item id to update
          const { data: cartItem } = await supabase
            .from("cart_items")
            .select("id")
            .eq("cart_id", cart.id)
            .eq("product_id", localItem.productId)
            .single();

          if (cartItem) {
            itemsToUpdate.push({
              id: cartItem.id,
              quantity: existingItem.quantity + localItem.quantity,
            });
          }
        }
      } else {
        // Insert new item
        itemsToInsert.push({
          cart_id: cart.id,
          product_id: localItem.productId,
          quantity: localItem.quantity,
        });
      }
    }

    // Insert new items
    if (itemsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("cart_items")
        .insert(itemsToInsert);

      if (insertError) {
        return { success: false, error: insertError.message };
      }
    }

    // Update existing items
    for (const item of itemsToUpdate) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: item.quantity })
        .eq("id", item.id);

      if (updateError) {
        return { success: false, error: updateError.message };
      }
    }

    return { success: true };
  } catch (error) {
    logger.error("Error migrating cart:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
