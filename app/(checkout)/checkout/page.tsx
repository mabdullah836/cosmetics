import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";
import CheckoutPageClient from "./CheckoutPageClient";
import { CartItem } from "@/types/supabase";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CheckoutPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  let cartItems: CartItem[] = [];
  let subtotal = 0;

  // Only fetch from Supabase if user is authenticated
  // For guests, cart will be loaded from localStorage client-side
  if (userId) {
    const supabase = await createClient();
    const { data: cart } = await supabase
      .from("carts")
      .select("*, items:cart_items(*, product:products(*, images:product_images(*)))")
      .eq("user_id", userId)
      .maybeSingle();
    
    cartItems = cart?.items || [];
    subtotal = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }

  // Redirect to cart if no items (for authenticated users)
  // Guest users will see empty cart message in client component
  if (userId && cartItems.length === 0) {
    redirect("/cart");
  }

  const shipping = 0; // Free shipping
  const discount = 0; // Can be calculated from coupons/promos
  const total = subtotal + shipping - discount;

  return (
    <>
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/cart">Cart</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Checkout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <CheckoutPageClient
        cartItems={cartItems}
        subtotal={subtotal}
        shipping={shipping}
        discount={discount}
        total={total}
        userEmail={session?.user?.email || ""}
        isAuthenticated={!!session}
      />
    </>
  );
};

export default CheckoutPage;
