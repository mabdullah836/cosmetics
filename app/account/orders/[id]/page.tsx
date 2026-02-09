import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Truck, CreditCard, MapPin } from "lucide-react";
import { getOrderStatusColor } from "@/lib/constants/status";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login?redirect=/account/orders");
  }

  const { id } = await params;
  const supabase = await createClient();
  const userId = session.user.id;

  // Fetch order details
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        id,
        product_name,
        price,
        quantity,
        product:products(
          id,
          slug,
          images:product_images(image_url, is_primary)
        )
      ),
      shipping_address:addresses!orders_shipping_address_id_fkey(*),
      billing_address:addresses!orders_billing_address_id_fkey(*)
    `)
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !order) {
    notFound();
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/account" className="text-gray-600 hover:text-gray-900">
                  Account
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/account/orders" className="text-gray-600 hover:text-gray-900">
                  Orders
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/account/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge className={getOrderStatusColor(order.status)}>
                  {order.status}
                </Badge>
                <Badge variant="outline">
                  Payment: {order.payment_status}
                </Badge>
                <Badge variant="outline">
                  Method: {order.payment_method}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any) => {
                  const primaryImage = item.product?.images?.find((img: any) => img.is_primary) 
                    || item.product?.images?.[0];
                  
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      {primaryImage && (
                        <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                          <img
                            src={primaryImage?.image_url || '/placeholder.svg'}
                            alt={item?.product_name || 'Product'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <Link
                          href={`/product/${item.product?.slug || item.product?.id}`}
                          className="font-semibold text-gray-900 hover:text-primary text-lg"
                        >
                          {item.product_name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Billing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {order.shipping_address && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-gray-700">
                    <p className="font-semibold">{order.shipping_address.full_name}</p>
                    <p>{order.shipping_address.address_line_1}</p>
                    {order.shipping_address.address_line_2 && (
                      <p>{order.shipping_address.address_line_2}</p>
                    )}
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state}{" "}
                      {order.shipping_address.postal_code}
                    </p>
                    <p>{order.shipping_address.country}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Phone: {order.shipping_address.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {order.billing_address && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-gray-700">
                    <p className="font-semibold">{order.billing_address.full_name}</p>
                    <p>{order.billing_address.address_line_1}</p>
                    {order.billing_address.address_line_2 && (
                      <p>{order.billing_address.address_line_2}</p>
                    )}
                    <p>
                      {order.billing_address.city}, {order.billing_address.state}{" "}
                      {order.billing_address.postal_code}
                    </p>
                    <p>{order.billing_address.country}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Phone: {order.billing_address.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                </div>
                {order.shipping > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${order.shipping.toFixed(2)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t text-lg font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
