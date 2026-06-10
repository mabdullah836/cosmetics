"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingBag, Trash2, Eye, Star, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist";
import { addToCart } from "@/lib/actions/cart";
import { logger } from "@/lib/utils/logger";
import { ROUTES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils/format";
import {
  getLocalWishlist,
  addToLocalWishlist,
  removeFromLocalWishlist,
  type LocalWishlistItem,
} from "@/lib/utils/localWishlist";

interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    slug?: string;
    price: number;
    original_price?: number;
    sale_price?: number;
    is_new_arrival?: boolean;
    images?: Array<{
      id: string;
      image_url: string;
      is_primary: boolean;
    }>;
    categories?: Array<{
      name: string;
      slug?: string;
    }> | {
      name: string;
      slug?: string;
    };
  };
}

interface WishlistPageClientProps {
  initialWishlistItems: WishlistItem[];
  isAuthenticated: boolean;
}

export default function WishlistPageClient({
  initialWishlistItems = [],
  isAuthenticated = false,
}: WishlistPageClientProps) {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(initialWishlistItems);
  const [localWishlist, setLocalWishlist] = useState<LocalWishlistItem[]>([]);
  const [loading, setLoading] = useState(!isAuthenticated);
  const [removing, setRemoving] = useState<string | null>(null);

  // Load local wishlist for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      const local = getLocalWishlist();
      setLocalWishlist(local);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch products for local wishlist items (guest users)
  useEffect(() => {
    const fetchGuestWishlistProducts = async () => {
      if (!isAuthenticated && localWishlist.length > 0) {
        setLoading(true);
        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          
          const productIds = localWishlist.map(item => item.productId);
          
          const { data: products, error } = await supabase
            .from('products')
            .select(`
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
            `)
            .in('id', productIds)
            .eq('is_active', true);
          
          if (error) {
            logger.error('Error fetching wishlist products:', error);
          } else if (products) {
            // Transform to match WishlistItem format
            const transformedItems: WishlistItem[] = products.map(product => ({
              id: `local-${product.id}`,
              product_id: product.id,
              product: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                original_price: product.original_price,
                sale_price: product.sale_price,
                is_new_arrival: product.is_new_arrival,
                images: product.images || [],
                categories: product.categories,
              },
            }));
            
            setWishlistItems(transformedItems);
          }
        } catch (error) {
          logger.error('Error fetching guest wishlist:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchGuestWishlistProducts();
  }, [isAuthenticated, localWishlist]);

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemoving(productId);
    
    try {
      if (isAuthenticated) {
        const result = await removeFromWishlist(productId);
        if (result?.error) {
          toast.error(result.error);
        } else {
          setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
          toast.success("Removed from wishlist");
        }
      } else {
        removeFromLocalWishlist(productId);
        setLocalWishlist(prev => prev.filter(item => item.productId !== productId));
        setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = async (productId: string, productName: string) => {
    try {
      const result = await addToCart(productId, 1);
      
      if (result?.useLocalStorage) {
        // Handle local storage cart (client-side)
        toast.success("Added to cart", {
          description: productName,
        });
      } else if (result?.success) {
        const { emitCartUpdated } = await import("@/lib/utils/cartEvents");
        emitCartUpdated();
        toast.success("Added to cart", {
          description: productName,
          action: {
            label: "View Cart",
            onClick: () => router.push(ROUTES.CART),
          },
        });
      } else {
        toast.error(result?.error || "Failed to add to cart");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const getPrimaryImage = (images: any[] | undefined) => {
    if (!images || images.length === 0) return null;
    return images.find((img) => img.is_primary) || images[0];
  };

  const getCategoryName = (categories: any) => {
    if (!categories) return undefined;
    if (Array.isArray(categories)) return categories[0]?.name;
    return categories.name;
  };

  const displayItems = wishlistItems;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          My Wishlist
        </h1>
        <p className="text-muted-foreground">
          {displayItems.length === 0
            ? "Your wishlist is empty"
            : `${displayItems.length} ${displayItems.length === 1 ? "item" : "items"} saved`}
        </p>
      </div>

      {displayItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start adding products you love to your wishlist. You can save them for later and add them to your cart when you're ready.
          </p>
          <Button asChild size="lg">
            <Link href={ROUTES.PRODUCTS}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Start Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayItems.map((item) => {
            const product = item.product;
            const primaryImage = getPrimaryImage(product.images);
            const categoryName = getCategoryName(product.categories);
            const isNew = product.is_new_arrival || false;
            const isSale = product.sale_price ? product.sale_price < product.price : false;

            return (
              <div key={item.id} className="group relative">
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[3/4] bg-muted">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {isNew && (
                        <Badge className="bg-green-500 text-white border-0">New</Badge>
                      )}
                      {isSale && (
                        <Badge variant="destructive">Sale</Badge>
                      )}
                    </div>

                    {/* Remove from wishlist button */}
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      disabled={removing === product.id}
                      className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                    >
                      {removing === product.id ? (
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <CardContent className="p-4 space-y-2">
                    {categoryName && (
                      <p className="text-xs uppercase text-muted-foreground">
                        {categoryName}
                      </p>
                    )}

                    <Link href={`/product/${product.slug || product.id}`}>
                      <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {formatPrice(product.price)}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <>
                          <span className="text-sm line-through text-muted-foreground">
                            {formatPrice(product.original_price)}
                          </span>
                          <span className="text-sm font-medium text-red-600">
                            {Math.round((1 - product.price / product.original_price) * 100)}% off
                          </span>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleAddToCart(product.id, product.name)}
                        className="flex-1"
                        size="sm"
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="flex-shrink-0"
                      >
                        <Link href={`/product/${product.slug || product.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
