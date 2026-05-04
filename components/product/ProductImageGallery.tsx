"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/supabase";
import { cn } from "@/lib/utils";

interface Props {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: Props) {
  const list =
    images.length > 0
      ? images
      : [
          {
            image_url:
              "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
          } as ProductImage,
        ];

  const [active, setActive] = useState(list[0]?.image_url || list[0]?.image_url || '');

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2">
        {list.map((img) => (
          <button
            key={img?.image_url}
            onMouseEnter={() => setActive(img?.image_url || '')}
            className={cn(
              "h-16 w-16 border rounded-lg overflow-hidden transition",
              active === img?.image_url
                ? "border-foreground"
                : "border-border hover:border-muted-foreground/50"
            )}
          >
            <Image
              src={img?.image_url || '/placeholder.svg'}
              alt={productName}
              width={64}
              height={64}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 aspect-square border border-border rounded-xl bg-card overflow-hidden">
        <Image
          src={active}
          alt={productName}
          fill
          priority
          className="object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
}
