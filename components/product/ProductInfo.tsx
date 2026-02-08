"use client";

import { useState } from "react";
import { Product } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const inStock =
    product.stock_level === "IN_STOCK" ||
    product.stock_level === "LOW_STOCK";

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="space-y-2">
        {product.category && (
          <p className="text-sm text-gray-500">{product.category}</p>
        )}
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
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
                  : "text-gray-300"
              )}
            />
          ))}
        </div>
        <span className="text-gray-500">
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
        <span className="text-3xl font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </span>
        {product.original_price && (
          <span className="text-lg line-through text-gray-400">
            ${product.original_price.toFixed(2)}
          </span>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-gray-600 leading-relaxed">
          {product.description}
        </p>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-6 pt-4 border-t">
        <div>
          <Label>Quantity</Label>
          <div className="flex items-center border rounded-lg mt-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 hover:bg-gray-100"
            >
              −
            </button>
            <span className="w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-semibold">
            ${(product.price * quantity).toFixed(2)}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3 pt-2">
        <Button className="flex-1" disabled={!inStock}>
          Add to Cart
        </Button>
        <Button variant="outline" className="flex-1">
          Buy Now
        </Button>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-2">
        <button
          onClick={() => setIsWishlisted((v) => !v)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <Heart
            className={cn(
              "h-4 w-4",
              isWishlisted && "fill-red-500 text-red-500"
            )}
          />
          Wishlist
        </button>

        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </div>
  );
}
