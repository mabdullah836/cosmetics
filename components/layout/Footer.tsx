"use client";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Heart,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  Leaf,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { subscribeToNewsletterAction } from "@/lib/actions/newsletter";

const footerLinks = {
  shop: [
    { name: "New Arrivals", href: "/products?new=true" },
    { name: "Best Sellers", href: "/products?bestsellers=true" },
    { name: "Sale", href: "/products?sale=true" },
    { name: "Gift Sets", href: "/products?category=gift-sets" },
    { name: "Skincare", href: "/categories/skincare" },
    { name: "Makeup", href: "/categories/makeup" },
  ],
  categories: [
    { name: "Skincare", href: "/categories/skincare" },
    { name: "Makeup", href: "/categories/makeup" },
    { name: "Lips", href: "/categories/lips" },
    { name: "Eyes", href: "/categories/eyes" },
    { name: "Face", href: "/categories/face" },
    { name: "Fragrance", href: "/categories/fragrance" },
  ],
  help: [
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "Track Order", href: "/track-order" },
    { name: "FAQ", href: "/faq" },
    { name: "Size Guide", href: "/size-guide" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/our-story" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Store Locator", href: "/store-locator" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/bloombeauty" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/bloombeauty" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/bloombeauty" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/bloombeauty" },
];

const trustBadges = [
  { icon: Shield, text: "Secure Checkout" },
  { icon: CreditCard, text: "SSL Encrypted" },
  { icon: Truck, text: "Free Shipping Over $50" },
  { icon: Leaf, text: "Cruelty-Free & Vegan" },
];

const contactInfo = [
  { icon: Mail, text: "hello@bloombeauty.com", href: "mailto:hello@bloombeauty.com" },
  { icon: Phone, text: "(888) 555-1234", href: "tel:8885551234" },
  { icon: MapPin, text: "123 Beauty Ave, Los Angeles, CA", href: "#" },
];

const paymentMethods = [
  "Visa", "Mastercard", "American Express", "PayPal", "Apple Pay", "Google Pay", "Shop Pay"
];

async function NewsletterForm() {
  return (
    <form action={subscribeToNewsletterAction} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="email"
          name="email"
          placeholder="Your email address"
          className="flex-1 h-10 text-sm"
          required
        />
        <Button type="submit" size="sm" className="h-10">
          <Mail className="h-4 w-4 mr-2" />
          Subscribe
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Subscribe for exclusive offers and beauty tips
      </p>
    </form>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border">
      {/* Top Trust Badges */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.text}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{badge.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-primary/10 rounded-full blur-sm group-hover:bg-primary/20 transition-colors" />
                  <Sparkles className="relative h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
                  Bloom Beauty
                </h2>
              </Link>
              <p className="text-muted-foreground text-sm max-w-md">
                Clean beauty that celebrates your natural radiance. Cruelty-free,
                vegan, and sustainably made with love for you and the planet.
              </p>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Stay in Bloom</h3>
              <NewsletterForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Contact Us</h3>
              <div className="space-y-2">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={info.text}
                      href={info.href}
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span>{info.text}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground",
                        "transition-all duration-300 hover:scale-110",
                        "group focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-2"
                      )}
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Links Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category} className="space-y-4">
                  <h3 className="font-semibold text-foreground capitalize">
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className={cn(
                            "text-sm text-muted-foreground hover:text-primary",
                            "transition-colors duration-200 group inline-flex items-center gap-2"
                          )}
                        >
                          <span className="h-0.5 w-0 bg-primary group-hover:w-3 transition-all duration-300" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                We Accept
              </h3>
              <div className="flex flex-wrap gap-3 items-center">
                {paymentMethods.map((method) => (
                  <div
                    key={method}
                    className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium text-muted-foreground"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-muted-foreground">
              © {currentYear} Bloom Beauty. All rights reserved.
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground/80">
              Made with{" "}
              <Heart className="h-3 w-3 mx-1 fill-primary text-primary animate-pulse-subtle" />
              {" "}for clean beauty lovers everywhere
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-primary transition-colors hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/accessibility"
              className="text-muted-foreground hover:text-primary transition-colors hover:underline"
            >
              Accessibility
            </Link>
            <Link
              href="/sitemap"
              className="text-muted-foreground hover:text-primary transition-colors hover:underline"
            >
              Sitemap
            </Link>
            <Link
              href="/cookie-policy"
              className="text-muted-foreground hover:text-primary transition-colors hover:underline"
            >
              Cookie Policy
            </Link>
          </div>

          {/* Back to Top */}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Back to Top
          </Button>
        </div>
      </div>

      {/* Development Badge (Remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-amber-50 border-t border-amber-200">
          <div className="container mx-auto px-4 py-2 text-center">
            <p className="text-xs text-amber-800">
              🚧 Development Environment • This is a demo store • Not for actual purchases
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}