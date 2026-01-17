"use client";

import { useState } from "react";
import { createOrder } from "@/lib/actions/order";
import { Address, PaymentMethod } from "@/types/supabase";
import { useRouter } from "next/navigation";

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
    <div className="mt-8 flex justify-end">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="bg-black text-white py-3 px-6 rounded-md disabled:bg-gray-500"
      >
        {isLoading ? "Placing Order..." : "Place Order"}
      </button>
      {result?.error && <p className="text-red-500 mt-2">{result.error}</p>}
    </div>
  );
};

export default PlaceOrderButton;
