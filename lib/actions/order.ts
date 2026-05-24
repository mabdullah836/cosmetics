"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { auth } from "@/auth";
import { Address, PaymentMethod, Cart, Product } from "@/types/supabase";
import { logger } from "@/lib/utils/logger";
import { MESSAGES } from "@/lib/constants/messages";
import { createOrderAccessToken } from "@/lib/utils/tracking-token";

interface GuestCartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export const createOrder = async (
  shippingAddress: Omit<Address, 'id'>, 
  billingAddress: Omit<Address, 'id'>, 
  paymentMethod: PaymentMethod,
  customerEmail?: string,
  guestCartItems?: GuestCartItem[],
  isOTPVerified?: boolean
) => {
  const session = await auth();
  const userId = session?.user?.id;
  const supabase = await createClient();
  const serviceSupabase = createServiceClient();

  // Get cart items - from Supabase for authenticated users, from guestCartItems for guests
  let cartItems: Array<{ product_id: string; product: Product; quantity: number }> = [];

  if (userId) {
    // Authenticated user - get from Supabase
    const { data: cart } = await supabase
      .from('carts')
      .select('*, items:cart_items(*, product:products(*))')
      .eq('user_id', userId)
      .maybeSingle();

    if (!cart || !cart.items || cart.items.length === 0) {
      return { error: MESSAGES.ORDER.EMPTY_CART };
    }

    cartItems = cart.items.map((item: any) => ({
      product_id: item.product_id,
      product: item.product,
      quantity: item.quantity,
    }));
  } else {
    // Guest user - use provided guestCartItems
    if (!guestCartItems || guestCartItems.length === 0) {
      return { error: MESSAGES.ORDER.EMPTY_CART };
    }

    cartItems = guestCartItems.map((item) => ({
      product_id: item.productId,
      product: item.product,
      quantity: item.quantity,
    }));
  }

  // Stock validation
  const unavailableItems = cartItems.filter(
    (item) =>
      item.product.stock_level === 'OUT_OF_STOCK' ||
      item.product.stock_level === 'DISCONTINUED'
  );

  if (unavailableItems.length > 0) {
    if (userId) {
      // Remove unavailable items from Supabase cart
      const unavailableIds = unavailableItems.map(item => item.product_id);
      const { data: cart } = await supabase
        .from('carts')
        .select('*, items:cart_items(*)')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (cart) {
        const itemsToDelete = cart.items
          ?.filter((item: any) => unavailableIds.includes(item.product_id))
          ?.map((item: any) => item.id) || [];
        
        if (itemsToDelete.length > 0) {
          await supabase.from('cart_items').delete().in('id', itemsToDelete);
        }
      }
    }

    const productNames = unavailableItems.map((item) => item.product.name).join(', ');
    return {
      error: `${MESSAGES.ORDER.UNAVAILABLE_PRODUCTS}: ${productNames}. Please review your cart and try again.`,
    };
  }

  // COD verification check
  if (paymentMethod === 'COD' && !isOTPVerified) {
    return { error: MESSAGES.ORDER.OTP_REQUIRED };
  }

  const normalizedCustomerEmail = (session?.user?.email || customerEmail || '').trim().toLowerCase();
  if (!userId && !normalizedCustomerEmail) {
    return { error: MESSAGES.ORDER.ERROR };
  }

  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
  const shipping = 0; // Free shipping for now
  const tax = 0; // No tax for now
  const total = subtotal + shipping + tax;

  try {
    // Create addresses (can be null user_id for guests)
    const { data: createdShippingAddress, error: shippingAddressError } = await serviceSupabase
      .from('addresses')
      .insert({ ...shippingAddress, user_id: userId || null })
      .select()
      .single();
    if (shippingAddressError) {
      logger.error("Shipping address insert error:", shippingAddressError);
      throw new Error(MESSAGES.ORDER.SHIPPING_ADDRESS_ERROR);
    }
    if (!createdShippingAddress) throw new Error(MESSAGES.ORDER.SHIPPING_ADDRESS_ERROR);

    // Check if billing address is the same as shipping address
    const isSameAddress = 
      shippingAddress.address_line_1 === billingAddress.address_line_1 &&
      shippingAddress.city === billingAddress.city &&
      shippingAddress.postal_code === billingAddress.postal_code;

    let createdBillingAddress;
    if (isSameAddress) {
      createdBillingAddress = createdShippingAddress;
    } else {
      const { data, error: billingAddressError } = await serviceSupabase
        .from('addresses')
        .insert({ ...billingAddress, user_id: userId || null })
        .select()
        .single();
      if (billingAddressError) {
        logger.error("Billing address insert error:", billingAddressError);
        throw new Error(MESSAGES.ORDER.BILLING_ADDRESS_ERROR);
      }
      createdBillingAddress = data;
    }
    
    if (!createdBillingAddress) throw new Error(MESSAGES.ORDER.BILLING_ADDRESS_ERROR);

    // Keep all new orders pending admin confirmation.
    let orderStatus = 'PENDING_CONFIRMATION';
    let verificationStatus = paymentMethod === 'COD' ? 'PENDING' : 'NOT_REQUIRED';
    if (paymentMethod === 'COD' && isOTPVerified) {
      verificationStatus = 'VERIFIED';
    }

    // Create order with guest support
    const { data: newOrder, error: newOrderError } = await serviceSupabase
      .from('orders')
      .insert({
        user_id: userId || null,
        customer_email: normalizedCustomerEmail,
        customer_phone: shippingAddress.phone || '',
        guest_email: userId ? null : normalizedCustomerEmail,
        guest_phone: userId ? null : (shippingAddress.phone || ''),
        status: orderStatus,
        payment_status: 'PENDING',
        payment_method: paymentMethod,
        verification_status: verificationStatus,
        subtotal,
        shipping,
        tax,
        total,
        shipping_address_id: createdShippingAddress.id,
        billing_address_id: createdBillingAddress.id,
      })
      .select()
      .single();
    if (newOrderError) {
      logger.error("Order insert error:", newOrderError);
      throw new Error(MESSAGES.ORDER.CREATE_ERROR);
    }

    if (!newOrder) throw new Error(MESSAGES.ORDER.CREATE_ERROR);

    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      product_name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));
    const { error: orderItemsError } = await serviceSupabase.from('order_items').insert(orderItems);
    if (orderItemsError) throw new Error(MESSAGES.ORDER.ITEMS_ERROR);

    // Clear the cart (only for authenticated users)
    if (userId) {
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (cart) {
        await supabase.from('cart_items').delete().eq('cart_id', cart.id);
      }
    }
    // Guest cart will be cleared client-side after successful order

    const tokenEmail = userId ? (session?.user?.email || normalizedCustomerEmail) : normalizedCustomerEmail;
    const tokenPhone = shippingAddress.phone || "";
    const accessToken = createOrderAccessToken(newOrder.id, tokenEmail, tokenPhone);

    return { success: MESSAGES.ORDER.SUCCESS, orderId: newOrder.id, accessToken };
  } catch (error) {
    logger.error("Order creation error:", error);
    return { error: MESSAGES.ORDER.ERROR };
  }
};

// Link a guest order to a user account after account creation
export const linkGuestOrder = async (orderId: string, userId: string) => {
  try {
    const serviceSupabase = createServiceClient();
    const session = await auth();

    // Only allow linking if the user is authenticated and matches
    if (!session || session.user.id !== userId) {
      return { error: MESSAGES.ORDER.UNAUTHORIZED };
    }

    const { data: order, error: fetchError } = await serviceSupabase
      .from("orders")
      .select("user_id, guest_email")
      .eq("id", orderId)
      .maybeSingle();

    if (fetchError || !order) {
      return { error: MESSAGES.ORDER.NOT_FOUND };
    }

    // Only link if order is currently a guest order
    if (order.user_id) {
      return { success: true, message: MESSAGES.ORDER.LINK_SUCCESS };
    }

    // Ensure only the owner of the guest email can claim this order.
    if (!session.user.email || order.guest_email !== session.user.email) {
      return { error: MESSAGES.ORDER.UNAUTHORIZED };
    }

    // Update order with user_id
    const { error: updateError } = await serviceSupabase
      .from("orders")
      .update({ user_id: userId })
      .eq("id", orderId);

    if (updateError) {
      return { error: MESSAGES.ORDER.LINK_ERROR };
    }

    return { success: true };
  } catch (error) {
    logger.error("Link guest order error:", error);
    return { error: MESSAGES.ORDER.ERROR };
  }
};
