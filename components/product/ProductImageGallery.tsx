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
      : [{ image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800" } as any];

  const [active, setActive] = useState(list[0].image_url);

  return (
    <div className="flex gap-6">
      {/* Thumbnails */}
      <div className="flex flex-col gap-3">
        {list.map((img) => (
          <button
            key={img.image_url}
            onMouseEnter={() => setActive(img.image_url)}
            className={cn(
              "w-16 h-16 border rounded",
              active === img.image_url
                ? "border-primary"
                : "border-border hover:border-muted-foreground"
            )}
          >
            <Image
              src={img.image_url}
              alt={productName}
              width={64}
              height={64}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative w-[420px] h-[420px] border rounded">
        <Image
          src={active}
          alt={productName}
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
