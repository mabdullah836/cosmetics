import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import ConfirmationPageClient from "./ConfirmationPageClient";
import { verifyOrderAccessToken } from "@/lib/utils/tracking-token";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatPrice } from "@/lib/utils/format";

interface ConfirmationPageProps {
  searchParams: Promise<{ orderId?: string; token?: string }>;
}

const ConfirmationPage = async ({ searchParams }: ConfirmationPageProps) => {
  const params = await searchParams;
  const session = await auth();
  
  if (!params.orderId) {
    notFound();
  }

  const supabase = createServiceClient();
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items (
        id,
        product_name,
        price,
        quantity
      ),
      shipping_address:addresses!orders_shipping_address_id_fkey (
        full_name,
        phone,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country
      )
    `)
    .eq('id', params.orderId)
    .single();

  if (error || !order) {
    notFound();
  }

  const orderEmail = order.guest_email || order.customer_email || "";
  const orderPhone = order.guest_phone || order.customer_phone || "";
  const hasValidToken = params.token
    ? verifyOrderAccessToken(params.token, params.orderId, orderEmail, orderPhone)
    : false;
  const isOwner = !!session?.user?.id && session.user.id === order.user_id;

  if (!isOwner && !hasValidToken) {
    notFound();
  }

  const itemCount = order.items?.reduce(
    (sum: number, item: { quantity?: number }) => sum + (item.quantity || 0),
    0
  ) || 0;
  const orderNumber = order.order_number || order.id?.slice(0, 8).toUpperCase() || 'N/A';
  const total = typeof order.total === 'number' ? order.total : parseFloat(order.total || '0');
  const paymentMethod = order.payment_method || 'N/A';
  const isBankTransfer = paymentMethod === 'BANK_TRANSFER';
  const guestEmail = orderEmail;
  const guestPhone = orderPhone;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+923001234567";
  const bankAccountTitle = process.env.NEXT_PUBLIC_BANK_ACCOUNT_TITLE || "Bloom Cosmetics";
  const bankAccountNumber = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "0000-0000000-0";
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME || "Meezan Bank";
  const bankIban = process.env.NEXT_PUBLIC_BANK_IBAN || "PK00MEEZ0000000000000000";
  const estimatedDeliveryText = process.env.NEXT_PUBLIC_ESTIMATED_DELIVERY || "2-4 business days";

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
        <h1 className="text-4xl font-bold mb-4">
          {isBankTransfer ? "Order received. Please complete your bank transfer." : "Thank you! Your COD order has been received."}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isBankTransfer 
            ? "Transfer the exact order amount using the bank details below."
            : "Our team is reviewing your order before dispatch."}
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
            <span className="text-muted-foreground">Items</span>
            <span className="font-medium">{itemCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold text-lg">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-medium">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}</span>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Tracking link will be shared in your confirmation email after admin approval.
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
                <span className="text-muted-foreground">Account Title</span>
                <span className="font-medium">{bankAccountTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number</span>
                <span className="font-medium">{bankAccountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank Name</span>
                <span className="font-medium">{bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IBAN</span>
                <span className="font-medium">{bankIban}</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm font-semibold mb-2">Instructions</p>
              <p className="text-sm text-muted-foreground">
                Transfer the exact amount and use order ID <strong>{orderNumber}</strong> as payment reference.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Send your receipt on WhatsApp for verification:{" "}
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`}
                  className="underline font-medium"
                  target="_blank"
                  rel="noreferrer"
                >
                  {whatsappNumber}
                </a>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Your order will be confirmed after payment verification. Once confirmed, you will receive an email with order details and tracking information.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isBankTransfer && (
        <Card className="hover:shadow-md transition-shadow mb-6">
          <CardHeader>
            <CardTitle>Cash on Delivery Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Our delivery partner will collect payment upon delivery. Please ensure the exact amount is available.
            </p>
            <p className="text-sm text-muted-foreground">
              Estimated delivery time: <span className="font-medium">{estimatedDeliveryText}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Your order is under review. Once confirmed, you will receive an email with order details and tracking information.
            </p>
          </CardContent>
        </Card>
      )}

      {!isBankTransfer && order.shipping_address && (
        <Card className="hover:shadow-md transition-shadow mb-6">
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{order.shipping_address.full_name}</p>
            <p className="text-sm text-muted-foreground">
              {order.shipping_address.address_line_1}
              {order.shipping_address.address_line_2 ? `, ${order.shipping_address.address_line_2}` : ""}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
            </p>
            <p className="text-sm text-muted-foreground">{order.shipping_address.country}</p>
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
        isGuest={!order.user_id}
        email={guestEmail}
        phone={guestPhone}
        orderId={params.orderId}
      />
    </div>
  );
};

export default ConfirmationPage;
