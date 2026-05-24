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
import { ArrowRight, Sparkles, Tag, Award, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils/format";

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
      subtitle:
        "Illuminate your beauty with skin-first formulas and runway-worthy pigment. Limited offers on hero shades.",
      imageUrl:
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1920&h=1080&fit=crop",
      ctaText: "Shop the Sale",
      ctaLink: "/sale",
      bgColor:
        "bg-gradient-to-br from-rose-600/90 via-fuchsia-950/85 to-stone-950",
      badge: {
        text: "Limited time",
        icon: <Tag className="h-3 w-3" />,
        color: "from-amber-400 via-rose-400 to-pink-500",
      },
    },
    {
      id: "2",
      title: "New Arrivals",
      subtitle:
        "Glass-skin serums, soft-matte lips, and the palettes everyone will ask about — fresh drops weekly.",
      imageUrl:
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1920&h=1080&fit=crop",
      ctaText: "Explore new",
      ctaLink: "/products?sort=newest",
      bgColor:
        "bg-gradient-to-br from-rose-700/90 via-purple-950/80 to-neutral-950",
      badge: {
        text: "Just in",
        icon: <Sparkles className="h-3 w-3" />,
        color: "from-emerald-400 via-teal-400 to-cyan-500",
      },
    },
    {
      id: "3",
      title: "Editor's Choice",
      subtitle:
        "The bestsellers beauty editors buy again — clean ingredients, rich payoff, zero compromise.",
      imageUrl:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=1080&fit=crop",
      ctaText: "Shop bestsellers",
      ctaLink: "/products?sort=bestselling",
      bgColor:
        "bg-gradient-to-br from-amber-700/85 via-rose-800/90 to-violet-950",
      badge: {
        text: "Award winning",
        icon: <Award className="h-3 w-3" />,
        color: "from-violet-500 via-fuchsia-500 to-rose-500",
      },
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
      setProgress(0);
    });
  }, [api]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 0;
        }
        return prev + 100 / 120;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [current]);

  return (
    <section className="hero-ambient relative overflow-hidden">
      <div
        className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl dark:bg-primary/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-32 h-64 w-64 rounded-full bg-[hsl(var(--gold)/0.12)] blur-3xl dark:bg-[hsl(var(--gold)/0.08)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1920px] px-4 py-8 sm:px-6 lg:px-12 lg:py-10 xl:px-16">
        <div className="group relative overflow-hidden rounded-[1.75rem] shadow-2xl ring-1 ring-black/10 dark:ring-white/10 md:rounded-[2rem]">
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
            <CarouselContent className="h-[520px] md:h-[600px] lg:h-[min(72vh,680px)]">
              {slides.map((slide, index) => (
                <CarouselItem key={slide.id} className="basis-full">
                  <div
                    className={cn(
                      "relative flex h-full w-full items-center p-6 sm:p-10 md:p-12 lg:p-16",
                      slide.bgColor
                    )}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        className="object-cover transition-transform duration-[8000ms] ease-out group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, 100vw"
                        priority={index === 0}
                        quality={90}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent md:from-black/65 md:via-black/25" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_20%_50%,transparent_20%,rgba(0,0,0,0.55)_100%)]" />
                    </div>

                    <div className="relative z-10 w-full max-w-xl lg:ml-8 lg:max-w-2xl xl:ml-14">
                      <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-black/45 via-black/30 to-black/25 p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 sm:p-8 md:p-10">
                        {slide.badge && (
                          <Badge
                            className={cn(
                              "mb-5 border-0 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg backdrop-blur-sm sm:mb-6 sm:px-4 sm:text-sm",
                              "bg-gradient-to-r",
                              slide.badge.color
                            )}
                          >
                            <span className="flex items-center gap-2">
                              {slide.badge.icon}
                              {slide.badge.text}
                            </span>
                          </Badge>
                        )}

                        <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white text-balance sm:text-5xl md:text-6xl lg:text-7xl">
                          {slide.title.split(" ").map((word, i, arr) => (
                            <span key={i} className="inline-block">
                              <span
                                className={cn(
                                  i === arr.length - 1 &&
                                    "bg-gradient-to-r from-white via-rose-100 to-amber-100/90 bg-clip-text text-transparent"
                                )}
                              >
                                {word}
                              </span>
                              {i < arr.length - 1 && "\u00a0"}
                            </span>
                          ))}
                        </h1>

                        <p className="mt-5 max-w-lg text-base leading-relaxed text-white/88 md:text-lg lg:text-xl">
                          {slide.subtitle}
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                          <Button
                            asChild
                            size="lg"
                            className="group rounded-full bg-white px-8 py-6 text-base font-semibold text-neutral-900 shadow-xl transition-all hover:scale-[1.02] hover:bg-white/95 active:scale-[0.98]"
                          >
                            <Link
                              href={slide.ctaLink}
                              className="flex items-center gap-2"
                            >
                              {slide.ctaText}
                              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="rounded-full border-white/40 bg-white/10 px-8 py-6 text-base font-semibold text-white shadow-lg backdrop-blur-md hover:bg-white/20 hover:text-white"
                          >
                            <Link href="/products">Browse all</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious
              variant="outline"
              className="left-3 top-1/2 z-20 h-12 w-12 -translate-y-1/2 border-white/25 bg-black/30 text-white opacity-0 shadow-xl backdrop-blur-md transition-[opacity,background-color,transform] duration-200 group-hover:opacity-100 hover:scale-105 hover:border-white/50 hover:bg-black/50 hover:text-white hover:opacity-100 focus-visible:opacity-100 md:left-6 md:h-14 md:w-14"
            />
            <CarouselNext
              variant="outline"
              className="right-3 top-1/2 z-20 h-12 w-12 -translate-y-1/2 border-white/25 bg-black/30 text-white opacity-0 shadow-xl backdrop-blur-md transition-[opacity,background-color,transform] duration-200 group-hover:opacity-100 hover:scale-105 hover:border-white/50 hover:bg-black/50 hover:text-white hover:opacity-100 focus-visible:opacity-100 md:right-6 md:h-14 md:w-14"
            />

            <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center gap-4 px-4 pb-4 md:px-8 md:pb-5">
              <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-white via-rose-100 to-amber-100 transition-[width] duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex shrink-0 gap-1.5">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => api?.scrollTo(index)}
                    className="rounded-full p-1.5 transition-transform hover:scale-110"
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <span
                      className={cn(
                        "block h-2 w-2 rounded-full transition-all",
                        index === current
                          ? "w-6 bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                          : "bg-white/45 hover:bg-white/75"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </Carousel>

          <div className="pointer-events-none absolute right-6 top-6 z-10 hidden lg:block xl:right-10 xl:top-10">
            <div className="rounded-2xl border border-white/25 bg-white/10 px-5 py-4 text-center shadow-2xl backdrop-blur-md">
              <div className="text-3xl font-display font-semibold text-white">
                50%
              </div>
              <div className="text-xs font-medium uppercase tracking-widest text-white/75">
                Off
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {[
            {
              icon: Award,
              stat: "500+",
              label: "Premium products",
              iconClass:
                "from-primary/20 to-primary/5 text-primary dark:from-primary/30 dark:to-primary/10",
            },
            {
              icon: Sparkles,
              stat: "4.8★",
              label: "Avg. rating",
              iconClass:
                "from-emerald-500/15 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
            },
            {
              icon: Tag,
              stat: "24/7",
              label: "Support",
              iconClass:
                "from-sky-500/15 to-cyan-500/10 text-sky-600 dark:text-sky-400",
            },
            {
              icon: Check,
              stat: "Free",
              label: `Shipping ${formatPrice(CONFIG.FREE_SHIPPING_THRESHOLD)}+`,
              iconClass:
                "from-amber-500/15 to-orange-500/10 text-amber-600 dark:text-amber-400",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
                    item.iconClass
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                    {item.stat}
                  </div>
                  <div className="text-xs text-muted-foreground md:text-sm">
                    {item.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
