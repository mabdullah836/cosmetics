"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";

const slides = [
  {
    id: 1,
    title: "Discover Your Natural Glow",
    subtitle: "Clean beauty that celebrates your unique radiance",
    cta: "Shop Skincare",
    link: "/products?category=skincare",
    gradient: "bg-gradient-hero-1",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1920&h=1080&fit=crop",
    imageAlt: "Natural skincare products with plants and bottles",
    overlay: "dark:bg-black/20",
  },
  {
    id: 2,
    title: "Cruelty-Free & Vegan",
    subtitle: "Beautiful products that are kind to you and the planet",
    cta: "Explore Collection",
    link: "/products",
    gradient: "bg-gradient-hero-2",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1920&h=1080&fit=crop",
    imageAlt: "Vegan cosmetics with green leaves background",
    overlay: "dark:bg-black/20",
  },
  {
    id: 3,
    title: "New Season, New You",
    subtitle: "Spring collection now available with exclusive shades",
    cta: "Shop New Arrivals",
    link: "/products?new=true",
    gradient: "bg-gradient-hero-3",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=1080&fit=crop",
    imageAlt: "Spring makeup collection with floral background",
    overlay: "dark:bg-black/20",
  },
];

export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

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

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section 
      className="relative w-full overflow-hidden"
      aria-label="Hero carousel"
    >
      <Carousel
        setApi={setApi}
        plugins={plugins}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          duration: 50,
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="relative">
              <div className={cn(
                "relative w-full h-[70vh] min-h-[500px] overflow-hidden",
                slide.gradient
              )}>
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    className="object-cover opacity-20"
                    sizes="100vw"
                    priority={index === 0}
                  />
                  <div className={cn("absolute inset-0", slide.overlay)} />
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center">
                  <h1
                    className={cn(
                      "text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 max-w-4xl",
                      index === current ? "animate-fade-in-up" : ""
                    )}
                    style={{ animationDelay: "0.1s" }}
                  >
                    {slide.title}
                  </h1>
                  <p
                    className={cn(
                      "text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl",
                      index === current ? "animate-fade-in-up" : ""
                    )}
                    style={{ animationDelay: "0.2s" }}
                  >
                    {slide.subtitle}
                  </p>
                  <div
                    className={cn(
                      index === current ? "animate-fade-in-up" : ""
                    )}
                    style={{ animationDelay: "0.3s" }}
                  >
                    <Button 
                      asChild 
                      size="lg" 
                      className="rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <Link href={slide.link} scroll={false}>
                        {slide.cta}
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
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background hidden sm:flex"
          variant="outline"
          size="icon"
        />
        <CarouselNext 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background hidden sm:flex"
          variant="outline"
          size="icon"
        />
      </Carousel>

      {/* Mobile Navigation Buttons */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-between px-4 sm:hidden z-20">
        <Button
          onClick={() => api?.scrollPrev()}
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm shadow-lg"
          aria-label="Previous slide"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <Button
          onClick={() => api?.scrollNext()}
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm shadow-lg"
          aria-label="Next slide"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <Button
            key={index}
            onClick={() => api?.scrollTo(index)}
            variant="ghost"
            size="icon"
            className={cn(
              "p-0 w-2.5 h-2.5 min-h-0 rounded-full transition-all duration-300 hover:scale-110",
              index === current
                ? "bg-primary w-8"
                : "bg-foreground/30 hover:bg-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </Button>
        ))}
      </div>

      {/* Slide Counter for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {current + 1} of {count}
      </div>
    </section>
  );
}