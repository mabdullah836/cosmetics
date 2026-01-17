"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Star, Eye, Truck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isSale?: boolean;
  slug: string;
  category?: string;
  stock?: number;
  shippingDays?: number;
}

// Optimized with memo to prevent unnecessary re-renders
const ProductCard = memo(function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  rating = 4.5,
  reviewCount = 0,
  isNew = false,
  isSale = false,
  slug,
  category,
  stock = 10,
  shippingDays = 3,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  const isLowStock = stock < 5;
  const isFastShipping = shippingDays <= 3;

  // Memoized handlers
  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlisted(prev => !prev);
    
    if (isWishlisted) {
      toast.error("Removed from wishlist", {
        description: `${name} has been removed from your wishlist`,
      });
    } else {
      toast.success("Added to wishlist", {
        description: `${name} has been added to your wishlist`,
        duration: 2000,
      });
    }
  }, [isWishlisted, name]);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsAddingToCart(false);
      
      toast.success("Added to cart", {
        description: (
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">
                ${price.toFixed(2)} • Added to cart
              </p>
            </div>
          </div>
        ),
        action: {
          label: "View Cart",
          onClick: () => window.location.href = "/cart",
        },
        duration: 4000,
      });
    }, 500);
  }, [name, price, imageUrl]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const handleImageLoad = useCallback(() => setIsImageLoading(false), []);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full",
        isHovered && "ring-2 ring-primary/20"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
        {/* Image Loading Skeleton */}
        {isImageLoading && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        
        <Link href={`/product/${slug}`} className="block h-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              isHovered && "scale-105",
              isImageLoading ? "opacity-0" : "opacity-100"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
            onLoad={handleImageLoad}
            onError={handleImageLoad}
          />
        </Link>

        {/* Badges - Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <Badge 
              className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-md animate-pulse"
              aria-label="New product"
            >
              New
            </Badge>
          )}
          {isSale && discount > 0 && (
            <Badge 
              variant="destructive" 
              className="border-0 shadow-md"
              aria-label={`${discount}% off`}
            >
              -{discount}% OFF
            </Badge>
          )}
          {category && (
            <Badge 
              variant="outline" 
              className="bg-background/80 backdrop-blur-sm hidden sm:inline-flex"
              aria-label={`Category: ${category}`}
            >
              {category}
            </Badge>
          )}
        </div>

        {/* Stock Indicator - Top Right */}
        {isLowStock && stock > 0 && (
          <div className="absolute top-3 right-3">
            <Badge 
              variant="outline" 
              className="bg-amber-50 text-amber-800 border-amber-200"
              aria-label={`Low stock: ${stock} items left`}
            >
              Only {stock} left
            </Badge>
          </div>
        )}

        {/* Action Buttons - Right Side */}
        <div className="absolute right-3 top-12 flex flex-col gap-2">
          {/* Wishlist Button */}
          <Button
            onClick={handleWishlist}
            variant="secondary"
            size="icon"
            className={cn(
              "bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background transition-all",
              "hover:scale-110 active:scale-95",
              isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isWishlisted && "fill-primary text-primary"
              )}
            />
          </Button>

          {/* Quick View Button */}
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background transition-all",
              "hover:scale-110 active:scale-95",
              isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            asChild
          >
            <Link href={`/product/${slug}`} onClick={(e) => e.stopPropagation()}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">Quick view {name}</span>
            </Link>
          </Button>
        </div>

        {/* Shipping Info - Bottom Left */}
        {isFastShipping && (
          <div className="absolute bottom-3 left-3">
            <Badge 
              variant="secondary" 
              className="bg-green-50 text-green-700 border-green-200"
              aria-label={`Fast delivery in ${shippingDays} days`}
            >
              <Truck className="h-3 w-3 mr-1" />
              Fast Delivery
            </Badge>
          </div>
        )}

        {/* Add to Cart Button - Bottom Overlay */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-4 transition-all duration-300",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          )}
        >
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            size="sm"
            className="w-full rounded-full shadow-md"
          >
            {isAddingToCart ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="p-4 space-y-2">
        {/* Category */}
        {category && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide sm:hidden">
            {category}
          </p>
        )}
        
        {/* Product Name */}
        <Link href={`/product/${slug}`}>
          <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 min-h-12">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex" aria-label={`Rating: ${rating} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.floor(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted"
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            {reviewCount > 0 && (
              <span className="text-xs text-muted-foreground" aria-label={`${reviewCount} reviews`}>
                ({reviewCount.toLocaleString()})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-bold text-foreground">
            ${price.toFixed(2)}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-destructive">
                Save ${(originalPrice - price).toFixed(2)}
              </span>
            </>
          )}
        </div>

        {/* Shipping Time */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Delivery in {shippingDays} days</span>
        </div>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;