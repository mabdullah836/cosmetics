"use client";

import { useEffect, useState } from "react";
import PostPurchaseAccountModal from "@/components/checkout/PostPurchaseAccountModal";

interface ConfirmationPageClientProps {
  isGuest: boolean;
  email: string;
  phone: string;
  orderId: string;
}

export default function ConfirmationPageClient({
  isGuest,
  email,
  phone,
  orderId,
}: ConfirmationPageClientProps) {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Show modal after a short delay for better UX
    if (isGuest && email && !hasShown) {
      const timer = setTimeout(() => {
        setShowAccountModal(true);
        setHasShown(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isGuest, email, hasShown]);

  if (!isGuest || !email) {
    return null;
  }

  return (
    <PostPurchaseAccountModal
      open={showAccountModal}
      onOpenChange={setShowAccountModal}
      email={email}
      phone={phone}
      orderId={orderId}
    />
  );
}
