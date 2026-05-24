"use client";

import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "New York, NY",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    quote:
      "These products have completely transformed my skincare routine. My skin has never looked better!",
    product: "Daily Moisturizer",
    verified: true,
  },
  {
    id: 2,
    name: "Emily Chen",
    location: "Los Angeles, CA",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    quote:
      "The quality is incredible. The lipsticks last all day, and the packaging is so elegant. Worth every penny!",
    product: "Matte Lipstick Collection",
    verified: true,
  },
  {
    id: 3,
    name: "Jessica Williams",
    location: "Chicago, IL",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    quote:
      "Finally found a brand that aligns with my values. Clean ingredients, sustainable packaging, and products that actually work!",
    product: "Complete Skincare Set",
    verified: true,
  },
  {
    id: 4,
    name: "Alexandra Rodriguez",
    location: "Miami, FL",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    quote:
      "The foundation gives such natural coverage. It feels light but covers perfectly. My go-to for everyday wear!",
    product: "Natural Finish Foundation",
    verified: true,
  },
  {
    id: 5,
    name: "Maya Patel",
    location: "Seattle, WA",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    quote:
      "As someone with sensitive skin, finding clean products that actually work is challenging. This brand delivers!",
    product: "Sensitive Skin Collection",
    verified: true,
  },
  {
    id: 6,
    name: "Taylor Morgan",
    location: "Austin, TX",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    quote:
      "Great products overall. The eyeshadow palette has amazing pigment payoff. Would love more matte options!",
    product: "Eyeshadow Palette Pro",
    verified: true,
  },
];

export default function Testimonials() {
  const plugins = useMemo(
    () => [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
      }),
    ],
    []
  );

  return (
    <section 
      className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Customer Stories
          </div>
          <h2 
            id="testimonials-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-4"
          >
            Loved by Thousands
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our community has to say about their experience
          </p>
          
          {/* Stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-10">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">98%</div>
              <div className="text-sm text-muted-foreground">Would Recommend</div>
            </div>
          </div>
        </div>

        {/* Desktop Grid (3 columns) */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index} 
            />
          ))}
        </div>

        {/* Mobile/Tablet Carousel */}
        <div className="lg:hidden max-w-3xl mx-auto">
          <Carousel
            plugins={plugins}
            opts={{
              align: "start",
              loop: true,
              duration: 30,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2">
                  <TestimonialCard 
                    testimonial={testimonial} 
                    index={index} 
                    className="h-full"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6 flex items-center justify-center gap-4">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 lg:mt-20 pt-8 border-t border-border/50">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Trusted by beauty enthusiasts worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              <span className="text-sm font-medium">⭐ 100% Satisfaction</span>
              <span className="text-sm font-medium">♻️ Eco Packaging</span>
              <span className="text-sm font-medium">🔒 Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
interface TestimonialCardProps {
  testimonial: typeof testimonials[0];
  index: number;
  className?: string;
}

function TestimonialCard({ testimonial, index, className }: TestimonialCardProps) {
  return (
    <Card
      className={cn(
        "h-full p-6 border border-border/50 shadow-sm hover:shadow-lg transition-all duration-500 relative group",
        "hover:-translate-y-1 hover:border-primary/20",
        "animate-fade-in-up",
        className
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-0">
        {/* Quote Icon */}
        <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <Quote className="h-10 w-10 text-primary" />
        </div>

        {/* Rating */}
        <div className="flex gap-0.5 mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < testimonial.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted"
              )}
            />
          ))}
          <span className="ml-2 text-sm font-medium text-foreground">
            {testimonial.rating.toFixed(1)}
          </span>
        </div>

        {/* Verified Badge */}
        {testimonial.verified && (
          <div className="inline-flex items-center gap-1 mb-4 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Verified Purchase
          </div>
        )}

        {/* Quote */}
        <blockquote className="mb-6">
          <p className="text-foreground leading-relaxed line-clamp-4">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </blockquote>

        {/* Product Reference */}
        {testimonial.product && (
          <div className="mb-6">
            <p className="text-xs text-muted-foreground">Product:</p>
            <p className="text-sm font-medium text-foreground">{testimonial.product}</p>
          </div>
        )}

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
            <AvatarImage 
              src={testimonial.avatar} 
              alt={testimonial.name}
              width={48}
              height={48}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground truncate">
                {testimonial.name}
              </p>
              {testimonial.verified && (
                <svg className="h-4 w-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {testimonial.location}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
