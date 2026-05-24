"use client";

import { useState } from "react";
import { useCartActions, type AddToCartProduct } from "@/lib/hooks/useCartActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AddToCartButtonProps = {
  productId: string;
  product?: AddToCartProduct;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
};

const AddToCartButton = ({
  productId,
  product,
  quantity = 1,
  className,
  children,
}: AddToCartButtonProps) => {
  const router = useRouter();
  const { addToCart, adding } = useCartActions();
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  const handleClick = async () => {
    setResult(null);
    const payload: AddToCartProduct = product ?? {
      id: productId,
      name: "Product",
      price: 0,
    };
    const res = await addToCart(payload, quantity);
    if (res?.success) {
      setResult({ success: true });
      router.refresh();
      toast.success("Added to cart");
      setTimeout(() => setResult(null), 3000);
    } else if ("error" in res && res.error) {
      setResult({ error: res.error });
      toast.error(res.error);
      setTimeout(() => setResult(null), 3000);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={adding}
        className="w-full bg-black text-white py-3 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {adding ? "Adding..." : children ?? "Add to Cart"}
      </button>
      {result?.error && <p className="text-red-500 mt-2">{result.error}</p>}
      {result?.success && <p className="text-green-500 mt-2">Added to cart</p>}
    </div>
  );
};

export default AddToCartButton;
