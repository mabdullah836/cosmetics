"use client";

import { useState } from "react";
import { createOrder } from "@/lib/actions/order";
import { Address, PaymentMethod } from "@/types/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type PlaceOrderButtonProps = {
  shippingAddress: Omit<Address, 'id'>;
  billingAddress: Omit<Address, 'id'>;
  paymentMethod: PaymentMethod;
};

const PlaceOrderButton = ({ shippingAddress, billingAddress, paymentMethod }: PlaceOrderButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    const res = await createOrder(shippingAddress, billingAddress, paymentMethod);
    setIsLoading(false);

    if (res.success) {
      router.push(`/checkout/confirmation?orderId=${res.orderId}`);
    } else {
      setResult(res);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleClick}
        disabled={isLoading}
        size="lg"
        className="w-full hover:shadow-md transition-shadow"
      >
        {isLoading ? "Placing Order..." : "Place Order"}
      </Button>
      {result?.error && (
        <p className="text-sm text-destructive text-center">{result.error}</p>
      )}
    </div>
  );
};

export default PlaceOrderButton;
