"use client";

import { useState, useEffect } from "react";
import { X, Truck, Gift, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

export default function ShippingBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const pathname = usePathname();

  // Banner messages that rotate
  const messages = [
    {
      icon: Truck,
      text: "Free shipping on orders over $50",
      highlight: "Free shipping",
      action: "Shop Now",
      code: null,
    },
    {
      icon: Gift,
      text: "Get 15% off your first order",
      highlight: "15% off",
      action: "Use Code",
      code: "BEAUTY15",
    },
    {
      icon: Tag,
      text: "New arrivals just dropped",
      highlight: "New arrivals",
      action: "Shop Now",
      code: null,
    },
    {
      icon: Clock,
      text: "Limited time: Free gift with $75+ orders",
      highlight: "Free gift",
      action: "Shop Now",
      code: null,
    },
  ];

  // Don't show banner on checkout or admin pages
  const shouldShowBanner = !pathname?.includes("/checkout") && 
                          !pathname?.includes("/admin") &&
                          !pathname?.includes("/cart");

  useEffect(() => {
    // Check localStorage for banner dismissal
    const dismissedUntil = localStorage.getItem("shippingBannerDismissed");
    
    if (dismissedUntil) {
      const dismissedTime = parseInt(dismissedUntil);
      const currentTime = Date.now();
      
      // Show banner again after 24 hours
      if (currentTime > dismissedTime) {
        localStorage.removeItem("shippingBannerDismissed");
        setIsVisible(true);
      }
    } else {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Rotate messages every 8 seconds
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const handleDismiss = (duration: number = 24 * 60 * 60 * 1000) => {
    setIsClosing(true);
    
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      
      if (duration > 0) {
        const dismissedUntil = Date.now() + duration;
        localStorage.setItem("shippingBannerDismissed", dismissedUntil.toString());
      }
    }, 300);
  };

  const handleCopyCode = () => {
    const code = messages[currentMessageIndex].code;
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success("Code copied!", {
        description: `Discount code "${code}" copied to clipboard`,
        duration: 3000,
      });
    }
  };

  const handleAction = () => {
    const message = messages[currentMessageIndex];
    
    if (message.code) {
      handleCopyCode();
    } else {
      // Navigate to products page
      window.location.href = "/products";
    }
  };

  if (!isVisible || !shouldShowBanner) return null;

  const currentMessage = messages[currentMessageIndex];
  const Icon = currentMessage.icon;

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground transition-all duration-300 ease-in-out",
        isClosing ? "-translate-y-full opacity-0 h-0" : "translate-y-0 opacity-100 h-auto",
        "overflow-hidden"
      )}
      role="banner"
      aria-label="Promotional banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3">
          {/* Left side: Message */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">
                <span className="font-bold">{currentMessage.highlight}</span>
                {" "}
                {currentMessage.text.replace(currentMessage.highlight, "")}
              </span>
            </div>
            
            {/* Code display */}
            {currentMessage.code && (
              <button
                onClick={handleCopyCode}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded text-xs font-medium hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={`Copy code ${currentMessage.code}`}
              >
                <Tag className="h-3 w-3" />
                {currentMessage.code}
              </button>
            )}
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-3">
            {/* Action Button */}
            <Button
              onClick={handleAction}
              variant="secondary"
              size="sm"
              className="rounded-full h-8 px-4 text-xs font-medium bg-white/20 hover:bg-white/30 border-white/30"
            >
              {currentMessage.action}
              {currentMessage.code && " →"}
            </Button>

            {/* Dismiss Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDismiss(0)} // Dismiss for session only
                className="text-xs opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:underline"
                aria-label="Dismiss for this session"
              >
                Dismiss
              </button>
              <button
                onClick={() => handleDismiss()}
                className="p-1 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar for message rotation */}
        <div className="h-0.5 bg-white/20 overflow-hidden">
          <div
            className="h-full bg-white/50 animate-progress"
            style={{
              animation: `progress 8s linear infinite`,
              animationDelay: "0.5s",
            }}
          />
        </div>
      </div>
    </div>
  );
}