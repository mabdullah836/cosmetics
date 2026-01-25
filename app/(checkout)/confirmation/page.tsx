import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import ConfirmationPageClient from "./ConfirmationPageClient";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ConfirmationPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

const ConfirmationPage = async ({ searchParams }: ConfirmationPageProps) => {
  const params = await searchParams;
  const session = await auth();
  
  if (!params.orderId) {
    notFound();
  }

  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.orderId)
    .single();

  if (error || !order) {
    notFound();
  }

  const orderNumber = order.order_number || order.id?.slice(0, 8).toUpperCase() || 'N/A';
  const total = typeof order.total === 'number' ? order.total : parseFloat(order.total || '0');
  const paymentMethod = order.payment_method || 'N/A';
  const isBankTransfer = paymentMethod === 'BANK_TRANSFER';
  const isGuest = !order.user_id;
  const guestEmail = order.guest_email || order.customer_email || '';
  const guestPhone = order.guest_phone || order.customer_phone || '';

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/cart">Cart</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/checkout">Checkout</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Order Confirmation</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Thank you! Your order has been placed.</h1>
        <p className="text-lg text-muted-foreground">
          {isBankTransfer 
            ? "Please transfer the payment using the bank details below. Use your order ID as the payment reference."
            : "You'll pay when the order is delivered."}
        </p>
      </div>

      <Card className="hover:shadow-md transition-shadow mb-6">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Number</span>
            <span className="font-medium">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold text-lg">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-medium">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}</span>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              You will receive an email confirmation shortly.
            </p>
          </div>
        </CardContent>
      </Card>

      {isBankTransfer && (
        <Card className="hover:shadow-md transition-shadow mb-6">
          <CardHeader>
            <CardTitle>Bank Transfer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank Name</span>
                <span className="font-medium">Example Bank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number</span>
                <span className="font-medium">1234567890</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IFSC Code</span>
                <span className="font-medium">EXAM0001234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Holder</span>
                <span className="font-medium">Your Company Name</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm font-semibold mb-2">Payment Reference</p>
              <p className="text-sm text-muted-foreground">
                Please use your order ID <strong>{orderNumber}</strong> as the payment reference when making the transfer.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please complete the transfer within 24 hours to avoid order cancellation.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="hover:shadow-md transition-shadow">
          <Link href="/">Continue Shopping</Link>
        </Button>
        {session ? (
          <Button asChild variant="outline" size="lg" className="hover:bg-accent transition-colors">
            <Link href="/account/orders">View Orders</Link>
          </Button>
        ) : null}
      </div>

      <ConfirmationPageClient
        isGuest={isGuest}
        email={guestEmail}
        phone={guestPhone}
        orderId={params.orderId}
      />
    </div>
  );
};

export default ConfirmationPage;
