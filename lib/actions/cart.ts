"use server";

import { createClient } from "@/lib/supabase/server";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { logger } from "@/lib/utils/logger";
import { MESSAGES } from "@/lib/constants/messages";

/**
 * For authenticated users: Adds item to Supabase cart
 * For guest users: Returns instruction to use local storage (handled client-side)
 */
export const addToCart = async (productId: string, quantity: number) => {
  const session = await auth();
  const userId = session?.user?.id;

  // If not authenticated, return signal to use local storage
  if (!userId) {
    return { useLocalStorage: true, productId, quantity };
  }

  const supabase = await createClient();

  // Find or create cart for authenticated user
  let { data: cart, error: fetchError } = await supabase
    .from('carts')
    .select()
    .eq('user_id', userId)
    .maybeSingle();
  
  if (fetchError && fetchError.code !== 'PGRST116') {
    logger.error('Error fetching cart:', fetchError);
    return { error: `${MESSAGES.CART.FETCH_ERROR}: ${fetchError.message}` };
  }

  // Create cart if it doesn't exist
  if (!cart) {
    const { data: newCart, error: createError } = await supabase
      .from('carts')
      .insert({ user_id: userId })
      .select()
      .single();
    
    if (createError) {
      logger.error('Error creating cart:', createError);
      return { error: `${MESSAGES.CART.CREATE_ERROR}: ${createError.message}` };
    }
    cart = newCart;
  }

  if (!cart) {
    logger.error('Cart is null after creation attempt');
    return { error: MESSAGES.CART.NOT_FOUND };
  }

  // Check if item is already in cart
  const { data: cartItem, error: cartItemError } = await supabase
    .from('cart_items')
    .select()
    .eq('cart_id', cart.id)
    .eq('product_id', productId)
    .maybeSingle();
  
  if (cartItemError && cartItemError.code !== 'PGRST116') {
    logger.error('Error checking cart item:', cartItemError);
    return { error: `${MESSAGES.CART.CHECK_ERROR}: ${cartItemError.message}` };
  }

  if (cartItem) {
    // Update quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: cartItem.quantity + quantity })
      .eq('id', cartItem.id);
    
    if (error) {
      return { error: MESSAGES.CART.UPDATE_ERROR };
    }
  } else {
    // Add new item
    const { error } = await supabase.from('cart_items').insert({
      cart_id: cart.id,
      product_id: productId,
      quantity,
    });
    
    if (error) {
      return { error: MESSAGES.CART.ADD_ERROR };
    }
  }

  return { success: MESSAGES.CART.ADD_SUCCESS };
};

export const removeFromCart = async (cartItemId: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) {
    return { error: MESSAGES.CART.REMOVE_ERROR };
  }

  return { success: MESSAGES.CART.REMOVE_SUCCESS };
};

export const updateCartQuantity = async (cartItemId: string, quantity: number) => {
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId);

  if (error) {
    return { error: MESSAGES.CART.UPDATE_ERROR };
  }

  return { success: MESSAGES.CART.UPDATE_SUCCESS };
};
