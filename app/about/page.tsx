import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rabbit, Leaf, Recycle, Heart } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Us",
  description: "Learn about Bloom Beauty — our mission, values, and commitment to clean, cruelty-free cosmetics.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>About Us</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            About Bloom Beauty
          </h1>
          <p className="text-muted-foreground mb-10">
            Clean, cruelty-free beauty you can feel good about.
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none mb-12">
            <p className="text-muted-foreground leading-relaxed mb-6">
              Bloom Beauty was founded on a simple idea: beauty should be kind — to your skin, to animals, and to the planet. We create premium cosmetics and skincare that are 100% vegan, cruelty-free, and made with clean ingredients you can trust.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every product is formulated without parabens, sulfates, or harmful chemicals. We believe in transparency, quality, and sustainability at every step.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-6">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Card>
              <CardHeader>
                <Rabbit className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-base">Cruelty-Free & Vegan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  100% vegan formulas. Never tested on animals. Certified cruelty-free.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Leaf className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-base">Clean Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No parabens, sulfates, or harmful chemicals. Safe, effective, and gentle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Recycle className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-base">Sustainable Packaging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Eco-friendly and recyclable materials. We're committed to reducing waste.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <Heart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Our Promise</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="leading-relaxed">
                We stand behind every product with a 30-day satisfaction guarantee. If you're not happy, we're not happy — return unused items in original packaging for a full refund. Thank you for choosing Bloom Beauty.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
