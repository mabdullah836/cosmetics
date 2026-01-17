"use client";

import { Rabbit, Leaf, Recycle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const values = [
  {
    icon: Rabbit,
    title: "Cruelty-Free & Vegan",
    description:
      "Never tested on animals. Our products are 100% vegan and made with compassion for all living beings.",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-600",
  },
  {
    icon: Leaf,
    title: "Clean Ingredients",
    description:
      "No parabens, sulfates, or harmful chemicals. Just pure, effective ingredients that nourish your skin.",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-600",
  },
  {
    icon: Recycle,
    title: "Sustainable Packaging",
    description:
      "Eco-friendly materials that protect our planet. Recyclable, refillable, and responsibly sourced.",
    gradient: "from-teal-500/10 to-cyan-500/10",
    iconColor: "text-teal-600",
  },
];

export default function BrandValues() {
  return (
    <section 
      className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30"
      aria-labelledby="brand-values-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Our Values
          </div>
          <h2 
            id="brand-values-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 max-w-3xl mx-auto"
          >
            Our Promise to You
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We believe in beauty that doesn&apos;t compromise on ethics or quality
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card
                key={value.title}
                className={cn(
                  "text-center p-6 lg:p-8 border-0 shadow-sm hover:shadow-xl transition-all duration-500 animate-fade-in-up group",
                  "bg-background/80 backdrop-blur-sm dark:bg-background/90",
                  "hover:-translate-y-2"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0 space-y-6">
                  {/* Icon Container */}
                  <div className={cn(
                    "relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-2 mx-auto",
                    "transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                  )}>
                    {/* Background Gradient */}
                    <div className={cn(
                      "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity duration-500",
                      value.gradient
                    )} />
                    
                    {/* Icon */}
                    <div className="relative">
                      <Icon className={cn(
                        "h-10 w-10 transition-all duration-500 group-hover:scale-125",
                        value.iconColor
                      )} />
                    </div>
                    
                    {/* Decorative Ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-500" />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl lg:text-2xl font-display font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                      {value.description}
                    </p>
                  </div>

                  {/* Learn More Link (Hidden on mobile, shown on hover) */}
                  <div className="pt-2">
                    <button
                      className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:underline focus:outline-none focus:underline"
                      aria-label={`Learn more about ${value.title}`}
                    >
                      Learn more →
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Banner */}
        <div className="mt-16 lg:mt-20 p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-foreground">100%</div>
              <div className="text-sm text-muted-foreground">Vegan Products</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-foreground">5⭐</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-foreground">♻️</div>
              <div className="text-sm text-muted-foreground">Recyclable Packaging</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}