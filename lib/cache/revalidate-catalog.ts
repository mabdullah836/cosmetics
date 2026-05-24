import { revalidateTag } from "next/cache";
import { CACHE_TAG, pdpTagBySlug } from "@/lib/cache/tags";

const IMMEDIATE = { expire: 0 } as const;

/**
 * Invalidate all catalog list/home/category/brand caches (after any product change).
 */
export function revalidateCatalogLists() {
  revalidateTag(CACHE_TAG.categories, IMMEDIATE);
  revalidateTag(CACHE_TAG.brands, IMMEDIATE);
  revalidateTag(CACHE_TAG.productList, IMMEDIATE);
  revalidateTag(CACHE_TAG.homepage, IMMEDIATE);
}

/**
 * Invalidate PDP Data Cache for every URL segment that can resolve to this product
 * (canonical slug, previous slug after rename, and /product/[id] when id is used in the path).
 */
export function revalidateProductDetailPages(opts: {
  productId: string;
  slug?: string | null;
  previousSlug?: string | null;
}) {
  const segments = new Set<string>();
  if (opts.previousSlug?.trim()) segments.add(opts.previousSlug.trim());
  if (opts.slug?.trim()) segments.add(opts.slug.trim());
  segments.add(opts.productId);
  for (const seg of Array.from(segments)) {
    revalidateTag(pdpTagBySlug(seg), IMMEDIATE);
  }
}

/**
 * Full storefront catalog invalidation after admin product create/update/delete/images/stock.
 */
export function revalidateAfterProductMutation(opts: {
  productId: string;
  slug?: string | null;
  previousSlug?: string | null;
}) {
  revalidateCatalogLists();
  revalidateProductDetailPages(opts);
}
