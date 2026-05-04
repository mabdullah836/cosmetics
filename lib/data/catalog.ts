import { unstable_cache } from "next/cache";
import { getPublicSupabase } from "@/lib/supabase/public";
import {
  CACHE_TAG,
  CATALOG_CACHE_REVALIDATE,
} from "@/lib/cache/tags";
import { Product, Category } from "@/types/supabase";
import { logger } from "@/lib/utils/logger";
import { MESSAGES } from "@/lib/constants/messages";

export interface ProductFilters {
  search?: string;
  category?: string;
  categories?: string;
  brands?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "latest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
  page?: number;
  limit?: number;
}

function stableListKey(filters: ProductFilters) {
  return JSON.stringify({
    s: filters.search ?? "",
    c: filters.category ?? "",
    cs: filters.categories ?? "",
    b: filters.brands ?? "",
    min: filters.minPrice ?? null,
    max: filters.maxPrice ?? null,
    sort: filters.sortBy ?? "latest",
    p: filters.page ?? 1,
    l: filters.limit ?? 12,
  });
}

async function fetchFeaturedCategories(): Promise<Category[]> {
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
      .from("categories")
      .select(
        `
        *,
        products:products(count)
      `
      )
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

export async function getFeaturedCategories(): Promise<Category[]> {
  return unstable_cache(fetchFeaturedCategories, ["featured-categories"], {
    revalidate: CATALOG_CACHE_REVALIDATE,
    tags: [CACHE_TAG.categories, CACHE_TAG.homepage],
  })();
}

async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
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
          name,
          slug
        )
      `
      )
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

export async function getFeaturedProducts(): Promise<Product[]> {
  return unstable_cache(fetchFeaturedProducts, ["featured-products"], {
    revalidate: CATALOG_CACHE_REVALIDATE,
    tags: [CACHE_TAG.homepage, CACHE_TAG.productList],
  })();
}

async function fetchTrendingProducts(): Promise<Product[]> {
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
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
          name,
          slug
        )
      `
      )
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

export async function getTrendingProducts(): Promise<Product[]> {
  return unstable_cache(fetchTrendingProducts, ["trending-products"], {
    revalidate: CATALOG_CACHE_REVALIDATE,
    tags: [CACHE_TAG.homepage, CACHE_TAG.productList],
  })();
}

async function fetchNewArrivals(): Promise<Product[]> {
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
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
          name,
          slug
        )
      `
      )
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

export async function getNewArrivals(): Promise<Product[]> {
  return unstable_cache(fetchNewArrivals, ["new-arrivals"], {
    revalidate: CATALOG_CACHE_REVALIDATE,
    tags: [CACHE_TAG.homepage, CACHE_TAG.productList],
  })();
}

async function fetchBestSellers(): Promise<Product[]> {
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
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
          name,
          slug
        )
      `
      )
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

export async function getBestSellers(): Promise<Product[]> {
  return unstable_cache(fetchBestSellers, ["best-sellers"], {
    revalidate: CATALOG_CACHE_REVALIDATE,
    tags: [CACHE_TAG.homepage, CACHE_TAG.productList],
  })();
}

async function fetchAllCategories(): Promise<Category[]> {
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
      .from("categories")
      .select(
        `
        *,
        products:products(count)
      `
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error(MESSAGES.PRODUCT.FETCH_ALL_CATEGORIES_ERROR, error);
    return [];
  }
}

export async function getAllCategories(): Promise<Category[]> {
  return unstable_cache(fetchAllCategories, ["all-categories"], {
    revalidate: CATALOG_CACHE_REVALIDATE,
    tags: [CACHE_TAG.categories],
  })();
}

async function fetchAllBrands(): Promise<string[]> {
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("brand")
      .eq("is_active", true)
      .not("brand", "is", null);

    if (error) throw error;

    const brandSet = new Set<string>();
    data?.forEach((p) => {
      if (p.brand) brandSet.add(p.brand);
    });
    return Array.from(brandSet).sort();
  } catch (error) {
    logger.error("Error fetching brands:", error);
    return [];
  }
}

export async function getAllBrands(): Promise<string[]> {
  return unstable_cache(fetchAllBrands, ["all-brands"], {
    revalidate: CATALOG_CACHE_REVALIDATE,
    tags: [CACHE_TAG.brands],
  })();
}

async function fetchFilteredProducts(filters: ProductFilters) {
  try {
    const supabase = getPublicSupabase();
    const {
      search,
      category,
      categories: categoriesParam,
      brands: brandsParam,
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

    if (search && search.trim()) {
      query = query.or(
        `name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (categoriesParam?.trim()) {
      const ids = categoriesParam
        ?.split(",")
        ?.map((c) => c?.trim())
        ?.filter(Boolean);
      if (ids?.length > 0) {
        query = query.in("category_id", ids);
      }
    } else if (category?.trim()) {
      const val = category?.trim();
      if (uuidRegex.test(val)) {
        query = query.eq("category_id", val);
      } else {
        query = query.eq("categories.slug", val);
      }
    }

    if (brandsParam && brandsParam?.trim()) {
      const brandsList = brandsParam
        .split(",")
        .map((b) => b?.trim())
        .filter(Boolean);
      if (brandsList?.length > 0) {
        query = query.in("brand", brandsList);
      }
    }

    if (minPrice !== undefined && minPrice >= 0) {
      query = query.gte("price", minPrice);
    }
    if (maxPrice !== undefined && maxPrice >= 0) {
      query = query.lte("price", maxPrice);
    }

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

export async function getFilteredProducts(filters: ProductFilters = {}) {
  const key = stableListKey(filters);
  return unstable_cache(
    () => fetchFilteredProducts(filters),
    ["product-list", key],
    {
      revalidate: CATALOG_CACHE_REVALIDATE,
      tags: [CACHE_TAG.productList],
    }
  )();
}
