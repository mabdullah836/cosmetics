"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  id: string;
  name: string;
  imageUrl: string;
  productCount?: number;
  slug: string;
  description?: string;
  className?: string;
}

export default function CategoryCard({
  name,
  imageUrl,
  productCount,
  slug,
  description,
  className,
}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={`/categories/${slug}`}
      className={cn("block group focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-2 rounded-lg", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full bg-card">
        <div className="relative aspect-square overflow-hidden">
          {/* Background Image */}
          <Image
            src={imageUrl}
            alt={`${name} category`}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              isHovered ? "scale-110 brightness-110" : "scale-100 brightness-90"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={cn(
              "absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000",
              isHovered ? "translate-x-[400%]" : ""
            )} />
          </div>
          
          {/* Content Container */}
          <div className="absolute inset-0 flex flex-col items-center justify-end p-4 md:p-6 text-center">
            {/* Main Content */}
            <div className="w-full space-y-2">
              <h3 className="text-xl md:text-2xl font-display font-semibold text-white mb-1">
                {name}
              </h3>
              
              {description && (
                <p className={cn(
                  "text-sm text-white/80 transition-all duration-300 overflow-hidden",
                  isHovered ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                )}>
                  {description}
                </p>
              )}
              
              {productCount !== undefined && (
                <p className="text-sm text-white/80 font-medium">
                  {productCount} {productCount === 1 ? 'Product' : 'Products'}
                </p>
              )}
            </div>
            
            {/* CTA Button */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "mt-4 text-white hover:text-white hover:bg-white/20 border-white/30 transition-all duration-300",
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* Badge for featured categories */}
          {productCount && productCount > 50 && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                Popular
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}