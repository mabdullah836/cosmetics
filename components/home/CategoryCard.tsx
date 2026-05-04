"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  productCount?: number;
  description?: string;
  isFeatured?: boolean;
  icon?: string;
}

interface CategoryGridProps {
  categories: Category[];
  title: string;
  subtitle?: string;
  columns?: 2 | 3 | 4 | 5 | 6;
}

export default function CategoryGrid({
  categories,
  title,
  subtitle,
  columns = 4,
}: CategoryGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-6",
  };

  return (
    <section className="py-12 md:py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Categories Grid */}
        <div className={cn("grid gap-4 md:gap-6", gridCols[columns])}>
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className={cn(
                "group block",
                category.isFeatured && columns === 4 ? "md:col-span-2 md:row-span-2" : ""
              )}
            >
              <Card className="h-full overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-500",
                      category.isFeatured && columns === 4
                        ? "group-hover:scale-105"
                        : "group-hover:scale-110"
                    )}
                    sizes={category.isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 50vw, 33vw"}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                    <div className="text-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg md:text-xl font-bold">
                          {category.name}
                        </h3>
                        {category.icon && (
                          <span className="text-2xl">{category.icon}</span>
                        )}
                      </div>
                      
                      {category.description && (
                        <p className="text-sm text-white/85 mb-3 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        {category.productCount && (
                          <span className="text-sm text-white/75">
                            {category.productCount} products
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-sm font-medium">
                          Shop Now
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button asChild size="lg" variant="outline">
            <Link href="/categories">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}