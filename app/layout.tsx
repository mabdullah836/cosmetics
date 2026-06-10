import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ShippingBanner from "@/components/layout/ShippingBanner";
import Header from "@/components/layout/Header";
import HeaderFallback from "@/components/layout/HeaderFallback";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/providers/CartProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner"
import { CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils/format";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Premium Cosmetics | Natural Beauty Products",
    template: "%s | Premium Cosmetics",
  },
  description: `Discover our curated collection of premium cosmetics and natural beauty products. Free shipping on orders over ${formatPrice(CONFIG.FREE_SHIPPING_THRESHOLD)}.`,
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
    <html
      lang="en"
      suppressHydrationWarning
      className={poppins.variable}
    >
      <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <ShippingBanner />
            <Suspense fallback={<HeaderFallback />}>
              <Header />
            </Suspense>
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