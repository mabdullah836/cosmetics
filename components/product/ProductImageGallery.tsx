"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/supabase";
import { cn } from "@/lib/utils";

interface Props {
  images: ProductImage[];
  productName: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=1500&fit=crop";

export default function ProductImageGallery({ images, productName }: Props) {
  const list =
    images.length > 0
      ? images
      : [{ image_url: FALLBACK_IMAGE } as ProductImage];

  const [activeIndex, setActiveIndex] = useState(0);
  const active = list[activeIndex]?.image_url || list[0]?.image_url || FALLBACK_IMAGE;

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-5">
      {/* Thumbnails — horizontal on mobile, vertical on desktop */}
      {list.length > 1 && (
        <div
          className={cn(
            "flex gap-2 md:flex-col md:gap-2.5",
            "overflow-x-auto pb-1 md:overflow-visible md:pb-0",
            "scrollbar-thin md:w-[72px] md:shrink-0"
          )}
        >
          {list.map((img, index) => {
            const url = img?.image_url || FALLBACK_IMAGE;
            const isActive = index === activeIndex;
            return (
              <button
                key={`${url}-${index}`}
                type="button"
                aria-label={`View image ${index + 1} of ${list.length}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                  "h-[72px] w-[72px] md:h-16 md:w-16",
                  isActive
                    ? "border-foreground ring-2 ring-foreground/10"
                    : "border-border opacity-80 hover:border-muted-foreground/50 hover:opacity-100"
                )}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="72px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main image — portrait frame like catalog cards (Sephora/Shopify style) */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl",
          "aspect-[4/5] bg-gradient-to-b from-muted/60 via-muted/40 to-muted/70",
          "ring-1 ring-border/60"
        )}
      >
        <Image
          src={active}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-opacity duration-300"
        />
      </div>
    </div>
  );
}
