import { auth } from '@/auth';
import { createClient } from '@/lib/supabase/server';
import Header from './Header';
import { CartItem } from '@/types/supabase';

const ServerHeader = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  let cartItems: CartItem[] = [];
  let subtotal = 0;

  // Only fetch from Supabase if user is authenticated
  if (userId) {
    const supabase = await createClient();
    const { data: cart } = await supabase
      .from('carts')
      .select('*, items:cart_items(*, product:products(*, images:product_images(*)))')
      .eq('user_id', userId)
      .maybeSingle();
    
    cartItems = cart?.items || [];
    subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }
  // For guest users, cart will be loaded from localStorage client-side
  
  return <Header cartItems={cartItems} subtotal={subtotal} isAuthenticated={!!userId} />;
};

export default ServerHeader;
