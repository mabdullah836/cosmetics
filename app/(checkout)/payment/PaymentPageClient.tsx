"use client";

import { useState } from "react";
import PlaceOrderButton from "@/components/checkout/PlaceOrderButton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PaymentMethod = "COD" | "BANK_TRANSFER";

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PaymentPageClientProps {
  shippingAddress: Address;
  billingAddress: Address;
}

export default function PaymentPageClient({ 
  shippingAddress, 
  billingAddress 
}: PaymentPageClientProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Payment Method</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <RadioGroupItem value="COD" id="cod" className="mt-1" />
                      <div className="flex-1">
                        <span className="font-medium">Cash on Delivery (COD)</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pay when you receive your order
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <RadioGroupItem value="BANK_TRANSFER" id="bank" className="mt-1" />
                      <div className="flex-1">
                        <span className="font-medium">Bank Transfer</span>
                        {paymentMethod === "BANK_TRANSFER" && (
                          <div className="mt-4 p-4 bg-muted rounded-md space-y-2 text-sm">
                            <p className="font-semibold">Transfer to:</p>
                            <p>Bank Name: Example Bank</p>
                            <p>Account Number: 1234567890</p>
                            <p>IFSC Code: EXAM0001234</p>
                            <p className="mt-2 text-muted-foreground">
                              After payment, send a screenshot to our WhatsApp for order confirmation.
                            </p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-4 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <PlaceOrderButton 
                shippingAddress={shippingAddress} 
                billingAddress={billingAddress} 
                paymentMethod={paymentMethod} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
