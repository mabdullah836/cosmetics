"use server";

import { supabase } from "@/lib/supabase/client";
import { auth } from "@/auth";
import { cookies } from "next/headers";

export const addToCart = async (productId: string, quantity: number) => {
  const session = await auth();
  const userId = session?.user?.id;
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  let cart;

  // Find cart
  if (userId) {
    const { data } = await supabase.from('carts').select().eq('user_id', userId).single();
    cart = data;
  } else if (cartId) {
    const { data } = await supabase.from('carts').select().eq('id', cartId).single();
    cart = data;
  }

  // Create cart if it doesn't exist
  if (!cart) {
    if (userId) {
      const { data } = await supabase.from('carts').insert({ user_id: userId }).select().single();
      cart = data;
    } else {
      const { data } = await supabase.from('carts').insert({}).select().single();
      cart = data;
      if (cart) {
        await cookieStore.set("cartId", cart.id);
      }
    }
  }

  if (!cart) {
    return { error: "Could not create or find cart." };
  }

  // Check if item is already in cart
  const { data: cartItem } = await supabase
    .from('cart_items')
    .select()
    .eq('cart_id', cart.id)
    .eq('product_id', productId)
    .single();

  if (cartItem) {
    // Update quantity
    await supabase
      .from('cart_items')
      .update({ quantity: cartItem.quantity + quantity })
      .eq('id', cartItem.id);
  } else {
    // Add new item
    await supabase.from('cart_items').insert({
      cart_id: cart.id,
      product_id: productId,
      quantity,
    });
  }

  return { success: "Product added to cart." };
};
