"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Wallet,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils/format";

const features = [
  {
    icon: Wallet,
    title: "Cash on Delivery",
    description: "Order with confidence and pay only when your package arrives at your door.",
    gradient: "from-violet-500/15 to-purple-500/5",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: `Free shipping on orders over ${formatPrice(CONFIG.FREE_SHIPPING_THRESHOLD)}. Tracked delivery across Pakistan.`,
    gradient: "from-sky-500/15 to-cyan-500/5",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "14-day returns on unused items. You pay return delivery for change of mind; we cover it for wrong or damaged orders.",
    gradient: "from-blue-500/15 to-indigo-500/5",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: ShieldCheck,
    title: "Authentic Products",
    description: "Curated premium cosmetics and skincare from trusted brands you can rely on.",
    gradient: "from-emerald-500/15 to-teal-500/5",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
] as const;

export default function WhyShopSection() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      aria-labelledby="why-shop-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-muted/30 to-background"
        aria-hidden
      />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl"
        aria-hidden
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            The Bloom Promise
          </div>
          <h2
            id="why-shop-heading"
            className="text-3xl font-display font-bold text-foreground md:text-4xl"
          >
            Beauty shopping, made simple
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            From checkout to delivery, we focus on a smooth experience—premium products,
            transparent pricing in PKR, and support when you need it.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  "group relative rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm",
                  "transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
                )}
              >
                <div
                  className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                    feature.gradient
                  )}
                >
                  <Icon className={cn("h-6 w-6", feature.iconColor)} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/products">
              Shop All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/track-order">Track Your Order</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
