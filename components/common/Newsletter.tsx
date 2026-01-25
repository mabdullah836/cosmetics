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
      className="py-20 md:py-24 bg-background"
      aria-labelledby="newsletter-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          {/* Success State */}
          {isSubmitted ? (
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 mx-auto">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                Thank you
              </h2>
              <p className="text-muted-foreground mb-6">
                Check your email for confirmation.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                size="sm"
              >
                Subscribe Another Email
              </Button>
            </div>
          ) : (
            <>
              <h2 
                id="newsletter-heading"
                className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3"
              >
                Stay Updated
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Get notified about new products and offers.
              </p>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
                noValidate
              >
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-11"
                  required
                  aria-label="Email address"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="default"
                  className="h-11 px-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}