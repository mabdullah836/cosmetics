import { formatPrice } from "@/lib/utils/format";

type OrderItem = {
  product_name: string;
  quantity: number;
  price: number;
};

type Address = {
  full_name?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

export function buildOrderConfirmationEmailHtml(params: {
  orderId: string;
  total: number;
  items: OrderItem[];
  shippingAddress?: Address | null;
  trackingUrl: string;
}) {
  const rows = params.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;">${item.product_name} x ${item.quantity}</td><td style="padding:8px 0;text-align:right;">${formatPrice(
          Number(item.price || 0) * item.quantity
        )}</td></tr>`
    )
    .join("");

  const address = params.shippingAddress
    ? [
        params.shippingAddress.full_name,
        params.shippingAddress.address_line_1,
        params.shippingAddress.address_line_2,
        `${params.shippingAddress.city || ""}, ${params.shippingAddress.state || ""} ${params.shippingAddress.postal_code || ""}`.trim(),
        params.shippingAddress.country,
      ]
        .filter(Boolean)
        .join("<br/>")
    : "N/A";

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#111827;">
      <h2 style="margin-bottom:8px;">Order Confirmed</h2>
      <p style="margin-top:0;">Your order has been confirmed and is now being prepared.</p>
      <p><strong>Order ID:</strong> ${params.orderId}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr>
            <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Item</th>
            <th style="text-align:right;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p><strong>Order Total:</strong> ${formatPrice(Number(params.total || 0))}</p>
      <p><strong>Shipping Address:</strong><br/>${address}</p>
      <p style="margin-top:20px;"><strong>Track your order:</strong></p>
      <p><a href="${params.trackingUrl}">${params.trackingUrl}</a></p>
      <p style="margin-top:20px;">You can track your order anytime using the link above.</p>
    </div>
  `;
}
