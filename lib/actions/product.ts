/**
 * Product catalog reads are implemented in `lib/data/catalog.ts` using
 * `unstable_cache` + anonymous Supabase (no cookies) for Data Cache + tags.
 * Re-exported here so existing `@/lib/actions/product` imports keep working.
 */
export type { ProductFilters } from "@/lib/data/catalog";
export {
  getFeaturedCategories,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getBestSellers,
  getAllCategories,
  getAllBrands,
  getFilteredProducts,
  getStaticProductSlugs,
} from "@/lib/data/catalog";
