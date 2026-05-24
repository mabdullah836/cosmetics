import { auth } from '@/auth';
import { createClient } from '@/lib/supabase/server';
import Header from './Header';
import { CartItem } from '@/types/supabase';
import { logger } from '@/lib/utils/logger';

// Log when cart query is slow; ensure DB has index on carts(user_id) and cart_items(cart_id)
const CART_SLOW_QUERY_MS = 500;

const ServerHeader = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  let cartItems: CartItem[] = [];
  let subtotal = 0;

  if (userId) {
    const start = Date.now();
    const supabase = await createClient();
    const { data: cart } = await supabase
      .from('carts')
      .select('*, items:cart_items(*, product:products(*, images:product_images(*)))')
      .eq('user_id', userId)
      .maybeSingle();
    const duration = Date.now() - start;
    if (duration > CART_SLOW_QUERY_MS) {
      logger.warn(`Slow cart query: ${duration}ms for user ${userId}`);
    }
    cartItems = cart?.items || [];
    subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }

  return <Header cartItems={cartItems} subtotal={subtotal} isAuthenticated={!!userId} />;
};

export default ServerHeader;
