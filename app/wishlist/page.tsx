import { auth } from "@/auth";
import { getWishlistItems } from "@/lib/actions/wishlist";
import WishlistPageClient from "./WishlistPageClient";
import { createClient } from "@/lib/supabase/server";

export default async function WishlistPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let wishlistItems: any[] = [];

  if (userId) {
    // Fetch wishlist items from database
    wishlistItems = await getWishlistItems();
  }
  // For guest users, wishlist will be loaded from localStorage client-side

  return <WishlistPageClient initialWishlistItems={wishlistItems} isAuthenticated={!!userId} />;
}
