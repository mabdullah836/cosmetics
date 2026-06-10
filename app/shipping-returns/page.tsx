import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, RotateCcw, Package, Clock } from "lucide-react";
import Link from "next/link";
import { CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils/format";

export const metadata = {
  title: "Shipping & Returns",
  description: "Shipping options, delivery times, and return policy for Bloom Beauty orders.",
};

export default function ShippingReturnsPage() {
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
              <BreadcrumbPage>Shipping & Returns</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
            Shipping & Returns
          </h1>
          <p className="text-muted-foreground mb-10">
            Everything you need to know about delivery and returns.
          </p>

          {/* Shipping */}
          <Card className="mb-8">
            <CardHeader>
              <Truck className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                <strong className="text-foreground">Free shipping</strong> on orders over {formatPrice(CONFIG.FREE_SHIPPING_THRESHOLD)}. 
                Orders below that threshold ship for {formatPrice(CONFIG.SHIPPING_COST)}.
              </p>
              <p className="leading-relaxed">
                Most orders are processed within 24–48 hours. Delivery across Pakistan typically takes 3–7 business days. 
                You will receive a tracking number once your order ships.
              </p>
            </CardContent>
          </Card>

          {/* Returns */}
          <Card className="mb-8">
            <CardHeader>
              <RotateCcw className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                We offer a <strong className="text-foreground">14-day return window</strong> from the delivery date. 
                Items must be unused and in their original packaging with tags attached.
              </p>
              <p className="leading-relaxed">
                <strong className="text-foreground">Change of mind:</strong> If you simply changed your mind, 
                return delivery charges are paid by you. Contact our support team with your order number to arrange a return.
              </p>
              <p className="leading-relaxed">
                <strong className="text-foreground">Our mistake:</strong> If you received the wrong product or a damaged item, 
                we cover all return delivery costs and issue a full refund or replacement — your choice.
              </p>
              <p className="leading-relaxed">
                Refunds are processed within 5–10 business days after we receive your return. 
                Bank transfer orders are refunded to your account; COD orders are refunded via bank transfer.
              </p>
            </CardContent>
          </Card>

          {/* Quick info */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Package className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-base">Order Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Check your email for a tracking link after your order ships. You can also view order status in your{" "}
                  <Link href="/account/orders" className="text-primary hover:underline">account</Link>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-base">Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Orders placed before 2 PM PKT on business days typically ship the same or next business day.
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Questions? Visit our <Link href="/faq" className="text-primary hover:underline">FAQ</Link> or{" "}
            <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
