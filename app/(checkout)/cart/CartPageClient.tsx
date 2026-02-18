"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CartItem } from "@/types/supabase";
import CheckoutEntryModal from "@/components/checkout/CheckoutEntryModal";

interface CartPageClientProps {
  initialCartItems?: CartItem[];
  initialSubtotal?: number;
  isAuthenticated?: boolean;
}

export default function CartPageClient({
  initialCartItems = [],
  initialSubtotal = 0,
  isAuthenticated = false,
}: CartPageClientProps) {
  const { cartItems: contextCartItems, subtotal: contextSubtotal, removeFromCart, updateQuantity } = useCart();
  const [serverCartItems, setServerCartItems] = useState<CartItem[]>(initialCartItems);
  const [serverSubtotal, setServerSubtotal] = useState<number>(initialSubtotal);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const router = useRouter();

  // Guest: use context (synced from localStorage). Auth: use server state.
  const cartItems = isAuthenticated ? serverCartItems : contextCartItems;
  const subtotal = isAuthenticated ? serverSubtotal : contextSubtotal;

  // Sync server cart when authenticated and props change
  useEffect(() => {
    if (isAuthenticated) {
      setServerCartItems(initialCartItems);
      setServerSubtotal(initialSubtotal);
    }
  }, [isAuthenticated, initialCartItems, initialSubtotal]);

  const handleRemoveFromCart = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
    if (isAuthenticated) {
      const item = cartItems.find((i) => i.id === cartItemId);
      setServerCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      setServerSubtotal((prev) =>
        item ? prev - (item.product?.price ?? 0) * item.quantity : prev
      );
    }
    toast.success("Item removed from cart");
  };

  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    await updateQuantity(cartItemId, quantity);
    if (isAuthenticated) {
      setServerCartItems((prev) => {
        const updated = prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        const newSubtotal = updated.reduce(
          (acc, item) => acc + (item.product?.price ?? 0) * item.quantity,
          0
        );
        setServerSubtotal(newSubtotal);
        return updated;
      });
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!isAuthenticated) {
      setShowCheckoutModal(true);
    } else {
      router.push("/checkout");
    }
  };

  const handleContinueAsGuest = () => {
    router.push("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Start shopping to add items to your cart
          </p>
          <Button asChild size="lg" className="hover:shadow-md transition-shadow">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Link
                    href={`/product/${item.product?.slug || item.product?.id || ""}`}
                    className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border"
                  >
                    <Image
                      src={
                        item.product?.images?.[0]?.image_url ??
                        (item.product as { imageUrl?: string })?.imageUrl ??
                        "/placeholder-product.jpg"
                      }
                      alt={item.product?.name ?? "Product"}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.product?.slug || item.product?.id || ""}`}
                      className="block"
                    >
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors mb-2">
                        {item.product?.name ?? "Product"}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground mb-4">
                      ${(item.product?.price ?? 0).toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-bold text-lg">
                          $
                          {(
                            (item.product?.price ?? 0) * item.quantity
                          ).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full h-12 text-base hover:shadow-md transition-shadow"
                size="lg"
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                asChild
                className="w-full hover:bg-accent transition-colors"
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <CheckoutEntryModal
        open={showCheckoutModal}
        onOpenChange={setShowCheckoutModal}
        onContinueAsGuest={handleContinueAsGuest}
      />
    </div>
  );
}
