import { unstable_cache } from "next/cache";
import { getPublicSupabase } from "@/lib/supabase/public";
import {
  CATALOG_CACHE_REVALIDATE,
  pdpTagBySlug,
} from "@/lib/cache/tags";
import type { Product, ProductImage } from "@/types/supabase";
import { logger } from "@/lib/utils/logger";

export type ProductReviewRow = {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  comment: string | null;
  is_verified_purchase: boolean;
  created_at: string;
  profiles?: { full_name?: string | null; avatar_url?: string | null } | null;
};

export type ProductCarouselRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating: number;
  category?: string;
  shortDescription?: string;
};

export type ProductWithPageData = Omit<Product, "images"> & {
  images: ProductImage[];
  category_id?: string | null;
  /** DB / UI fields not on base Product type */
  short_description?: string | null;
  specifications?: string[] | null;
  variants?: unknown[];
  averageRating?: number;
  reviewCount?: number;
  reviews: ProductReviewRow[];
  category?: string;
};

export type ProductPagePayload = {
  productWithData: ProductWithPageData;
  carouselProducts: ProductCarouselRow[];
  alsoBoughtProducts: ProductCarouselRow[];
};

function toCarouselItem(p: Record<string, unknown>): ProductCarouselRow {
  const images = p.images as { image_url: string }[] | null | undefined;
  const rawUrl = images?.[0]?.image_url;
  return {
    id: p.id as string,
    name: p.name as string,
    slug: (p.slug as string) || (p.id as string),
    price: p.price as number,
    originalPrice: (p.original_price as number | null) ?? undefined,
    imageUrl: rawUrl
      ? `${rawUrl}?width=600&height=600&quality=85`
      : "/placeholder-product.jpg",
    rating: 4.5,
    category: (p.category as string) || undefined,
    shortDescription: (p.short_description as string | null) ?? undefined,
  };
}

async function loadProductPage(pathSegment: string): Promise<ProductPagePayload | null> {
  try {
    const supabase = getPublicSupabase();
    const segment = decodeURIComponent(pathSegment).trim();
    if (!segment) return null;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    let row: Record<string, unknown> | null = null;

    const { data: bySlug } = await supabase
      .from("products")
      .select("*, images:product_images(*), categories(name)")
      .eq("slug", segment)
      .eq("is_active", true)
      .maybeSingle();

    if (bySlug) row = bySlug as Record<string, unknown>;
    else if (uuidRegex.test(segment)) {
      const { data: byId } = await supabase
        .from("products")
        .select("*, images:product_images(*), categories(name)")
        .eq("id", segment)
        .eq("is_active", true)
        .maybeSingle();
      if (byId) row = byId as Record<string, unknown>;
    }

    if (!row) {
      const { data: bySlugIlike } = await supabase
        .from("products")
        .select("*, images:product_images(*), categories(name)")
        .ilike("slug", segment)
        .eq("is_active", true)
        .maybeSingle();
      if (bySlugIlike) row = bySlugIlike as Record<string, unknown>;
    }

    if (!row) return null;

    const productId = row.id as string;
    const cats = row.categories as { name?: string } | null | undefined;
    const categoryName = cats && typeof cats === "object" && "name" in cats ? cats.name : undefined;

    const rawImages = (row.images as ProductImage[]) || [];
    const optimizedImages = rawImages.map((img) => ({
      ...img,
      image_url: `${img.image_url}?width=1200&height=1200&quality=85`,
    }));

    const { data: variants } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productId);

    const { data: reviews } = await supabase
      .from("reviews")
      .select(
        "id, product_id, user_id, rating, comment, is_verified_purchase, created_at, profiles(full_name, avatar_url)"
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .limit(10);

    const reviewList = (reviews || []) as ProductReviewRow[];
    const averageRating =
      reviewList.length > 0
        ? Number(
            (
              reviewList.reduce((acc, r) => acc + r.rating, 0) /
              reviewList.length
            ).toFixed(1)
          )
        : 0;

    let similarQuery = supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("is_active", true)
      .neq("id", productId);

    const categoryId = row.category_id as string | null | undefined;
    if (categoryId) {
      similarQuery = similarQuery.eq("category_id", categoryId);
    }

    const { data: similarProducts } = await similarQuery.limit(8);

    const { data: alsoBought } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("is_active", true)
      .neq("id", productId)
      .limit(4);

    const { images: _i, categories: _c, ...productRest } = row;
    const productBase = {
      ...productRest,
      category: categoryName ?? (row.category as string | undefined),
    } as Product;

    const productWithData: ProductWithPageData = {
      ...productBase,
      images: optimizedImages,
      variants: variants || [],
      averageRating,
      reviewCount: reviewList.length,
      reviews: reviewList,
    };

    return {
      productWithData,
      carouselProducts: (similarProducts || []).map((p) =>
        toCarouselItem(p as Record<string, unknown>)
      ),
      alsoBoughtProducts: (alsoBought || []).map((p) =>
        toCarouselItem(p as Record<string, unknown>)
      ),
    };
  } catch (e) {
    logger.error("loadProductPage failed:", e);
    return null;
  }
}

export async function getCachedProductPageData(
  pathSegment: string
): Promise<ProductPagePayload | null> {
  return unstable_cache(
    () => loadProductPage(pathSegment),
    ["product-pdp", pathSegment],
    {
      revalidate: CATALOG_CACHE_REVALIDATE,
      tags: [pdpTagBySlug(pathSegment)],
    }
  )();
}
