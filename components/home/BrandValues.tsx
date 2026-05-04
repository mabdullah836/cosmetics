"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BRAND_VALUES } from "@/lib/constants";

export default function BrandValues() {
  return (
    <section 
      className="py-20 md:py-24 bg-background"
      aria-labelledby="brand-values-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 
            id="brand-values-heading"
            className="text-3xl md:text-4xl font-display font-bold text-primary mb-8"
          >
            Our Commitment
          </h2>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {BRAND_VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <Card
                key={value.title}
                className={cn(
                  "text-center p-8 border border-border/50 shadow-sm transition-all duration-200",
                  "bg-background hover:shadow-md hover:border-primary/30 hover:-translate-y-1"
                )}
              >
                <CardContent className="p-0 space-y-4">
                  {/* Icon Container */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4 mx-auto">
                    <div className={cn(
                      "absolute inset-0 rounded-lg bg-gradient-to-br opacity-10",
                      value.gradient
                    )} />
                    <Icon className={cn(
                      "h-8 w-8 relative",
                      value.iconColor
                    )} />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}