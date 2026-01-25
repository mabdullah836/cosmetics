"use server";

import { createClient } from "@/lib/supabase/server";
import { auth } from "@/auth";
import { logger } from "@/lib/utils/logger";
import { MESSAGES } from "@/lib/constants/messages";

/**
 * Add product to wishlist
 * For authenticated users: Stores in database
 * For guest users: Returns instruction to use local storage
 */
export const addToWishlist = async (productId: string) => {
  const session = await auth();
  const userId = session?.user?.id;

  // If not authenticated, return signal to use local storage
  if (!userId) {
    return { useLocalStorage: true, productId };
  }

  const supabase = await createClient();

  // Check if item is already in wishlist
  const { data: existingItem } = await supabase
    .from('wishlist')
    .select()
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existingItem) {
    return { success: MESSAGES.WISHLIST.ALREADY_IN_WISHLIST };
  }

  // Add to wishlist
  const { error } = await supabase
    .from('wishlist')
    .insert({
      user_id: userId,
      product_id: productId,
    });

  if (error) {
    logger.error('Error adding to wishlist:', error);
    return { error: `${MESSAGES.WISHLIST.ADD_ERROR}: ${error.message}` };
  }

  return { success: MESSAGES.WISHLIST.ADD_SUCCESS };
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlist = async (productId: string) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { useLocalStorage: true, productId };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    logger.error('Error removing from wishlist:', error);
    return { error: `${MESSAGES.WISHLIST.REMOVE_ERROR}: ${error.message}` };
  }

  return { success: MESSAGES.WISHLIST.REMOVE_SUCCESS };
};

/**
 * Get user's wishlist items
 */
export const getWishlistItems = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      id,
      product_id,
      created_at,
      product:products (
        id,
        name,
        slug,
        price,
        original_price,
        sale_price,
        is_new_arrival,
        images:product_images (
          id,
          image_url,
          is_primary
        ),
        categories (
          name,
          slug
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching wishlist:', error);
    return [];
  }

  return data || [];
};

/**
 * Check if product is in wishlist
 */
export const isInWishlist = async (productId: string): Promise<boolean> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return false;
  }

  const supabase = await createClient();

  const { data } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  return !!data;
};
