"use client";

import { useState } from "react";
import { Product } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Star,
  Heart,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  product: Product & {
    variants?: any[];
    averageRating?: number;
    reviewCount?: number;
    category?: string;
    stock_quantity?: number;
    original_price?: number;
    features?: string[];
    ingredients?: string;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    {}
  );
  const [isWishlisted, setIsWishlisted] = useState(false);

  const groupedVariants = (product.variants || []).reduce(
    (acc: Record<string, string[]>, v) => {
      if (!v.name || !v.options) return acc;
      const opts = Array.isArray(v.options) ? v.options : [v.options];
      acc[v.name] = opts;
      return acc;
    },
    {}
  );

  const inStock =
    product.stock_level === "IN_STOCK" ||
    product.stock_level === "LOW_STOCK";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            {product.category && (
              <p className="text-sm text-muted-foreground">
                {product.category}
              </p>
            )}
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWishlisted((v) => !v)}
              className="p-2 border rounded hover:bg-muted"
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                )}
              />
            </button>
            <button className="p-2 border rounded hover:bg-muted">
              <Share2 className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Rating + Stock */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(product.averageRating || 4)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-muted-foreground">
            {product.reviewCount || 0} reviews
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
      </div>

      {/* Price */}
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold">
          ${product.price.toFixed(2)}
        </span>
        {product.original_price &&
          product.original_price > product.price && (
            <span className="text-lg line-through text-muted-foreground">
              ${product.original_price.toFixed(2)}
            </span>
          )}
      </div>

      {/* Short description */}
      {product.description && (
        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      )}

      {/* Variants */}
      {Object.entries(groupedVariants).map(([name, options]) => (
        <div key={name} className="space-y-2">
          <Label className="font-medium capitalize">{name}</Label>
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() =>
                  setSelectedOptions((p) => ({ ...p, [name]: opt }))
                }
                className={cn(
                  "px-4 py-2 border rounded text-sm",
                  selectedOptions[name] === opt
                    ? "border-primary bg-primary/5 text-primary"
                    : "hover:border-muted-foreground"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Quantity + CTA */}
      <div className="pt-4 border-t space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Quantity</Label>
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-muted"
              >
                −
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 hover:bg-muted"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-semibold">
              ${(product.price * quantity).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            disabled={!inStock}
            className="flex-1"
            onClick={async () => {
              const { addToCart } = await import("@/lib/actions/cart");
              await addToCart(product.id, quantity);
            }}
          >
            Add to Cart
          </Button>
          <Button variant="outline" className="flex-1">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
