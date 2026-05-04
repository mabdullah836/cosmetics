"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { auth } from "@/auth";
import { logger } from "@/lib/utils/logger";
import nodemailer from "nodemailer";
import { createOrderAccessToken } from "@/lib/utils/tracking-token";
import { buildOrderConfirmationEmailHtml } from "@/lib/email/order-confirmation-template";
import { revalidateAfterProductMutation } from "@/lib/cache/revalidate-catalog";

// Check if user is admin (uses Supabase Auth app_metadata.role, no public.users table)
// Reads from session JWT first; if role not in JWT, fetches user from DB via service role
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user) return false;
    // JWT may not include custom app_metadata.role; fetch from Supabase to be sure
    try {
      const service = createServiceClient();
      const { data: { user } } = await service.auth.admin.getUserById(session.user.id);
      const dbRole = (user?.app_metadata as { role?: string } | undefined)?.role;
      return dbRole === "admin";
    } catch {
      return false;
    }
  } catch {
    return false;
  }
}

// Get admin dashboard stats
export async function getAdminStats() {
  if (!(await isAdmin())) {
    return {
      totalProducts: 0,
      activeProducts: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      lowStockProducts: 0,
      recentOrders: 0,
    };
  }
  try {
    const supabase = await createClient();
    
    // Get total products
    const { count: totalProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    
    // Get active products
    const { count: activeProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);
    
    // Get total orders
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });
    
    // Get pending orders
    const { count: pendingOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .in("status", ["PENDING", "PENDING_CONFIRMATION"]);
    
    // Get total revenue (sum of all paid orders)
    const { data: revenueData } = await supabase
      .from("orders")
      .select("total")
      .eq("payment_status", "PAID");
    
    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    
    // Get low stock products
    const { count: lowStockProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("stock_level", "LOW_STOCK");
    
    // Get recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: recentOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString());
    
    return {
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      totalRevenue,
      lowStockProducts: lowStockProducts || 0,
      recentOrders: recentOrders || 0,
    };
  } catch (error) {
    logger.error("Error fetching admin stats:", error);
    return {
      totalProducts: 0,
      activeProducts: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      lowStockProducts: 0,
      recentOrders: 0,
    };
  }
}

// Get all products for admin
export async function getAllProducts() {
  if (!(await isAdmin())) return [];
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        images:product_images (
          id,
          image_url,
          is_primary
        ),
        categories (
          name,
          slug
        )
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("Error fetching products:", error);
    return [];
  }
}

// Get all orders for admin
export async function getAllOrders() {
  if (!(await isAdmin())) return [];
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("orders")
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
          city,
          state,
          postal_code,
          country
        )
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("Error fetching orders:", error);
    return [];
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string) {
  if (!(await isAdmin())) return { error: "Unauthorized" };
  try {
    const supabase = createServiceClient();

    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("id, status, total, payment_method, customer_email, customer_phone, guest_email, guest_phone, shipping_address_id")
      .eq("id", orderId)
      .maybeSingle();

    if (fetchError || !existingOrder) throw fetchError || new Error("Order not found");

    const updatePayload: { status: string; payment_status?: string } = { status };
    if (status === "CONFIRMED" && existingOrder.payment_method === "BANK_TRANSFER") {
      updatePayload.payment_status = "PAID";
    }

    const { error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", orderId);
    
    if (error) throw error;

    if (status === "CONFIRMED" && existingOrder.status !== "CONFIRMED") {
      const { data: items } = await supabase
        .from("order_items")
        .select("product_name, quantity, price")
        .eq("order_id", orderId);

      const { data: shippingAddress } = existingOrder.shipping_address_id
        ? await supabase
            .from("addresses")
            .select("full_name, address_line_1, address_line_2, city, state, postal_code, country")
            .eq("id", existingOrder.shipping_address_id)
            .maybeSingle()
        : { data: null };

      const recipientEmail = existingOrder.guest_email || existingOrder.customer_email;
      const recipientPhone = existingOrder.guest_phone || existingOrder.customer_phone;
      if (recipientEmail) {
        const token = createOrderAccessToken(orderId, recipientEmail, recipientPhone || "");
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const trackingUrl = `${siteUrl}/track-order?orderId=${orderId}&token=${encodeURIComponent(token)}`;

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth:
            process.env.SMTP_USER && process.env.SMTP_PASS
              ? {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
                }
              : undefined,
        });

        await transporter.sendMail({
          from: process.env.OTP_EMAIL_FROM || "Bloom <noreply@example.com>",
          to: recipientEmail,
          subject: `Order Confirmed - ${orderId.slice(0, 8).toUpperCase()}`,
          html: buildOrderConfirmationEmailHtml({
            orderId,
            total: Number(existingOrder.total || 0),
            items: items || [],
            shippingAddress,
            trackingUrl,
          }),
        });
      }
    }

    return { success: true };
  } catch (error) {
    logger.error("Error updating order status:", error);
    return { error: "Failed to update order status" };
  }
}

// Update payment status
export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  if (!(await isAdmin())) return { error: "Unauthorized" };
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: paymentStatus })
      .eq("id", orderId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    logger.error("Error updating payment status:", error);
    return { error: "Failed to update payment status" };
  }
}

// Get products with stock levels
export async function getProductsWithStock() {
  if (!(await isAdmin())) return [];
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        price,
        stock_level,
        is_active,
        images:product_images (
          id,
          image_url,
          is_primary
        )
      `)
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("Error fetching products with stock:", error);
    return [];
  }
}

// Get payments data
export async function getPaymentsData() {
  if (!(await isAdmin())) return [];
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        total,
        payment_method,
        payment_status,
        created_at,
        customer_email,
        items:order_items (
          product_name,
          quantity
        )
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("Error fetching payments data:", error);
    return [];
  }
}

function buildProductSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getAdminCategories() {
  if (!(await isAdmin())) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("Error fetching admin categories:", error);
    return [];
  }
}

type UpsertProductInput = {
  id?: string;
  name: string;
  price: number;
  /** Compare-at / list price; when greater than `price`, shows as discount */
  compareAtPrice?: number | null;
  categoryId?: string | null;
  brand?: string | null;
  description?: string | null;
  stockLevel: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "DISCONTINUED";
  isActive: boolean;
};

export async function upsertProduct(
  input: UpsertProductInput
): Promise<{ success?: true; productId?: string; error?: string }> {
  if (!(await isAdmin())) return { error: "Unauthorized" };
  try {
    const supabase = createServiceClient();

    const name = input.name.trim();
    if (!name) return { error: "Product name is required" };
    if (!Number.isFinite(input.price) || input.price < 0) {
      return { error: "Price must be a valid number" };
    }

    const salePrice = input.price;
    let original_price: number | null = null;
    let sale_price: number | null = null;
    if (
      input.compareAtPrice != null &&
      Number.isFinite(input.compareAtPrice) &&
      input.compareAtPrice > salePrice
    ) {
      original_price = input.compareAtPrice;
      sale_price = salePrice;
    }

    const basePayload = {
      name,
      slug: buildProductSlug(name),
      price: salePrice,
      original_price,
      sale_price,
      category_id: input.categoryId || null,
      brand: input.brand?.trim() || null,
      description: input.description?.trim() || null,
      stock_level: input.stockLevel,
      is_active: input.isActive,
    };

    let previousSlug: string | null = null;
    if (input.id) {
      const { data: prev } = await supabase
        .from("products")
        .select("slug")
        .eq("id", input.id)
        .maybeSingle();
      previousSlug = prev?.slug ?? null;
    }

    if (input.id) {
      const { error } = await supabase
        .from("products")
        .update(basePayload)
        .eq("id", input.id);
      if (error) throw error;
      revalidateAfterProductMutation({
        productId: input.id,
        previousSlug,
        slug: basePayload.slug,
      });
      return { success: true, productId: input.id };
    }

    const { data: created, error } = await supabase
      .from("products")
      .insert({
        ...basePayload,
        is_featured: false,
      })
      .select("id")
      .single();
    if (error) throw error;
    if (!created?.id) return { error: "Failed to create product" };
    revalidateAfterProductMutation({
      productId: created.id,
      slug: basePayload.slug,
    });
    return { success: true, productId: created.id };
  } catch (error) {
    logger.error("Error upserting product:", error);
    return { error: "Failed to save product" };
  }
}

export type ProductImageInput = { url: string; publicId?: string | null };

export async function replaceProductImages(
  productId: string,
  images: (string | ProductImageInput)[]
) {
  if (!(await isAdmin())) return { error: "Unauthorized" };
  try {
    const supabase = createServiceClient();
    const normalized: ProductImageInput[] = images
      .map((item) =>
        typeof item === "string"
          ? { url: item.trim(), publicId: null }
          : { url: item.url.trim(), publicId: item.publicId ?? null }
      )
      .filter((i) => i.url.length > 0);

    const unique = Array.from(
      new Map(normalized.map((i) => [i.url, i])).values()
    );

    const { error: delError } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productId);
    if (delError) throw delError;

    if (unique.length === 0) {
      const { data: row } = await supabase
        .from("products")
        .select("slug")
        .eq("id", productId)
        .maybeSingle();
      revalidateAfterProductMutation({
        productId,
        slug: row?.slug ?? null,
      });
      return { success: true };
    }

    const rows = unique.map((img, index) => ({
      product_id: productId,
      image_url: img.url,
      is_primary: index === 0,
      image_public_id: img.publicId ?? null,
    }));

    const { error } = await supabase.from("product_images").insert(rows);
    if (error) throw error;

    const { data: row } = await supabase
      .from("products")
      .select("slug")
      .eq("id", productId)
      .maybeSingle();
    revalidateAfterProductMutation({
      productId,
      slug: row?.slug ?? null,
    });
    return { success: true };
  } catch (error) {
    logger.error("Error replacing product images:", error);
    return { error: "Failed to save product images" };
  }
}

export async function updateProductStock(
  productId: string,
  stockLevel: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "DISCONTINUED"
) {
  if (!(await isAdmin())) return { error: "Unauthorized" };
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from("products")
      .update({ stock_level: stockLevel })
      .eq("id", productId);

    if (error) throw error;

    const { data: row } = await supabase
      .from("products")
      .select("slug")
      .eq("id", productId)
      .maybeSingle();
    revalidateAfterProductMutation({
      productId,
      slug: row?.slug ?? null,
    });
    return { success: true };
  } catch (error) {
    logger.error("Error updating product stock:", error);
    return { error: "Failed to update stock" };
  }
}
