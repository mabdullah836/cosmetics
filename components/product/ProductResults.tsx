import ProductCard from "@/components/product/ProductCard";
import { getFilteredProducts } from "@/lib/actions/product";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type ProductResultsParams = {
  page?: string;
  search?: string;
  category?: string;
  categories?: string;
  brands?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: "latest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
};

function buildPageLink(params: ProductResultsParams, page: number) {
  const searchParamsObj = new URLSearchParams();
  if (params.search) searchParamsObj.set("search", params.search);
  if (params.category) searchParamsObj.set("category", params.category);
  if (params.categories) searchParamsObj.set("categories", params.categories);
  if (params.brands) searchParamsObj.set("brands", params.brands);
  if (params.minPrice) searchParamsObj.set("minPrice", params.minPrice);
  if (params.maxPrice) searchParamsObj.set("maxPrice", params.maxPrice);
  if (params.sortBy) searchParamsObj.set("sortBy", params.sortBy);
  searchParamsObj.set("page", page.toString());
  return `?${searchParamsObj.toString()}`;
}

export default async function ProductResults({ params }: { params: ProductResultsParams }) {
  const currentPage = Math.max(parseInt(params.page || "1"), 1);

  const { products: productsData, total, totalPages } = await getFilteredProducts({
    search: params.search,
    category: params.category,
    categories: params.categories,
    brands: params.brands,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    sortBy: params.sortBy || "latest",
    page: currentPage,
    limit: 12,
  });

  const products = productsData.map((p) => ({
    ...p,
    image: p.images?.find((i: { is_primary?: boolean }) => i.is_primary)?.image_url || p.images?.[0]?.image_url,
  }));

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">
        Showing {products.length} of {total}
      </p>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.original_price || undefined}
              imageUrl={product.image}
              slug={product.slug || product.id}
              stock={product.stock || 0}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your filters or search.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center pb-16">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={currentPage > 1 ? buildPageLink(params, currentPage - 1) : "#"}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1
                )
                .map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href={buildPageLink(params, page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              <PaginationItem>
                <PaginationNext
                  href={
                    currentPage < totalPages
                      ? buildPageLink(params, currentPage + 1)
                      : "#"
                  }
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
