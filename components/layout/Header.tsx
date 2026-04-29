"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";
import { toast } from "sonner";
import { CART_EVENTS } from "@/lib/utils/cartEvents";
import { getLocalCartItemCount } from "@/lib/utils/localCart";
import { CartItem } from "@/types/supabase";
import { NAV_CATEGORIES, SUPPORT_MENU_ITEMS } from "@/lib/constants/nav";
import LoginForm from "@/components/auth/LoginForm";

interface HeaderProps {
  cartItems?: CartItem[];
  subtotal?: number;
  isAuthenticated?: boolean;
}

export default function Header({ cartItems: serverCartItems = [], subtotal: serverSubtotal = 0, isAuthenticated = false }: HeaderProps = {}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openNavMenu, setOpenNavMenu] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navMenuCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems: contextCartItems } = useCart();
  const [localCartCount, setLocalCartCount] = useState(0);
  
  // Use server cart items if available, otherwise use context cart items
  const cartItems = serverCartItems.length > 0 ? serverCartItems : contextCartItems;
  
  // Event-driven guest cart count (no polling)
  useEffect(() => {
    const handleCartUpdate = () => {
      setLocalCartCount(getLocalCartItemCount());
    };
    handleCartUpdate();
    window.addEventListener(CART_EVENTS.UPDATED, handleCartUpdate);
    return () => window.removeEventListener(CART_EVENTS.UPDATED, handleCartUpdate);
  }, []);
  
  // Use Supabase cart count if available, otherwise use local cart count
  const cartItemCount = cartItems.length > 0 
    ? cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0)
    : localCartCount;

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

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push("/account");
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    router.push("/account");
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  const isCategoryActive = (categoryHref: string) => {
    if (pathname !== "/products") return false;
    const category = searchParams?.get("category");
    try {
      const url = new URL(categoryHref, "https://x");
      return url.searchParams.get("category") === category;
    } catch {
      return false;
    }
  };

  const handleNavMenuOpen = (menuId: string) => {
    if (navMenuCloseTimeoutRef.current) {
      clearTimeout(navMenuCloseTimeoutRef.current);
      navMenuCloseTimeoutRef.current = null;
    }
    setOpenNavMenu(menuId);
  };

  const handleNavMenuClose = () => {
    if (navMenuCloseTimeoutRef.current) {
      clearTimeout(navMenuCloseTimeoutRef.current);
    }
    navMenuCloseTimeoutRef.current = setTimeout(() => {
      setOpenNavMenu(null);
    }, 150);
  };

  const cancelNavMenuClose = () => {
    if (navMenuCloseTimeoutRef.current) {
      clearTimeout(navMenuCloseTimeoutRef.current);
      navMenuCloseTimeoutRef.current = null;
    }
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
      <div className="hidden lg:block border-b border-border/30 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-8 text-xs">
            <span className="text-muted-foreground">
              Free shipping on orders over $50 • 100% Vegan & Cruelty-Free
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="border border-border/50 hover:border-primary/50" aria-label="Open menu">
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
                  <div className="space-y-0">
                    {/* Categories (collapsible per category) */}
                    {NAV_CATEGORIES.map((category) => (
                      <div key={category.id} className="border-b border-border/30 last:border-0">
                        <details className="group">
                          <summary className="flex items-center justify-between py-3 text-base font-medium text-foreground cursor-pointer list-none">
                            {category.name}
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                          </summary>
                          <div className="pl-4 pb-3 pt-1 space-y-1 bg-muted/30 rounded-md mt-1 p-2 border border-border/50">
                            <Link
                              href={category.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={cn(
                                "block py-2 px-2 text-sm font-medium transition-colors rounded-md",
                                isCategoryActive(category.href)
                                  ? "text-primary bg-primary/10"
                                  : "text-foreground hover:text-primary hover:bg-primary/10"
                              )}
                            >
                              Shop all {category.name}
                            </Link>
                            {category.subCategories.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2 px-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </details>
                      </div>
                    ))}
                    {/* Support (collapsible) */}
                    <div className="border-b border-border/30 last:border-0">
                      <details className="group">
                        <summary className="flex items-center justify-between py-3 text-base font-medium text-foreground cursor-pointer list-none">
                          <span className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            Support
                          </span>
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="pl-4 pb-3 pt-1 space-y-1 bg-muted/30 rounded-md mt-1 p-2 border border-border/50">
                          {SUPPORT_MENU_ITEMS.map((item) => (
                            <Link
                              key={item.id}
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={cn(
                                "block py-2 px-2 text-sm transition-colors rounded-md",
                                isActive(item.href)
                                  ? "text-primary font-medium bg-primary/10"
                                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                              )}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </details>
                    </div>
                    <div className="border-b border-border/30 last:border-0">
                      <Link
                        href="/track-order"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 py-3 text-base font-medium transition-colors",
                          isActive("/track-order")
                            ? "text-primary"
                            : "text-foreground hover:text-primary"
                        )}
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                </nav>

                {/* Mobile Actions */}
                <div className="border-t border-border pt-4 space-y-4">
                  <div className="flex items-center justify-around">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="border border-border/50 hover:border-primary/50"
                      onClick={(e) => {
                        handleAccountClick(e);
                        setMobileMenuOpen(false);
                      }}
                      aria-label="Account"
                    >
                      <User className="h-5 w-5" />
                      <span className="sr-only">Account</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="border border-border/50 hover:border-primary/50" asChild>
                      <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                        <Heart className="h-5 w-5" />
                        <span className="sr-only">Wishlist</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="relative border border-border/50 hover:border-primary/50" asChild>
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

          {/* Desktop Navigation: hover to open (position under each trigger), no outline on items */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_CATEGORIES.map((category) => (
              <div
                key={category.id}
                onMouseEnter={() => handleNavMenuOpen(category.id)}
                onMouseLeave={handleNavMenuClose}
              >
                <DropdownMenu
                  open={openNavMenu === category.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      if (navMenuCloseTimeoutRef.current) {
                        clearTimeout(navMenuCloseTimeoutRef.current);
                      }
                      setOpenNavMenu(null);
                    }
                  }}
                  modal={false}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "gap-1 text-sm font-medium border-none",
                        isCategoryActive(category.href) && "text-primary bg-primary/10"
                      )}
                      aria-expanded={openNavMenu === category.id}
                      aria-haspopup="menu"
                      aria-label={`${category.name} menu`}
                      onPointerDown={(e) => e.preventDefault()}
                    >
                      {category.name}
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 shrink-0 transition-transform",
                          openNavMenu === category.id && "rotate-180"
                        )}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[280px] min-w-[280px] rounded-lg bg-white p-0 shadow-lg md:w-[320px] md:min-w-[320px]"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <div className="p-2">
                      <DropdownMenuItem asChild className="outline-none focus:outline-none focus:bg-accent">
                        <Link
                          href={category.href}
                          className={cn(
                            "block cursor-pointer rounded-md p-3 text-sm font-semibold outline-none focus:outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                            isCategoryActive(category.href) && "bg-primary/10 text-primary"
                          )}
                        >
                          Shop all {category.name}
                        </Link>
                      </DropdownMenuItem>
                      {category.subCategories.map((sub) => (
                        <DropdownMenuItem key={sub.name} asChild className="outline-none focus:outline-none focus:bg-accent">
                          <Link
                            href={sub.href}
                            className="block cursor-pointer rounded-md p-3 text-sm outline-none focus:outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            {sub.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            {/* Support dropdown (hover to open) */}
            <div
              onMouseEnter={() => handleNavMenuOpen("support")}
              onMouseLeave={handleNavMenuClose}
            >
              <DropdownMenu
                open={openNavMenu === "support"}
                onOpenChange={(open) => {
                  if (!open) {
                    if (navMenuCloseTimeoutRef.current) {
                      clearTimeout(navMenuCloseTimeoutRef.current);
                    }
                    setOpenNavMenu(null);
                  }
                }}
                modal={false}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "group gap-1 text-sm font-medium outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0",
                      SUPPORT_MENU_ITEMS.some((item) => isActive(item.href))
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-primary/5"
                    )}
                    aria-expanded={openNavMenu === "support"}
                    aria-haspopup="menu"
                    aria-label="Support menu"
                    onPointerDown={(e) => e.preventDefault()}
                  >
                    <HelpCircle className="h-4 w-4" />
                    Support
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 shrink-0 transition-transform",
                        openNavMenu === "support" && "rotate-180"
                      )}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 rounded-lg bg-white shadow-lg"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  {SUPPORT_MENU_ITEMS.map((item) => (
                    <DropdownMenuItem key={item.id} asChild className="outline-none focus:outline-none focus:bg-accent">
                      <Link
                        href={item.href}
                        className={cn(
                          "cursor-pointer outline-none focus:outline-none",
                          isActive(item.href) && "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              variant="ghost"
              asChild
              className={cn(
                "text-sm font-medium",
                isActive("/track-order") && "text-primary bg-primary/10"
              )}
            >
              <Link href="/track-order">Track Order</Link>
            </Button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-2 search-container">
            {/* Search */}
            <div className="relative hidden lg:block">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-56 xl:w-72 pl-9 border-border/50 focus:border-primary",
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
              className="lg:hidden border border-border/50 hover:border-primary/50"
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
              className="hidden md:inline-flex relative border border-border/50 hover:border-primary/50"
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
              onClick={handleAccountClick}
              className="hidden md:inline-flex border border-border/50 hover:border-primary/50"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative group border border-border/50 hover:border-primary/50"
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

      {/* Login Modal */}
      <LoginForm
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onSuccess={handleLoginSuccess}
        redirectTo="/account"
      />
    </header>
  );
}