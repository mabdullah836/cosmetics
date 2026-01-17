import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { createClient } from '@/lib/supabase/server';
import Header from './Header';
import { CartItem } from '@/types/supabase';

const ServerHeader = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  let cart;

  const supabase = await createClient();

  if (userId) {
    const { data } = await supabase.from('carts').select('*, items:cart_items(*, product:products(*, images:product_images(*)))').eq('user_id', userId).single();
    cart = data;
  } else if (cartId) {
    const { data } = await supabase.from('carts').select('*, items:cart_items(*, product:products(*, images:product_images(*)))').eq('id', cartId).single();
    cart = data;
  }

  const cartItems: CartItem[] = cart?.items || [];
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return <Header cartItems={cartItems} subtotal={subtotal} />;
};

export default ServerHeader;
