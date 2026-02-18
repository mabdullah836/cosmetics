"use client";

import { memo, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingBag, Eye, Star, Truck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCartActions } from "@/lib/hooks/useCartActions";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  slug: string;
  category?: string;
  stock?: number;
  shippingDays?: number;
  isNew?: boolean;
}

const ProductCard = memo(function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  rating = 4.5,
  reviewCount = 0,
  slug,
  category,
  stock = 10,
  shippingDays = 3,
  isNew = false,
}: ProductCardProps) {
  const router = useRouter();
  const { addToCart, adding } = useCartActions();
  const [wishlisted, setWishlisted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [wishlisting, setWishlisting] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const discount =
    originalPrice && originalPrice > price
      ? Math.round((1 - price / originalPrice) * 100)
      : 0;

  const outOfStock = stock <= 0;

  useEffect(() => {
    try {
      const { isInLocalWishlist } = require("@/lib/utils/localWishlist");
      const inWishlist = isInLocalWishlist(id);
      setWishlisted(inWishlist);
    } catch (error) {
      // Silently fail
    }
  }, [id]);

  const handleWishlist = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (wishlisting) return;
    
    setWishlisting(true);
    
    try {
      const { addToWishlist, removeFromWishlist } = await import("@/lib/actions/wishlist");
      const { addToLocalWishlist, removeFromLocalWishlist } = await import("@/lib/utils/localWishlist");
      
      if (wishlisted) {
        const result = await removeFromWishlist(id);
        if (result?.useLocalStorage) {
          removeFromLocalWishlist(id);
          setWishlisted(false);
          toast.success("Removed from wishlist");
        } else if (result?.error) {
          toast.error(result.error);
        } else {
          setWishlisted(false);
          toast.success("Removed from wishlist");
        }
      } else {
        const result = await addToWishlist(id);
        if (result?.useLocalStorage) {
          addToLocalWishlist(id);
          setWishlisted(true);
          toast.success("Added to wishlist");
        } else if (result?.error) {
          toast.error(result.error);
        } else {
          setWishlisted(true);
          toast.success("Added to wishlist");
        }
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    } finally {
      setWishlisting(false);
    }
  }, [id, wishlisted, wishlisting]);

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (outOfStock) return;

      const result = await addToCart(
        { id, name, price, slug, imageUrl },
        1
      );

      if (result && "success" in result && result.success) {
        router.refresh();
        toast.success("Added to cart", {
          description: name,
          action: {
            label: "View Cart",
            onClick: () => router.push("/cart"),
          },
        });
      } else if (result && "error" in result && result.error) {
        toast.error(result.error);
      } else {
        toast.error("Failed to add to cart");
      }
    },
    [id, name, price, slug, imageUrl, addToCart, router, outOfStock]
  );

  return (
    <Link 
      href={`/product/${slug}`} 
      className="block h-full group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5">
        {/* Image container */}
        <div className="relative aspect-[4/5] bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0">
              <Skeleton className="h-full w-full" />
            </div>
          )}

          <Image
            src={
              imageUrl ||
              "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600"
            }
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-500",
              "group-hover:scale-105",
              imgLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImgLoaded(true)}
            priority={false}
          />

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {isNew && (
              <Badge className="bg-emerald-500 text-white border-0 px-3 py-1 rounded-full font-medium shadow-lg">
                <Zap className="h-3 w-3 mr-1" />
                New
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-rose-500 text-white border-0 px-3 py-1 rounded-full font-medium shadow-lg">
                -{discount}% OFF
              </Badge>
            )}
          </div>

          {/* Floating action buttons */}
          <div className={cn(
            "absolute top-4 right-4 flex flex-col gap-2 z-10 transition-all duration-300",
            showActions ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          )}>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleWishlist}
              disabled={wishlisting}
              className="h-11 w-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl border-0 hover:scale-105 transition-transform"
            >
              {wishlisting ? (
                <div className="h-4 w-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart
                  className={cn(
                    "h-5 w-5 transition-all",
                    wishlisted && "fill-rose-500 text-rose-500 animate-pulse"
                  )}
                />
              )}
            </Button>

            <Button
              size="icon"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/product/${slug}?quickview=true`);
              }}
              className="h-11 w-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl border-0 hover:scale-105 transition-transform"
            >
              <Eye className="h-5 w-5" />
            </Button>
          </div>

          {/* Stock indicator */}
          {stock > 0 && stock <= 5 && (
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                Only {stock} left
              </Badge>
            </div>
          )}

          {/* Add to cart overlay */}
          <div className={cn(
            "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 transition-all duration-300",
            showActions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <Button
              onClick={handleAddToCart}
              disabled={adding || outOfStock}
              size="lg"
              className={cn(
                "w-full bg-white text-gray-900 hover:bg-gray-50 font-semibold h-12 rounded-xl shadow-lg",
                "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                outOfStock && "bg-gray-100 text-gray-500 cursor-not-allowed"
              )}
            >
              {outOfStock ? (
                "Out of Stock"
              ) : adding ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          {category && (
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              {category}
            </p>
          )}

          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-gray-700 transition-colors">
            {name}
          </h3>

          {/* Rating and reviews */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            {reviewCount > 0 && (
              <span className="text-sm text-gray-500">({reviewCount})</span>
            )}
          </div>

          {/* Price */}
          <div className="mt-auto">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-lg text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Shipping info */}
            {shippingDays <= 3 && (
              <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-600">
                <Truck className="h-4 w-4" />
                <span>Free shipping • {shippingDays} days</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;