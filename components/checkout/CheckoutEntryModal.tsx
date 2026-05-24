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
import LoginForm from "@/components/auth/LoginForm";

interface CheckoutEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueAsGuest: () => void;
}

export default function CheckoutEntryModal({
  open,
  onOpenChange,
  onContinueAsGuest,
}: CheckoutEntryModalProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "register">("login");
  const router = useRouter();

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onOpenChange(false);
    router.refresh();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground font-bold text-xl">
              Continue to Checkout
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Choose how you'd like to proceed with your order
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-6">
            <Button
              onClick={() => {
                onContinueAsGuest();
                onOpenChange(false);
              }}
              className="w-full h-12 text-base"
              size="lg"
            >
              Continue as Guest
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              No account needed. You can create one later to track your order.
            </p>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              onClick={() => {
                onOpenChange(false);
                setAuthDefaultTab("login");
                setShowAuthModal(true);
              }}
              variant="outline"
              className="w-full h-12 text-base"
              size="lg"
            >
              Sign In
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Login to track your orders faster and save your addresses
            </p>

            <Button
              onClick={() => {
                onOpenChange(false);
                setAuthDefaultTab("register");
                setShowAuthModal(true);
              }}
              variant="outline"
              className="w-full h-12 text-base"
              size="lg"
            >
              Create Account
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              New here? Create an account to enjoy faster checkout next time
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <LoginForm
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={handleAuthSuccess}
        defaultTab={authDefaultTab}
      />
    </>
  );
}
