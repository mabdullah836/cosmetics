"use client";

import { useState } from "react";
import { addToCart } from "@/lib/actions/cart";

type AddToCartButtonProps = {
  productId: string;
};

const AddToCartButton = ({ productId }: AddToCartButtonProps) => {
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const res = await addToCart(productId, 1);
    setResult(res);
    setIsLoading(false);

    // Optional: clear message after a few seconds
    setTimeout(() => setResult(null), 3000);
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="w-full bg-black text-white py-3 rounded-md disabled:bg-gray-500"
      >
        {isLoading ? "Adding..." : "Add to Cart"}
      </button>
      {result?.error && <p className="text-red-500 mt-2">{result.error}</p>}
      {result?.success && <p className="text-green-500 mt-2">{result.success}</p>}
    </div>
  );
};

export default AddToCartButton;
