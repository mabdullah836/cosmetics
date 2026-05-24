/**
 * Next.js Data Cache tags for unstable_cache + revalidateTag.
 * Broad tags invalidate listing/home/category data; PDP uses slug + id tags.
 */
export const CACHE_TAG = {
  categories: "catalog-categories",
  brands: "catalog-brands",
  productList: "catalog-product-list",
  homepage: "catalog-homepage",
} as const;

/** Tag for one /product/[segment] Data Cache entry (slug or UUID path segment). */
export function pdpTagBySlug(pathSegment: string) {
  return `pdp:${pathSegment}`;
}

/** Long-lived cache; rely on revalidateTag after admin writes. */
export const CATALOG_CACHE_REVALIDATE = false;
