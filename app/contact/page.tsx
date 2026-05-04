import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Bloom Beauty. We're here to help with orders, product questions, and feedback.",
};

export default function ContactPage() {
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
              <BreadcrumbPage>Contact Us</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
            Contact Us
          </h1>
          <p className="text-muted-foreground mb-10">
            Have a question or feedback? We&apos;d love to hear from you.
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-10">
            <Card>
              <CardHeader>
                <Mail className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Email</CardTitle>
                <CardDescription>We typically respond within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:support@bloombeauty.com"
                  className="text-primary hover:underline font-medium"
                >
                  support@bloombeauty.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>Mon–Fri, 9am–6pm EST</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Click the chat icon in the bottom right corner to start a conversation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Headquarters</CardTitle>
                <CardDescription>Visit us by appointment</CardDescription>
              </CardHeader>
              <CardContent>
                <address className="text-sm text-muted-foreground not-italic">
                  123 Beauty Lane
                  <br />
                  New York, NY 10001
                </address>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Support Hours</CardTitle>
                <CardDescription>When we&apos;re available</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monday – Friday: 9:00 AM – 6:00 PM EST
                  <br />
                  Saturday: 10:00 AM – 4:00 PM EST
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Before you reach out</CardTitle>
              <CardDescription>Quick links that might help</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <Link href="/faq" className="text-primary hover:underline">FAQs</Link> — Answers to common questions about orders, shipping, and returns.
              </p>
              <p>
                <Link href="/shipping-returns" className="text-primary hover:underline">Shipping & Returns</Link> — Delivery times, tracking, and return instructions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
