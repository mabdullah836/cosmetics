"use server";

import { cache } from "react";
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

// Cache categories for the duration of the request
export const getAllCategories = cache(async (): Promise<Category[]> => {
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
});

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "latest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
  page?: number;
  limit?: number;
}

export async function getFilteredProducts(filters: ProductFilters = {}) {
  try {
    const supabase = await createClient();
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = "latest",
      page = 1,
      limit = 12,
    } = filters;

    let query = supabase
      .from("products")
      .select(
        `
        *,
        images:product_images (
          id,
          image_url,
          is_primary
        ),
        categories (
          id,
          name,
          slug
        )
      `,
        { count: "exact" }
      )
      .eq("is_active", true);

    // Apply search filter
    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply category filter
    if (category && category.trim()) {
      query = query.eq("categories.slug", category);
    }

    // Apply price filters
    if (minPrice !== undefined && minPrice >= 0) {
      query = query.gte("price", minPrice);
    }
    if (maxPrice !== undefined && maxPrice >= 0) {
      query = query.lte("price", maxPrice);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        query = query.order("price", { ascending: true });
        break;
      case "price-desc":
        query = query.order("price", { ascending: false });
        break;
      case "name-asc":
        query = query.order("name", { ascending: true });
        break;
      case "name-desc":
        query = query.order("name", { ascending: false });
        break;
      case "latest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      products: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    logger.error("Error fetching filtered products:", error);
    return {
      products: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
    };
  }
}

// Cache brands for the duration of the request
export const getAllBrands = cache(async (): Promise<string[]> => {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("products")
      .select("brand")
      .eq("is_active", true)
      .not("brand", "is", null);

    if (error) throw error;
    
    // Extract unique brands
    const brandSet = new Set<string>();
    data?.forEach((p) => {
      if (p.brand) {
        brandSet.add(p.brand);
      }
    });
    const brands = Array.from(brandSet);
    return brands.sort();
  } catch (error) {
    logger.error("Error fetching brands:", error);
    return [];
  }
});