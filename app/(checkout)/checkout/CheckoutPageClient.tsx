"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { createOrder } from "@/lib/actions/order";
import { Address, PaymentMethod } from "@/types/supabase";
import { toast } from "sonner";
import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";
import OTPVerificationModal from "@/components/checkout/OTPVerificationModal";
import { getLocalCart } from "@/lib/utils/localCart";
import { LocalCartItem } from "@/lib/utils/localCart";

interface CheckoutPageClientProps {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  userEmail: string;
  isAuthenticated: boolean;
}

export default function CheckoutPageClient({
  cartItems,
  subtotal,
  shipping,
  discount,
  total,
  userEmail,
  isAuthenticated,
}: CheckoutPageClientProps) {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);
  const [localSubtotal, setLocalSubtotal] = useState(0);

  // Load local cart for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      const loadLocalCart = async () => {
        const { getLocalCart } = await import("@/lib/utils/localCart");
        const localCart = getLocalCart();
        
        // Convert local cart to CartItem format
        const convertedItems: CartItem[] = localCart.map((item, index) => ({
          id: `local-${index}`,
          quantity: item.quantity,
          product: item.product,
          product_id: item.productId,
          cart_id: "local",
        }));
        
        setLocalCartItems(convertedItems);
        const localSubtotal = convertedItems.reduce(
          (acc, item) => acc + (item.product?.price || 0) * item.quantity,
          0
        );
        setLocalSubtotal(localSubtotal);
      };
      
      loadLocalCart();
    }
  }, [isAuthenticated]);

  // Use local cart for guests, Supabase cart for authenticated users
  const displayCartItems = isAuthenticated ? cartItems : localCartItems;
  const displaySubtotal = isAuthenticated ? subtotal : localSubtotal;
  const displayTotal = displaySubtotal + shipping - discount;

  // Form state
  const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Shipping address
  const [shippingFullName, setShippingFullName] = useState("");
  const [shippingAddressLine1, setShippingAddressLine1] = useState("");
  const [shippingAddressLine2, setShippingAddressLine2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");

  // Billing address
  const [billingFullName, setBillingFullName] = useState("");
  const [billingAddressLine1, setBillingAddressLine1] = useState("");
  const [billingAddressLine2, setBillingAddressLine2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  const isFormValid = () => {
    if (!email || !phone) return false;
    if (
      !shippingFullName ||
      !shippingAddressLine1 ||
      !shippingCity ||
      !shippingState ||
      !shippingPostalCode
    )
      return false;
    if (!sameAsShipping) {
      if (
        !billingFullName ||
        !billingAddressLine1 ||
        !billingCity ||
        !billingState ||
        !billingPostalCode
      )
        return false;
    }
    return true;
  };

  const processOrder = async (skipOTPCheck = false) => {
    if (!isFormValid()) {
      toast.error("Please complete all required fields");
      return;
    }

    // Check for COD OTP verification
    if (paymentMethod === "COD" && !skipOTPCheck && !isOTPVerified) {
      // Validate email first
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        toast.error("Please enter a valid email address for COD orders");
        return;
      }
      setShowOTPModal(true);
      return;
    }

    // Ensure we have cart items
    const itemsToUse = isAuthenticated ? cartItems : localCartItems;
    if (itemsToUse.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    setIsSubmitting(true);

    const shippingAddress: Omit<Address, "id"> = {
      type: "SHIPPING",
      full_name: shippingFullName,
      phone: phone,
      address_line_1: shippingAddressLine1,
      address_line_2: shippingAddressLine2 || undefined,
      city: shippingCity,
      state: shippingState,
      postal_code: shippingPostalCode,
      country: "India",
      is_default: false,
    };

    const billingAddress: Omit<Address, "id"> = sameAsShipping
      ? {
          ...shippingAddress,
          type: "BILLING",
        }
      : {
          type: "BILLING",
          full_name: billingFullName,
          phone: phone,
          address_line_1: billingAddressLine1,
          address_line_2: billingAddressLine2 || undefined,
          city: billingCity,
          state: billingState,
          postal_code: billingPostalCode,
          country: "India",
          is_default: false,
        };

    // Convert local cart items for guest users
    let guestCartItems: LocalCartItem[] | undefined = undefined;
    if (!isAuthenticated) {
      const localCart = getLocalCart();
      guestCartItems = localCart;
    }

    const result = await createOrder(
      shippingAddress,
      billingAddress,
      paymentMethod,
      email,
      guestCartItems,
      isOTPVerified || skipOTPCheck
    );

    setIsSubmitting(false);

    if (result.success && result.orderId) {
      // Clear local cart for guests
      if (!isAuthenticated) {
        const { clearLocalCart } = await import("@/lib/utils/localCart");
        clearLocalCart();
      }
      router.push(`/checkout/confirmation?orderId=${result.orderId}`);
    } else {
      toast.error(result.error || "Failed to place order. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processOrder();
  };

  const handleOTPVerified = () => {
    setIsOTPVerified(true);
    // Process order after OTP verification
    processOrder(true);
  };

  const handleLoginSuccess = () => {
    // After successful login, cart is migrated and user is authenticated
    // Refresh to get updated cart from Supabase
    router.refresh();
    // Process order will be called after refresh
    setTimeout(() => {
      processOrder();
    }, 500);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Complete your order by providing delivery and payment details.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Section 1: Customer Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email address <span className="text-destructive">*</span>
                      {paymentMethod === "COD" && (
                        <span className="text-xs text-yellow-600 ml-2">
                          (Required for COD verification)
                        </span>
                      )}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        // Reset OTP verification if email changes
                        if (isOTPVerified) {
                          setIsOTPVerified(false);
                        }
                      }}
                      required
                      placeholder="your@email.com"
                    />
                    <p className="text-sm text-muted-foreground">
                      {paymentMethod === "COD"
                        ? "We'll send an OTP to verify your email for COD orders"
                        : "Used for order updates and confirmation"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 1234567890"
                    />
                    <p className="text-sm text-muted-foreground">
                      Courier may contact you for delivery
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingFullName">
                      Full name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shippingFullName"
                      value={shippingFullName}
                      onChange={(e) => setShippingFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingAddressLine1">
                      Address line 1 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shippingAddressLine1"
                      value={shippingAddressLine1}
                      onChange={(e) => setShippingAddressLine1(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingAddressLine2">
                      Address line 2 (optional)
                    </Label>
                    <Input
                      id="shippingAddressLine2"
                      value={shippingAddressLine2}
                      onChange={(e) => setShippingAddressLine2(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingCity">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="shippingCity"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingState">
                        State / Province <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="shippingState"
                        value={shippingState}
                        onChange={(e) => setShippingState(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingPostalCode">
                      Postal / ZIP code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="shippingPostalCode"
                      value={shippingPostalCode}
                      onChange={(e) => setShippingPostalCode(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Section 3: Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsShipping"
                      checked={sameAsShipping}
                      onCheckedChange={(checked) =>
                        setSameAsShipping(checked === true)
                      }
                    />
                    <Label
                      htmlFor="sameAsShipping"
                      className="font-normal cursor-pointer"
                    >
                      Billing address same as shipping address
                    </Label>
                  </div>

                  {!sameAsShipping && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Billing address is used for payment verification and invoice
                        purposes.
                      </p>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingFullName">
                            Full name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="billingFullName"
                            value={billingFullName}
                            onChange={(e) => setBillingFullName(e.target.value)}
                            required={!sameAsShipping}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingAddressLine1">
                            Address line 1{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="billingAddressLine1"
                            value={billingAddressLine1}
                            onChange={(e) =>
                              setBillingAddressLine1(e.target.value)
                            }
                            required={!sameAsShipping}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingAddressLine2">
                            Address line 2 (optional)
                          </Label>
                          <Input
                            id="billingAddressLine2"
                            value={billingAddressLine2}
                            onChange={(e) =>
                              setBillingAddressLine2(e.target.value)
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="billingCity">
                              City <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="billingCity"
                              value={billingCity}
                              onChange={(e) => setBillingCity(e.target.value)}
                              required={!sameAsShipping}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billingState">
                              State / Province{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="billingState"
                              value={billingState}
                              onChange={(e) => setBillingState(e.target.value)}
                              required={!sameAsShipping}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingPostalCode">
                            Postal / ZIP code{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="billingPostalCode"
                            value={billingPostalCode}
                            onChange={(e) =>
                              setBillingPostalCode(e.target.value)
                            }
                            required={!sameAsShipping}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Section 4: Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setPaymentMethod(value as PaymentMethod)
                    }
                    className="space-y-4"
                  >
                    <div className="border rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <RadioGroupItem value="COD" id="cod" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              Cash on Delivery (COD)
                            </span>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Email verification required
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pay when your order is delivered. Email verification required.
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="border rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <RadioGroupItem
                          value="BANK_TRANSFER"
                          id="bank"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Bank Transfer</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Recommended
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Transfer payment using the bank details after placing
                            your order. Faster processing, no verification needed.
                          </p>
                          {paymentMethod === "BANK_TRANSFER" && (
                            <div className="mt-4 p-4 bg-muted rounded-md space-y-2 text-sm">
                              <p className="text-muted-foreground">
                                After confirming your order, bank details will be
                                displayed. Please complete the transfer within 24
                                hours.
                              </p>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary - Sticky */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {displayCartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden border flex-shrink-0">
                          <Image
                            src={
                              item.product?.images?.[0]?.image_url ||
                              "/placeholder-product.jpg"
                            }
                            alt={item.product?.name || 'Product'}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">
                            {item.product?.name || 'Product'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold mt-1">
                            ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items total</span>
                      <span>${displaySubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Delivery charges
                      </span>
                      <span className={shipping === 0 ? "text-green-600" : ""}>
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total amount</span>
                      <span>${displayTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Delivery charges are calculated automatically.
                  </p>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={!isFormValid() || isSubmitting}
                  >
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                  </Button>

                  {!isFormValid() && (
                    <p className="text-xs text-destructive text-center">
                      Please complete all required fields.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      {/* Auth Modal */}
      <LoginForm
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onSuccess={handleLoginSuccess}
        defaultTab="login"
      />

      {/* OTP Verification Modal for COD */}
      <OTPVerificationModal
        open={showOTPModal}
        onOpenChange={setShowOTPModal}
        email={email}
        onVerified={handleOTPVerified}
      />
    </>
  );
}
