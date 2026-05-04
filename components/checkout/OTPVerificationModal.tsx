"use client";

import { useState, useEffect } from "react";
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
import { sendOTP, verifyOTP } from "@/lib/actions/otp";
import { toast } from "sonner";

interface OTPVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerified: () => void;
}

export default function OTPVerificationModal({
  open,
  onOpenChange,
  email,
  onVerified,
}: OTPVerificationModalProps) {
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (open && email) {
      handleSendOTP();
    }
  }, [open, email]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    setIsSending(true);
    const result = await sendOTP(email);
    setIsSending(false);

    if (result.success) {
      setOtpSent(true);
      setCountdown(60); // 60 second cooldown
      toast.success("OTP sent to your email address");
    } else {
      toast.error(result.error || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    const result = await verifyOTP(email, otp);
    setIsVerifying(false);

    if (result.success) {
      toast.success("Email verified successfully");
      onVerified();
      onOpenChange(false);
    } else {
      toast.error(result.error || "Invalid OTP. Please try again.");
      setOtp("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground font-bold text-xl">
            Verify Your Email Address
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            We need to verify your email address for Cash on Delivery orders. 
            An OTP has been sent to <strong>{email}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-foreground font-medium">
              Enter OTP
            </Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
              }}
              placeholder="000000"
              maxLength={6}
              required
              disabled={isVerifying || !otpSent}
              className="border-2 border-border focus:border-primary text-center text-2xl tracking-widest"
            />
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isVerifying || !otpSent || otp.length !== 6}
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>

          {otpSent && (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="link"
                onClick={handleSendOTP}
                disabled={isSending || countdown > 0}
                className="text-primary hover:text-primary/80"
              >
                {isSending
                  ? "Sending..."
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend OTP"}
              </Button>
            </div>
          )}

          {!otpSent && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSendOTP}
              disabled={isSending}
              className="w-full"
            >
              {isSending ? "Sending OTP..." : "Send OTP"}
            </Button>
          )}
        </form>

        <p className="text-xs text-center text-muted-foreground mt-4">
          By verifying, you confirm that this email address belongs to you and 
          you'll receive order updates at this address.
        </p>
      </DialogContent>
    </Dialog>
  );
}
