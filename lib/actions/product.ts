"use server";

import { createClient } from "@/lib/supabase/server";
import { Product, Category } from "@/types/supabase";

export async function getFeaturedCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .limit(8)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
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
        )
      `)
      .eq("is_featured", true)
      .eq("is_active", true)
      .limit(8)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}