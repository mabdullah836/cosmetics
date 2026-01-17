"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/types/supabase";

interface CartSheetProps {
  cartItems: CartItem[];
  subtotal: number;
}

const CartSheet = ({ cartItems, subtotal }: CartSheetProps) => {

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <ShoppingCart className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">Your cart is empty</h3>
              <p className="text-muted-foreground mt-2">Add items to your cart to see them here.</p>
              <Button asChild className="mt-6">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center border-b py-4">
                    <div className="relative w-24 h-24 mr-4">
                      <Image 
                        src={item.product.images[0]?.url || '/placeholder.svg'}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <Link href={`/product/${item.product.slug}`} className="font-semibold hover:underline">{item.product.name}</Link>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t p-6">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Button asChild className="w-full">
                  <Link href="/checkout/address">Proceed to Checkout</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
