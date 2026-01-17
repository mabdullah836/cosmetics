export type ProductImage = {
  id: string;
  image_url: string;
  image_public_id: string | null;
  is_primary: boolean;
  product_id: string;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug?: string;
  image?: string | null;
  image_url?: string | null;
  image_public_id?: string | null;
  is_active: boolean;
  sort_order: number | null;
  created_at: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  options: string[];
};

export type Product = {
  id: string;
  name: string;
  slug?: string;
  brand?: string;
  description: string | null;
  price: number;
  original_price?: number;
  rating?: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  stock_level?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DISCONTINUED';
};

export type CartItem = {
  id: string;
  quantity: number;
  product: Product;
  product_id: string;
  cart_id: string;
}

export type Cart = {
  id: string;
  items: CartItem[];
  user_id?: string;
}

export type Address = {
  id: string;
  user_id?: string;
  type: 'BILLING' | 'SHIPPING' | 'BOTH';
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export type PaymentMethod = 'COD' | 'BANK_TRANSFER';
