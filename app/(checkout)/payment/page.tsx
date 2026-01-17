import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PlaceOrderButton from "@/components/checkout/PlaceOrderButton";
import { Address, PaymentMethod } from "@prisma/client";

const PaymentPage = async () => {
  const cookieStore = await cookies();
  const shippingAddressString = cookieStore.get("shippingAddress")?.value;
  const billingAddressString = cookieStore.get("billingAddress")?.value;

  if (!shippingAddressString || !billingAddressString) {
    redirect("/checkout/address");
  }

  const shippingAddress: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = JSON.parse(shippingAddressString);
  const billingAddress: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = JSON.parse(billingAddressString);

  // For now, we'll hardcode the payment method. In a real app, this would be selected by the user.
  const paymentMethod: PaymentMethod = "COD";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payment Method</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Select a Payment Method</h2>
          <div className="space-y-4">
            <div className="border p-4 rounded-md">
              <label className="flex items-center">
                <input type="radio" name="paymentMethod" value="cod" className="mr-2" defaultChecked />
                <span>Cash on Delivery (COD)</span>
              </label>
            </div>
            <div className="border p-4 rounded-md">
              <label className="flex items-center">
                <input type="radio" name="paymentMethod" value="bank" className="mr-2" />
                <span>Bank Transfer</span>
              </label>
              <div className="mt-4 text-sm text-gray-600">
                <p>Please transfer the total amount to the following bank account:</p>
                <p className="font-semibold mt-2">Bank Name: Example Bank</p>
                <p className="font-semibold">Account Number: 1234567890</p>
                <p className="font-semibold">IFSC Code: EXAM0001234</p>
                <p className="mt-2">After payment, please send a screenshot of the transaction to our WhatsApp number for order confirmation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PlaceOrderButton 
        shippingAddress={shippingAddress} 
        billingAddress={billingAddress} 
        paymentMethod={paymentMethod} 
      />
    </div>
  );
};

export default PaymentPage;
