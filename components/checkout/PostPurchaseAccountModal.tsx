"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface PostPurchaseAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  phone: string;
  orderId: string;
}

export default function PostPurchaseAccountModal({
  open,
  onOpenChange,
  email,
  phone,
  orderId,
}: PostPurchaseAccountModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);

    try {
      // Create account with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Link the guest order to the new account via server action
        const { linkGuestOrder } = await import("@/lib/actions/order");
        const linkResult = await linkGuestOrder(orderId, data.user.id);

        if (linkResult.success) {
          toast.success("Account created successfully! Your order is now linked to your account.");
        } else {
          toast.success("Account created successfully!");
          // Order linking can be done later if it fails
        }
        
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      // Error logging handled by auth action
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground font-bold text-xl">
            Create an Account to Track Your Order
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Create a free account to track your order status, view order history, 
            and enjoy faster checkout next time. Your email and phone are pre-filled.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="post-name" className="text-foreground font-medium">
              Full Name
            </Label>
            <Input
              id="post-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              disabled={isLoading}
              className="border-2 border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-email" className="text-foreground font-medium">
              Email
            </Label>
            <Input
              id="post-email"
              type="email"
              value={email}
              disabled
              className="border-2 border-border bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              This email will be used for your account
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-phone" className="text-foreground font-medium">
              Phone
            </Label>
            <Input
              id="post-phone"
              type="tel"
              value={phone}
              disabled
              className="border-2 border-border bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-password" className="text-foreground font-medium">
              Create Password
            </Label>
            <Input
              id="post-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="border-2 border-border focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">
              At least 6 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-confirm-password" className="text-foreground font-medium">
              Confirm Password
            </Label>
            <Input
              id="post-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="border-2 border-border focus:border-primary"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
              disabled={isLoading}
            >
              Skip for Now
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You can always create an account later from your order confirmation email
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
