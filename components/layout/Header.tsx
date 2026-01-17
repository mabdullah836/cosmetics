"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";
import { toast } from "sonner";
import { CartItem } from "@/types/supabase";

interface NavLink {
  name: string;
  href: string;
  submenu?: Array<{
    name: string;
    href: string;
    description?: string;
  }>;
}

const navLinks: NavLink[] = [
  {
    name: "Shop",
    href: "/products",
    submenu: [
      { name: "All Products", href: "/products", description: "Browse our full collection" },
      { name: "New Arrivals", href: "/products?new=true", description: "Latest additions" },
      { name: "Best Sellers", href: "/products?bestsellers=true", description: "Customer favorites" },
      { name: "Sale", href: "/products?sale=true", description: "Limited time offers" },
    ],
  },
  {
    name: "Categories",
    href: "/categories",
    submenu: [
      { name: "Skincare", href: "/categories/skincare" },
      { name: "Makeup", href: "/categories/makeup" },
      { name: "Fragrance", href: "/categories/fragrance" },
      { name: "Haircare", href: "/categories/haircare" },
      { name: "Bath & Body", href: "/categories/bath-body" },
    ],
  },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { cartItems } = useCart();
  
  const cartItemCount = cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSearchOpen && !(e.target as HTMLElement).closest(".search-container")) {
        setIsSearchOpen(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleQuickAddToCart = () => {
    toast.success("Added to cart", {
      description: "Product has been added to your cart",
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-background/80 backdrop-blur-sm border-b border-border/30"
      )}
    >
      {/* Top Bar */}
      <div className="hidden lg:block border-b border-border/30 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Free shipping on orders over $50
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/store-locator" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Store Locator
              </Link>
              <span className="text-muted-foreground">|</span>
              <Link 
                href="/help" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Need Help?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 sm:w-96">
              <div className="flex flex-col h-full">
                {/* Mobile Logo */}
                <div className="pt-6 pb-4 border-b border-border">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <h1 className="text-2xl font-display font-bold text-primary">
                      Bloom
                    </h1>
                  </Link>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 py-6 overflow-y-auto">
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <div key={link.name} className="border-b border-border/30 last:border-0">
                        {link.submenu ? (
                          <details className="group">
                            <summary className="flex items-center justify-between py-3 text-base font-medium text-foreground cursor-pointer list-none">
                              {link.name}
                              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="pl-4 pb-2 space-y-2">
                              {link.submenu.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </details>
                        ) : (
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "block py-3 text-base font-medium transition-colors",
                              isActive(link.href)
                                ? "text-primary"
                                : "text-foreground hover:text-primary"
                            )}
                          >
                            {link.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </nav>

                {/* Mobile Actions */}
                <div className="border-t border-border pt-4 space-y-4">
                  <div className="flex items-center justify-around">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                        <User className="h-5 w-5" />
                        <span className="sr-only">Account</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                        <Heart className="h-5 w-5" />
                        <span className="sr-only">Wishlist</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="relative" asChild>
                      <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                        <ShoppingBag className="h-5 w-5" />
                        {cartItemCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                            {cartItemCount > 9 ? "9+" : cartItemCount}
                          </span>
                        )}
                        <span className="sr-only">Cart</span>
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="px-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-sm"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-primary/10 rounded-full blur-sm" />
              <Sparkles className="relative h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
              Bloom
            </h1>
            <span className="hidden sm:inline-block text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Premium
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-200",
                    "rounded-lg",
                    isActive(link.href)
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {link.name}
                  {link.submenu && (
                    <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {link.submenu && (
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="w-64 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                      <div className="p-2">
                        {link.submenu.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex flex-col gap-0.5 p-3 rounded-md hover:bg-accent transition-colors group/item"
                          >
                            <span className="font-medium text-foreground group-hover/item:text-primary">
                              {item.name}
                            </span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-2 search-container">
            {/* Search */}
            <div className="relative hidden lg:block">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-48 xl:w-64 pl-9 transition-all duration-300",
                    isSearchOpen ? "opacity-100" : "opacity-0 lg:opacity-100"
                  )}
                />
              </form>
            </div>

            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden"
              aria-label={isSearchOpen ? "Close search" : "Open search"}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Mobile Search Overlay */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg lg:hidden animate-slide-down">
                <div className="container mx-auto px-4 py-4">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="What are you looking for?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-base"
                      autoFocus
                    />
                  </form>
                </div>
              </div>
            )}

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:inline-flex relative"
              aria-label="Wishlist"
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* Account */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:inline-flex"
              aria-label="Account"
            >
              <Link href="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative group"
              asChild
              aria-label={`Cart ${cartItemCount > 0 ? `with ${cartItemCount} items` : ''}`}
            >
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center animate-bounce-subtle">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}