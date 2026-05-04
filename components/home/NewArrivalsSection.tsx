"use client";

import { useState, useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, Sparkles, Star, ShoppingBag, Eye, Heart, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductCarouselItem } from "@/types/homepage";

interface NewArrivalsSectionProps {
  products: ProductCarouselItem[];
}

export default function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  const [viewMode, setViewMode] = useState<"featured" | "carousel">("featured");
  const [wishlisted, setWishlisted] = useState<string[]>([]);
  
  const plugins = useMemo(
    () => [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
    []
  );

  if (products.length === 0) {
    return null;
  }

  const featuredProduct = products[0];
  const trendingProducts = products.slice(1, 5);
  const otherProducts = products.slice(5, 9);

  const handleQuickAdd = (productId: string, productName: string) => {
    // Quick add implementation
    // TODO: Implement quick add functionality
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background -z-10" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-purple-100/20 to-pink-100/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 xl:px-16">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-20 animate-pulse" />
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-xl">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1.5 rounded-full text-sm font-medium animate-bounce">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending Now
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">New Arrivals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Be the first to explore our latest innovations in beauty and cosmetics
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="lg" className="rounded-full border-border px-8">
              <Sparkles className="h-4 w-4 mr-2" />
              Featured
            </Button>
            <Button variant="outline" size="lg" className="rounded-full border-border px-8">
              Skincare
            </Button>
            <Button variant="outline" size="lg" className="rounded-full border-border px-8">
              Makeup
            </Button>
            <Button variant="outline" size="lg" className="rounded-full border-border px-8">
              Haircare
            </Button>
            <Button
              asChild
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl px-8"
            >
              <Link href="/products?new=true" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <Tabs 
          defaultValue="featured" 
          className="w-full mb-8"
          onValueChange={(v) => setViewMode(v as "featured" | "carousel")}
        >
          <TabsList className="w-fit mx-auto bg-muted/60 rounded-full p-1">
            <TabsTrigger 
              value="featured"
              className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Featured View
            </TabsTrigger>
            <TabsTrigger 
              value="carousel"
              className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Carousel View
            </TabsTrigger>
          </TabsList>

          {/* Featured View */}
          <TabsContent value="featured" className="mt-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Featured Product */}
              <div className="lg:col-span-2">
                <Link href={`/product/${featuredProduct.slug}`} className="group block">
                  <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-muted to-muted/70 border border-border shadow-xl hover:shadow-2xl transition-all duration-500">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.1)_0%,transparent_50%)]" />
                    
                    <Image
                      src={featuredProduct.imageUrl}
                      alt={featuredProduct.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                    
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                      <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
                            <Zap className="h-3 w-3 mr-1" />
                            Editor's Pick
                          </Badge>
                          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                            #1 New Arrival
                          </Badge>
                        </div>
                        
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                          {featuredProduct.name}
                        </h3>
                        
                        <p className="text-lg text-white/90 mb-6 max-w-md">
                          {featuredProduct.shortDescription || "Experience premium quality with our latest innovation"}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-6 mb-8">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-5 w-5",
                                    i < Math.floor(featuredProduct.rating || 0)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-white/30"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-white/80 font-medium">
                              {featuredProduct.rating?.toFixed(1)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-4xl font-bold text-white">
                              ${featuredProduct.price.toFixed(2)}
                            </span>
                            {featuredProduct.originalPrice && featuredProduct.originalPrice > featuredProduct.price && (
                              <span className="text-xl line-through text-white/60">
                                ${featuredProduct.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            size="lg"
                            className="bg-white text-foreground hover:bg-white/90 shadow-xl hover:shadow-2xl px-8 rounded-full font-semibold"
                            onClick={(e) => {
                              e.preventDefault();
                              handleQuickAdd(featuredProduct.id, featuredProduct.name);
                            }}
                          >
                            <ShoppingBag className="h-5 w-5 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 px-8 rounded-full font-semibold"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/product/${featuredProduct.slug}`;
                            }}
                          >
                            <Eye className="h-5 w-5 mr-2" />
                            Quick View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Trending Products Sidebar */}
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-primary mb-2">Trending Now</h3>
                  <p className="text-muted-foreground">Others are loving these</p>
                </div>
                
                <div className="space-y-4">
                  {trendingProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="group block"
                    >
                      <div className="flex gap-4 p-4 bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/70">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="80px"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs border-0">
                              New
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h4>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.preventDefault();
                                setWishlisted(prev => 
                                  prev.includes(product.id) 
                                    ? prev.filter(id => id !== product.id)
                                    : [...prev, product.id]
                                );
                              }}
                            >
                              <Heart className={cn(
                                "h-4 w-4",
                                wishlisted.includes(product.id) && "fill-red-500 text-red-500"
                              )} />
                            </Button>
                          </div>
                          
                          <p className="text-xs text-muted-foreground uppercase mb-2 truncate">
                            {product.category || "Cosmetics"}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-medium text-muted-foreground">
                                {product.rating?.toFixed(1) || "4.5"}
                              </span>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-bold text-foreground">
                                ${product.price.toFixed(2)}
                              </div>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <div className="text-xs line-through text-muted-foreground">
                                  ${product.originalPrice.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Carousel View */}
          <TabsContent value="carousel" className="mt-12">
            <Carousel
              plugins={plugins}
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-6">
                {products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-4 md:pl-6 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <Link href={`/product/${product.slug}`} className="group block h-full">
                      <div className="h-full bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                        <div className="relative aspect-[3/4] bg-gradient-to-br from-muted/70 to-muted overflow-hidden">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, (max-width: 1280px) 30vw, 23vw"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
                              <Sparkles className="h-3 w-3 mr-1" />
                              New
                            </Badge>
                            {product.isSale && (
                              <Badge className="bg-red-500 text-white border-0 shadow-lg">
                                Sale
                              </Badge>
                            )}
                          </div>
                          
                          {/* Quick Actions */}
                          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-11 w-11 rounded-full bg-background/90 text-foreground backdrop-blur-sm shadow-lg border border-border"
                              onClick={(e) => {
                                e.preventDefault();
                                setWishlisted(prev => 
                                  prev.includes(product.id) 
                                    ? prev.filter(id => id !== product.id)
                                    : [...prev, product.id]
                                );
                              }}
                            >
                              <Heart className={cn(
                                "h-5 w-5",
                                wishlisted.includes(product.id) && "fill-red-500 text-red-500"
                              )} />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-11 w-11 rounded-full bg-background/90 text-foreground backdrop-blur-sm shadow-lg border border-border"
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `/product/${product.slug}?quickview=true`;
                              }}
                            >
                              <Eye className="h-5 w-5" />
                            </Button>
                          </div>
                          
                          {/* Quick Add Overlay */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                              className="w-full bg-background text-foreground hover:bg-muted font-semibold h-12 rounded-xl shadow-lg hover:scale-[1.02] transition-transform border border-border"
                              onClick={(e) => {
                                e.preventDefault();
                                handleQuickAdd(product.id, product.name);
                              }}
                            >
                              <ShoppingBag className="h-5 w-5 mr-2" />
                              Quick Add
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                            {product.category || "Cosmetics"}
                          </p>
                          
                          <h4 className="font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                            {product.name}
                          </h4>
                          
                          <div className="flex items-center gap-2 mb-3">
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
                              ({product.rating?.toFixed(1) || "4.5"})
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-foreground">
                                ${product.price.toFixed(2)}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-base line-through text-muted-foreground">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">Free Shipping</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 -left-12 h-14 w-14 rounded-full border-border bg-card/95 text-foreground backdrop-blur-sm shadow-xl hover:bg-muted hover:shadow-2xl hover:scale-110 transition-all hidden xl:flex" />
              <CarouselNext className="absolute top-1/2 -translate-y-1/2 -right-12 h-14 w-14 rounded-full border-border bg-card/95 text-foreground backdrop-blur-sm shadow-xl hover:bg-muted hover:shadow-2xl hover:scale-110 transition-all hidden xl:flex" />
            </Carousel>
          </TabsContent>
        </Tabs>

        {/* Additional Products Grid */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">More New Arrivals</h3>
              <p className="text-muted-foreground">Complete your collection</p>
            </div>
            <Button
              variant="ghost"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/products?new=true">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group block"
              >
                <div className="bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-muted/70 to-muted">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      New
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-foreground">
                        ${product.price.toFixed(2)}
                      </div>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}