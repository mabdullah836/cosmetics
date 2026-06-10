export type ProductSearchParams = {
  page?: string;
  search?: string;
  category?: string;
  categories?: string;
  brands?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: "latest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
};

const CATEGORY_UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function buildProductFilterKey(
  params: ProductSearchParams | URLSearchParams
): string {
  const read = (key: string) =>
    params instanceof URLSearchParams
      ? params.get(key) ?? ""
      : (params as ProductSearchParams)[key as keyof ProductSearchParams] ?? "";

  return JSON.stringify({
    search: read("search"),
    category: read("category"),
    categories: read("categories"),
    brands: read("brands"),
    minPrice: read("minPrice"),
    maxPrice: read("maxPrice"),
    sortBy: read("sortBy") || "latest",
    page: read("page") || "1",
  });
}

export function normalizeCategorySlugParam(
  params: ProductSearchParams,
  categoryList: Array<{ id: string; slug?: string | null }>
): ProductSearchParams {
  const categorySlug = params.category?.trim();
  if (!categorySlug || params.categories || CATEGORY_UUID_REGEX.test(categorySlug)) {
    return params;
  }

  const match = categoryList.find(
    (c) => (c.slug ?? "").toLowerCase() === categorySlug.toLowerCase()
  );
  if (!match) return params;

  const { category: _removed, page: _page, ...rest } = params;
  return { ...rest, categories: match.id };
}
