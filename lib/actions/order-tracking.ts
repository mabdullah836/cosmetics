"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { verifyOrderAccessToken } from "@/lib/utils/tracking-token";

type TrackOrderParams = {
  orderId?: string;
  token?: string;
  contact?: string;
};

const ORDER_SELECT = `
  id,
  order_number,
  status,
  payment_method,
  payment_status,
  total,
  created_at,
  updated_at,
  customer_email,
  customer_phone,
  guest_email,
  guest_phone,
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
`;

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export async function getTrackableOrder({ orderId, token, contact }: TrackOrderParams) {
  if (!orderId) return null;

  const supabase = createServiceClient();
  const normalizedOrderLookup = orderId.trim().toLowerCase();
  const normalizedContact = (contact || "").trim().toLowerCase();
  const rawContact = (contact || "").trim();

  // First try exact DB id lookup (full UUID from email links).
  const { data: exactOrder } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", orderId.trim())
    .maybeSingle();

  let order = exactOrder;

  // Fallback: support short order identifiers (like first 8 chars shown in UI)
  // by searching recent orders for the provided contact and matching in memory.
  if (!order && rawContact) {
    const { data: candidateOrders } = await supabase
      .from("orders")
      .select(ORDER_SELECT)
      .or(
        `guest_email.eq.${normalizedContact},customer_email.eq.${normalizedContact},guest_phone.eq.${rawContact},customer_phone.eq.${rawContact}`
      )
      .order("created_at", { ascending: false })
      .limit(25);

    order =
      candidateOrders?.find((candidate) => {
        const candidateOrderNumber = String(candidate.order_number || "").toLowerCase();
        return (
          candidateOrderNumber === normalizedOrderLookup ||
          String(candidate.id || "").toLowerCase().startsWith(normalizedOrderLookup)
        );
      }) || null;
  }

  if (!order) return null;

  const email = order.guest_email || order.customer_email || "";
  const phone = order.guest_phone || order.customer_phone || "";
  const normalizedPhone = normalizePhone(phone);
  const normalizedInputPhone = normalizePhone(rawContact);
  const contactMatches =
    !!normalizedContact &&
    (normalizedContact === email.toLowerCase() ||
      normalizedContact === phone.toLowerCase() ||
      (!!normalizedInputPhone && normalizedInputPhone === normalizedPhone));
  const tokenMatches = token
    ? verifyOrderAccessToken(token, order.id, email, phone)
    : false;

  if (!contactMatches && !tokenMatches) return null;
  return order;
}
