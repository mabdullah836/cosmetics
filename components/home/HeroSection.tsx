"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ArrowRight, Sparkles, Tag, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  bgColor?: string;
  badge?: {
    text: string;
    icon: React.ReactNode;
    color: string;
  };
}

interface HeroSectionProps {
  slides?: HeroSlide[];
}

export default function HeroSection({
  slides = [
    {
      id: "1",
      title: "Summer Glow Collection",
      subtitle: "Illuminate your beauty with our premium cosmetics. Up to 50% off on bestselling products.",
      imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1920&h=1080&fit=crop",
      ctaText: "Shop the Sale",
      ctaLink: "/sale",
      bgColor: "bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600",
      badge: {
        text: "Limited Time",
        icon: <Tag className="h-3 w-3" />,
        color: "from-amber-400 to-amber-500"
      }
    },
    {
      id: "2",
      title: "New Arrivals",
      subtitle: "Discover innovative formulas and trending shades. Be the first to experience beauty redefined.",
      imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1920&h=1080&fit=crop",
      ctaText: "Explore New",
      ctaLink: "/products?sort=newest",
      bgColor: "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600",
      badge: {
        text: "Just In",
        icon: <Sparkles className="h-3 w-3" />,
        color: "from-emerald-400 to-cyan-500"
      }
    },
    {
      id: "3",
      title: "Editor's Choice",
      subtitle: "Our top-rated products loved by beauty experts and customers worldwide.",
      imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=1080&fit=crop",
      ctaText: "Shop Bestsellers",
      ctaLink: "/products?sort=bestselling",
      bgColor: "bg-gradient-to-br from-orange-400 via-red-500 to-pink-600",
      badge: {
        text: "Award Winning",
        icon: <Award className="h-3 w-3" />,
        color: "from-violet-500 to-purple-600"
      }
    },
  ],
}: HeroSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [progress, setProgress] = useState(0);

  const plugins = useMemo(
    () => [
      Autoplay({
        delay: 6000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        rootNode: (emblaRoot) => emblaRoot.parentElement,
      }),
    ],
    []
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setProgress(0); // Reset progress on slide change
    });
  }, [api]);

  // Progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 0;
        }
        return prev + 100 / 120; // 6 second timer
      });
    }, 50);

    return () => clearInterval(interval);
  }, [current]);

  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/30 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
      
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 xl:px-16 py-6 lg:py-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
          <Carousel
            setApi={setApi}
            plugins={plugins}
            opts={{
              align: "center",
              loop: true,
              dragFree: false,
              containScroll: "trimSnaps",
            }}
            className="w-full"
          >
            <CarouselContent className="h-[500px] md:h-[600px] lg:h-[650px]">
              {slides.map((slide, index) => (
                <CarouselItem key={slide.id} className="basis-full">
                  <div className={cn(
                    "relative h-full w-full flex items-center p-8 md:p-12 lg:p-16",
                    slide.bgColor
                  )}>
                    {/* Background Image with Parallax Effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        className="object-cover scale-105 group-hover:scale-110 transition-transform duration-[7000ms] ease-out"
                        sizes="(max-width: 768px) 100vw, 100vw"
                        priority={index === 0}
                        quality={90}
                      />
                      {/* Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,transparent_30%,black/60_100%)]" />
                    </div>
                    
                    {/* Content Container */}
                    <div className="relative z-10 max-w-2xl ml-0 lg:ml-16">
                      {/* Badge */}
                      {slide.badge && (
                        <Badge className={cn(
                          "mb-6 backdrop-blur-sm border-0 px-4 py-2 text-sm font-medium",
                          "bg-gradient-to-r text-white shadow-lg",
                          slide.badge.color
                        )}>
                          <span className="flex items-center gap-2">
                            {slide.badge.icon}
                            {slide.badge.text}
                          </span>
                        </Badge>
                      )}

                      {/* Title */}
                      <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
                        {slide.title.split(' ').map((word, i, arr) => (
                          <span
                            key={i}
                            className={cn(
                              "inline-block transition-all duration-700",
                              i === arr.length - 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80" : ""
                            )}
                          >
                            {word}
                            {i < arr.length - 1 && ' '}
                          </span>
                        ))}
                      </h1>

                      {/* Subtitle */}
                      <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-xl leading-relaxed">
                        {slide.subtitle}
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          asChild
                          size="lg"
                          className="bg-white text-gray-900 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-full hover:scale-105 active:scale-95 group/btn"
                        >
                          <Link href={slide.ctaLink} className="flex items-center">
                            {slide.ctaText}
                            <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:border-white/50 shadow-lg px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
                        >
                          <Link href="/products">
                            Browse All
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Arrows */}
            <CarouselPrevious 
              className="absolute top-1/2 left-4 lg:left-8 -translate-y-1/2 h-14 w-14 bg-black/20 backdrop-blur-sm hover:bg-black/30 border-white/20 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
            />
            <CarouselNext 
              className="absolute top-1/2 right-4 lg:right-8 -translate-y-1/2 h-14 w-14 bg-black/20 backdrop-blur-sm hover:bg-black/30 border-white/20 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
            />

            {/* Progress Bar */}
            <div className="absolute bottom-4 left-8 right-8 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-50"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Slide Dots */}
            <div className="absolute bottom-6 right-8 flex gap-2 z-10">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 relative group/dot",
                    "hover:scale-125"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    index === current
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/80"
                  )} />
                  {/* Active dot pulse effect */}
                  {index === current && (
                    <div className="absolute inset-0 -m-1 border border-white/50 rounded-full animate-ping" />
                  )}
                </button>
              ))}
            </div>
          </Carousel>

          {/* Floating Elements */}
          <div className="absolute top-8 right-8 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">50%</div>
                <div className="text-sm text-white/80">OFF</div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block animate-bounce">
            <div className="text-white/60 text-sm flex flex-col items-center">
              <span>Scroll</span>
              <div className="h-6 w-px bg-white/40 mt-2" />
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Premium Products</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">4.8★</div>
                <div className="text-sm text-gray-600">Avg. Rating</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                <Tag className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                <div className="h-5 w-5 text-amber-600">✓</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">Free</div>
                <div className="text-sm text-gray-600">Shipping</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}