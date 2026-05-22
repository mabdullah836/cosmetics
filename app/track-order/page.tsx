import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getTrackableOrder } from "@/lib/actions/order-tracking";
import { formatPrice } from "@/lib/utils/format";

interface TrackOrderPageProps {
  searchParams: Promise<{
    orderId?: string;
    token?: string;
    contact?: string;
  }>;
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    PENDING: "Pending",
    PENDING_CONFIRMATION: "Pending Confirmation",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };
  return map[status] || status;
}

function getPaymentStatusLabel(paymentMethod: string, paymentStatus: string) {
  if (paymentMethod === "BANK_TRANSFER" && paymentStatus === "PENDING") {
    return "Awaiting Payment Verification";
  }
  if (paymentMethod === "COD" && paymentStatus === "PENDING") {
    return "Pay on Delivery";
  }
  return paymentStatus;
}

function formatTimelineTime(value?: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStep(status: string) {
  const normalized = (status || "").toUpperCase();
  if (normalized === "CANCELLED") return -1;
  if (normalized === "DELIVERED") return 4;
  if (normalized === "SHIPPED") return 3;
  if (normalized === "CONFIRMED" || normalized === "PROCESSING") return 2;
  if (normalized === "PENDING_CONFIRMATION") return 1;
  return 1;
}

export default async function TrackOrderPage({ searchParams }: TrackOrderPageProps) {
  const params = await searchParams;
  const order = await getTrackableOrder({
    orderId: params.orderId,
    token: params.token,
    contact: params.contact,
  });
  const currentStep = order ? getStatusStep(order.status) : 0;
  const timelineSteps = [
    { key: "pending", label: "Pending", description: "Order created and awaiting review", step: 1 },
    { key: "confirmed", label: "Confirmed", description: "Order reviewed and confirmed", step: 2 },
    { key: "shipped", label: "Shipped", description: "Order dispatched from warehouse", step: 3 },
    { key: "delivered", label: "Delivered", description: "Order delivered to customer", step: 4 },
  ] as const;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-3" method="get" action="/track-order">
            <Input name="orderId" placeholder="Order ID" defaultValue={params.orderId || ""} required />
            <Input
              name="contact"
              placeholder="Email or phone"
              defaultValue={params.contact || ""}
              required={!params.token}
            />
            <Button type="submit">Track Order</Button>
          </form>
        </CardContent>
      </Card>

      {params.orderId && !order && (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            We could not verify this order. Please check your Order ID and contact info, or open the tracking link from your email.
          </CardContent>
        </Card>
      )}

      {order && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order #{order.id.slice(0, 8).toUpperCase()}</span>
              <Badge>{getStatusLabel(order.status)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Payment Method</p>
                <p className="font-medium">{order.payment_method === "COD" ? "Cash on Delivery" : "Bank Transfer"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Status</p>
                <p className="font-medium">
                  {getPaymentStatusLabel(order.payment_method, order.payment_status)}
                </p>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm font-medium mb-3">Order Timeline</p>
              <div className="space-y-3">
                {timelineSteps.map((step) => {
                  const isCompleted = currentStep >= step.step;
                  const isCurrent = currentStep === step.step;
                  const timeLabel = isCompleted
                    ? formatTimelineTime(
                        step.step === 1 ? order.created_at : isCurrent ? order.updated_at : null
                      )
                    : null;

                  return (
                    <div key={step.key} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 h-3 w-3 rounded-full ${
                          isCompleted ? "bg-green-600" : "bg-gray-300"
                        }`}
                      />
                      <div>
                        <p className={`text-sm font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                        {timeLabel ? (
                          <p className="text-xs text-muted-foreground mt-1">{timeLabel}</p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
                {order.status === "CANCELLED" && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-3 w-3 rounded-full bg-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-700">Cancelled</p>
                      <p className="text-xs text-muted-foreground">
                        This order was cancelled.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimelineTime(order.updated_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Items</p>
              <div className="space-y-2 mt-2">
                {order.items?.map((item: { id: string; product_name: string; quantity: number; price: number }) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product_name} x {item.quantity}</span>
                    <span>{formatPrice(Number(item.price || 0) * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">{formatPrice(Number(order.total || 0))}</span>
            </div>
            {(() => {
              const ship = Array.isArray(order.shipping_address)
                ? order.shipping_address[0]
                : order.shipping_address;
              if (!ship) return null;
              return (
              <div className="border-t pt-4 text-sm">
                <p className="text-muted-foreground mb-1">Shipping Address</p>
                <p className="font-medium">{ship.full_name}</p>
                <p>{ship.address_line_1}{ship.address_line_2 ? `, ${ship.address_line_2}` : ""}</p>
                <p>{ship.city}, {ship.state} {ship.postal_code}</p>
                <p>{ship.country}</p>
              </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
