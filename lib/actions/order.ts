"use server";

import { supabase } from "@/lib/supabase/client";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { Address, PaymentMethod, Cart } from "@/types/supabase";

export const createOrder = async (shippingAddress: Omit<Address, 'id'>, billingAddress: Omit<Address, 'id'>, paymentMethod: PaymentMethod) => {
  const session = await auth();
  const userId = session?.user?.id;
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  let cart: Cart | null = null;

  if (userId) {
    const { data } = await supabase.from('carts').select('*, items:cart_items(*, product:products(*))').eq('user_id', userId).single();
    cart = data;
  } else if (cartId) {
    const { data } = await supabase.from('carts').select('*, items:cart_items(*, product:products(*))').eq('id', cartId).single();
    cart = data;
  }

  if (!cart || cart.items.length === 0) {
    return { error: "Your cart is empty." };
  }

  // Stock validation
  const unavailableItems = cart.items.filter(
    (item) =>
      item.product.stock_level === 'OUT_OF_STOCK' ||
      item.product.stock_level === 'DISCONTINUED'
  );

  if (unavailableItems.length > 0) {
    // Remove unavailable items from the cart
    const { error } = await supabase.from('cart_items').delete().in('id', unavailableItems.map(item => item.id));
    if (error) return { error: "Failed to update cart. Please try again." };

    const productNames = unavailableItems.map((item) => item.product.name).join(', ');
    return {
      error: `The following products are no longer available and have been removed from your cart: ${productNames}. Please review your cart and try again.`,
    };
  }

  const subtotal = cart.items.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
  const shipping = 0; // Free shipping for now
  const tax = 0; // No tax for now
  const total = subtotal + shipping + tax;

  try {
    // Create addresses
    const { data: createdShippingAddress } = await supabase.from('addresses').insert({ ...shippingAddress, user_id: userId }).select().single();
    if (!createdShippingAddress) throw new Error("Failed to create shipping address.");

    const createdBillingAddress = billingAddress.is_default ? createdShippingAddress : (await supabase.from('addresses').insert({ ...billingAddress, user_id: userId }).select().single()).data;
    if (!createdBillingAddress) throw new Error("Failed to create billing address.");

    // Create order
    const { data: newOrder } = await supabase.from('orders').insert({
      user_id: userId,
      customer_email: session?.user?.email || '',
      customer_phone: '', // Assuming phone is part of address
      status: 'PENDING',
      payment_status: 'PENDING',
      payment_method: paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
      shipping_address_id: createdShippingAddress.id,
      billing_address_id: createdBillingAddress.id,
    }).select().single();

    if (!newOrder) throw new Error("Failed to create order.");

    // Create order items
    const orderItems = cart.items.map(item => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      product_name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));
    const { error: orderItemsError } = await supabase.from('order_items').insert(orderItems);
    if (orderItemsError) throw new Error("Failed to create order items.");

    // Clear the cart
    await supabase.from('cart_items').delete().eq('cart_id', cart.id);
    if (!userId) {
      cookieStore.delete("cartId");
    }

    return { success: "Order placed successfully.", orderId: newOrder.id };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
};
