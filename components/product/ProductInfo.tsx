"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartActions } from "@/lib/hooks/useCartActions";
import { toast } from "sonner";

interface ProductInfoProps {
  product: Product & {
    variants?: any[];
    averageRating?: number;
    reviewCount?: number;
    category?: string;
    original_price?: number;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart, adding } = useCartActions();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const inStock =
    product.stock_level === "IN_STOCK" ||
    product.stock_level === "LOW_STOCK";

  const handleAddToCart = async () => {
    if (!inStock) return;
    const result = await addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        slug: product.slug,
        imageUrl: product.imageUrl ?? product.images?.[0]?.image_url,
        images: product.images,
      },
      quantity
    );
    if (result && "success" in result && result.success) {
      router.refresh();
      toast.success("Added to cart", {
        description: `${product.name} × ${quantity}`,
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
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="space-y-2">
        {product.category && (
          <p className="text-sm text-muted-foreground">{product.category}</p>
        )}
        <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">
          {product.name}
        </h1>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < Math.floor(product.averageRating || 4)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/40"
              )}
            />
          ))}
        </div>
        <span className="text-muted-foreground">
          ({product.reviewCount || 0} reviews)
        </span>
        <span
          className={cn(
            "font-medium",
            inStock ? "text-emerald-600" : "text-red-500"
          )}
        >
          {inStock ? "In stock" : "Out of stock"}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-foreground">
          ${product.price.toFixed(2)}
        </span>
        {product.original_price && (
          <span className="text-lg line-through text-muted-foreground">
            ${product.original_price.toFixed(2)}
          </span>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-6 pt-4 border-t border-border">
        <div>
          <Label>Quantity</Label>
          <div className="flex items-center border border-border rounded-lg mt-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 hover:bg-muted"
            >
              −
            </button>
            <span className="w-12 text-center text-foreground">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2 hover:bg-muted"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-xl font-semibold text-foreground">
            ${(product.price * quantity).toFixed(2)}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3 pt-2">
        <Button
          className="flex-1"
          disabled={!inStock || adding}
          onClick={handleAddToCart}
        >
          {adding ? (
            <>
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Adding...
            </>
          ) : (
            "Add to Cart"
          )}
        </Button>
        <Button variant="outline" className="flex-1">
          Buy Now
        </Button>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-2">
        <button
          onClick={() => setIsWishlisted((v) => !v)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Heart
            className={cn(
              "h-4 w-4",
              isWishlisted && "fill-red-500 text-red-500"
            )}
          />
          Wishlist
        </button>

        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </div>
  );
}
