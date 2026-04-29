import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ShippingBanner from "@/components/layout/ShippingBanner";
import ServerHeader from "@/components/layout/ServerHeader";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/providers/CartProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Premium Cosmetics | Natural Beauty Products",
    template: "%s | Premium Cosmetics",
  },
  description: "Discover our curated collection of premium cosmetics and natural beauty products. Free shipping on orders over $50.",
  keywords: ["cosmetics", "beauty", "makeup", "skincare", "natural"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    siteName: "Premium Cosmetics",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <ShippingBanner />
            <ServerHeader />
            <main className="flex-1">
              {children}
            </main>
            <Toaster />
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}