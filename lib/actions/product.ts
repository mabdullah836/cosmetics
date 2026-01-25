"use server";

import { createClient } from "@/lib/supabase/server";
import { Product, Category } from "@/types/supabase";
import { logger } from "@/lib/utils/logger";
import { MESSAGES } from "@/lib/constants/messages";

export async function getFeaturedCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("categories")
      .select(`
        *,
        products:products(count)
      `)
      .eq("is_active", true)
      .eq("is_featured", true)
      .limit(8)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error(MESSAGES.PRODUCT.FETCH_CATEGORIES_ERROR, error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
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
      .eq("is_featured", true)
      .eq("is_active", true)
      .limit(8)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error(MESSAGES.PRODUCT.FETCH_PRODUCTS_ERROR, error);
    return [];
  }
}

export async function getTrendingProducts(): Promise<Product[]> {
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
      .eq("is_active", true)
      .eq("is_trending", true)
      .order("total_sold", { ascending: false })
      .limit(12);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error(MESSAGES.PRODUCT.FETCH_TRENDING_ERROR, error);
    return [];
  }
}

export async function getNewArrivals(): Promise<Product[]> {
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
      .eq("is_active", true)
      .eq("is_new_arrival", true)
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error(MESSAGES.PRODUCT.FETCH_NEW_ARRIVALS_ERROR, error);
    return [];
  }
}

export async function getBestSellers(): Promise<Product[]> {
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
      .eq("is_active", true)
      .eq("is_best_seller", true)
      .order("total_sold", { ascending: false })
      .limit(12);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error(MESSAGES.PRODUCT.FETCH_BEST_SELLERS_ERROR, error);
    return [];
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("categories")
      .select(`
        *,
        products:products(count)
      `)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error(MESSAGES.PRODUCT.FETCH_ALL_CATEGORIES_ERROR, error);
    return [];
  }
}