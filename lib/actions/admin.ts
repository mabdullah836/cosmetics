"use server";

import { createClient } from "@/lib/supabase/server";
import { auth } from "@/auth";
import { logger } from "@/lib/utils/logger";
import { Product } from "@/types/supabase";

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user) return false;
    
    const supabase = await createClient();
    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();
    
    return data?.role === "admin";
  } catch {
    return false;
  }
}

// Get admin dashboard stats
export async function getAdminStats() {
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
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    logger.error("Error updating order status:", error);
    return { error: "Failed to update order status" };
  }
}

// Update payment status
export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
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
