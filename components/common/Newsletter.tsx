"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles, Loader2, Gift } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    try {
      // Call server action
      const formData = new FormData();
      formData.append("email", email);
      const result = await subscribeToNewsletter(formData);

      if (result.success) {
        setIsSubmitted(true);
        toast.success("Welcome to our Beauty Circle! 💕", {
          description: (
            <div className="mt-2 space-y-2">
              <p className="font-medium">Your 15% discount code:</p>
              <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                <Gift className="h-4 w-4 text-primary" />
                <code className="text-lg font-bold text-primary tracking-wider">
                  BEAUTY15
                </code>
              </div>
              <p className="text-sm">Check your email for confirmation.</p>
            </div>
          ),
          duration: 8000,
          action: {
            label: "Copy Code",
            onClick: () => {
              navigator.clipboard.writeText("BEAUTY15");
              toast.success("Code copied to clipboard!");
            },
          },
        });
        setEmail("");
        
        // Reset success state after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        toast.error("Subscription failed", {
          description: result.error || "Please try again later",
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Unable to subscribe. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
      aria-labelledby="newsletter-heading"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 dark:from-pink-950/20 dark:via-rose-950/20 dark:to-orange-950/20" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success State */}
          {isSubmitted ? (
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6 mx-auto">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Welcome to the Family! 🎉
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Your discount code has been sent to <strong>{email}</strong>. 
                Check your inbox for exclusive content and offers!
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="rounded-full"
              >
                Subscribe Another Email
              </Button>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-8 w-8" />
                </div>
              </div>

              {/* Heading */}
              <h2 
                id="newsletter-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
              >
                Join Our Beauty Circle
              </h2>
              
              {/* Description */}
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Subscribe for exclusive offers, beauty tips, and be the first to know
                about new arrivals. Get{" "}
                <span className="font-bold text-primary">15% off</span> your first
                order!
              </p>

              {/* Stats */}
              <div className="flex justify-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">50K+</div>
                  <div className="text-sm text-muted-foreground">Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">Exclusive</div>
                  <div className="text-sm text-muted-foreground">Offers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">First Access</div>
                  <div className="text-sm text-muted-foreground">New Products</div>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
                noValidate
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "h-14 pl-12 pr-4 text-base rounded-full",
                      "border-border/50 bg-background/90 backdrop-blur-sm",
                      "focus:ring-2 focus:ring-[hsl(var(--primary)/0.5)] focus:border-transparent",
                      "placeholder:text-muted-foreground/70"
                    )}
                    required
                    aria-label="Email address for newsletter subscription"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className={cn(
                    "h-14 px-8 rounded-full min-w-[140px]",
                    "bg-gradient-to-r from-primary to-primary/90",
                    "hover:from-primary/90 hover:to-primary",
                    "shadow-lg hover:shadow-xl",
                    "transition-all duration-300"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Subscribe
                    </>
                  )}
                </Button>
              </form>

              {/* Privacy Note */}
              <p className="text-sm text-muted-foreground mt-6 max-w-md mx-auto">
                By subscribing, you agree to our{" "}
                <button 
                  className="text-primary hover:underline focus:outline-none focus:underline"
                  onClick={() => toast.info("Privacy policy page coming soon")}
                >
                  Privacy Policy
                </button>
                . We respect your inbox—unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}