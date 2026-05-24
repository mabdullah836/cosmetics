import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "How Bloom Beauty collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
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
              <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-10">
            Last updated: January 2025
          </p>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p className="leading-relaxed">
                  We collect information you provide when you create an account, place an order, subscribe to our newsletter, or contact us. This may include your name, email address, shipping and billing address, phone number, and payment information.
                </p>
                <p className="leading-relaxed">
                  We also automatically collect certain technical data when you visit our site, such as your IP address, browser type, and device information, to improve our services and security.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p className="leading-relaxed">
                  We use your information to process orders, send order confirmations and shipping updates, respond to your inquiries, and improve our website and products. With your consent, we may send you promotional emails about new products and offers.
                </p>
                <p className="leading-relaxed">
                  We do not sell your personal information to third parties. We may share data with service providers who help us operate our business (e.g., payment processors, shipping carriers) under strict confidentiality agreements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="leading-relaxed">
                  We use industry-standard encryption (SSL) to protect your data during transmission. Payment information is processed by secure, PCI-compliant providers. We take reasonable measures to safeguard your personal information from unauthorized access, use, or disclosure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p className="leading-relaxed">
                  You may access, update, or delete your account information at any time through your account settings. You can unsubscribe from marketing emails via the link in any email or by contacting us. Depending on your location, you may have additional rights regarding your personal data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cookies</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="leading-relaxed">
                  We use cookies and similar technologies to remember your preferences, keep you signed in, and understand how you use our site. You can adjust your browser settings to limit or block cookies, though some features may not work as intended.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="leading-relaxed">
                  For privacy-related questions or requests, please contact us at{" "}
                  <a href="mailto:privacy@bloombeauty.com" className="text-primary hover:underline">privacy@bloombeauty.com</a> or visit our{" "}
                  <Link href="/contact" className="text-primary hover:underline">Contact</Link> page.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
