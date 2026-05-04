"use client";

import { useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";
import { ArrowRight, Star, Truck, Zap, ShoppingBag, Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCartActions } from "@/lib/hooks/useCartActions";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating?: number;
  isNew?: boolean;
  isSale?: boolean;
  category?: string;
  shortDescription?: string;
}

interface ProductCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  autoPlay?: boolean;
  itemsPerView?: number;
  variant?: "default" | "minimal" | "featured";
}

export default function ProductCarousel({
  products,
  title,
  subtitle,
  showViewAll = true,
  autoPlay = true,
  itemsPerView = 4,
  variant = "default",
}: ProductCarouselProps) {
  const plugins = useMemo(
    () =>
      autoPlay
        ? [
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
              rootNode: (emblaRoot) => emblaRoot.parentElement,
            }),
          ]
        : [],
    [autoPlay]
  );

  const { addToCart, adding } = useCartActions();

  if (products.length === 0) {
    return null;
  }

  const handleQuickAdd = async (product: Product) => {
    const result = await addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        slug: product.slug,
        imageUrl: product.imageUrl,
      },
      1
    );
    if (result && "success" in result && result.success) {
      toast.success("Added to cart", {
        description: product.name,
        action: {
          label: "View Cart",
          onClick: () => (window.location.href = "/cart"),
        },
      });
    } else if (result && "error" in result && result.error) {
      toast.error(result.error);
    } else {
      toast.error("Failed to add to cart");
    }
  };

  const handleWishlist = async (productId: string) => {
    // Wishlist implementation
  };

  const isMinimal = variant === "minimal";
  const isFeatured = variant === "featured";

  return (
    <section className={cn(
      "py-16 md:py-20",
      isFeatured && "bg-gradient-to-b from-muted/50 to-background"
    )}>
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            {isFeatured && (
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-700 border-emerald-200 px-4 py-1.5 rounded-full">
                Editor's Pick
              </Badge>
            )}
            <h2 className={cn(
              "font-bold tracking-tight",
              isFeatured ? "text-5xl text-primary" : "text-4xl text-primary"
            )}>
              {title}
            </h2>
            {subtitle && (
              <p className={cn(
                "mt-4",
                isFeatured ? "text-xl text-muted-foreground" : "text-lg text-muted-foreground"
              )}>
                {subtitle}
              </p>
            )}
          </div>
          
          {showViewAll && (
            <Button
              variant="outline"
              size="lg"
              asChild
              className={cn(
                "group border-border hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300",
                isFeatured && "px-8"
              )}
            >
              <Link href="/products" className="flex items-center">
                Explore All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          )}
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel
            plugins={plugins}
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
              containScroll: "trimSnaps",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {products.map((product) => {
                const discount = product.originalPrice && product.originalPrice > product.price
                  ? Math.round((1 - product.price / product.originalPrice) * 100)
                  : 0;

                return (
                  <CarouselItem
                    key={product.id}
                    className={cn(
                      "pl-4 md:pl-6",
                      isMinimal 
                        ? "basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                        : isFeatured
                        ? "basis-[90%] sm:basis-1/2 lg:basis-1/3"
                        : "basis-[90%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    )}
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      className="group block h-full"
                    >
                      <div className={cn(
                        "h-full bg-card rounded-2xl overflow-hidden",
                        "transition-all duration-300",
                        "hover:shadow-2xl hover:-translate-y-2",
                        isFeatured && "border border-border"
                      )}>
                        {/* Image Container */}
                        <div className={cn(
                          "relative overflow-hidden bg-gradient-to-b from-muted/80 to-muted",
                          isFeatured ? "aspect-[4/5]" : "aspect-[3/4]"
                        )}>
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, (max-width: 1280px) 30vw, 23vw"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                            {product.isNew && (
                              <Badge className="bg-emerald-500 text-white border-0 px-3 py-1 rounded-full font-medium shadow-lg animate-pulse">
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

                          {/* Quick Actions Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-6 left-6 right-6">
                              <Button
                                size="lg"
                                disabled={adding}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleQuickAdd(product);
                                }}
                                className="w-full bg-background text-foreground hover:bg-muted font-semibold h-12 rounded-xl shadow-lg hover:scale-[1.02] transition-transform border border-border"
                              >
                                {adding ? (
                                  <>
                                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                    Adding...
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    Quick Add
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Floating Actions */}
                          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={(e) => {
                                e.preventDefault();
                                handleWishlist(product.id);
                              }}
                              className="h-11 w-11 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:shadow-xl border border-border text-foreground"
                            >
                              <Heart className="h-5 w-5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `/product/${product.slug}?quickview=true`;
                              }}
                              className="h-11 w-11 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:shadow-xl border border-border text-foreground"
                            >
                              <Eye className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className={cn("p-5", isMinimal && "p-4")}>
                          {product.category && (
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                              {product.category}
                            </p>
                          )}
                          
                          <h3 className={cn(
                            "font-semibold text-foreground line-clamp-2 mb-3",
                            isFeatured ? "text-xl" : "text-lg",
                            "group-hover:text-primary transition-colors"
                          )}>
                            {product.name}
                          </h3>
                          
                          {product.shortDescription && !isMinimal && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                              {product.shortDescription}
                            </p>
                          )}
                          
                          {/* Rating */}
                          {product.rating && !isMinimal && (
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-4 w-4",
                                      i < Math.floor(product.rating || 0)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-muted-foreground/45"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                ({product.rating})
                              </span>
                            </div>
                          )}
                          
                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "font-bold",
                                  isFeatured ? "text-2xl" : "text-xl"
                                )}>
                                  ${product.price.toFixed(2)}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className={cn(
                                    "text-muted-foreground line-through",
                                    isFeatured ? "text-lg" : "text-base"
                                  )}>
                                    ${product.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              
                              {/* Shipping Info */}
                              {!isMinimal && (
                                <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                                  <Truck className="h-4 w-4" />
                                  <span>Free shipping</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Minimal variant CTA */}
                            {isMinimal && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full border-border hover:border-foreground"
                              >
                                <ShoppingBag className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            
            {/* Navigation */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none">
              <CarouselPrevious className="pointer-events-auto -left-12 h-14 w-14 rounded-full border-border bg-card/95 text-foreground backdrop-blur-sm shadow-xl hover:bg-muted hover:shadow-2xl hover:scale-110 transition-all hidden lg:flex" />
              <CarouselNext className="pointer-events-auto -right-12 h-14 w-14 rounded-full border-border bg-card/95 text-foreground backdrop-blur-sm shadow-xl hover:bg-muted hover:shadow-2xl hover:scale-110 transition-all hidden lg:flex" />
            </div>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-10">
              <CarouselDots className="gap-2" />
            </div>
          </Carousel>
        </div>

        {/* View All CTA - Mobile */}
        {showViewAll && (
          <div className="flex justify-center mt-12 lg:hidden">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full max-w-sm"
            >
              <Link href="/products" className="flex items-center justify-center">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}