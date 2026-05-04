import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import ProductGridSkeleton from "@/components/product/ProductGridSkeleton";
import { getFilteredProducts, getAllCategories, getAllBrands } from "@/lib/actions/product";
import { logger } from "@/lib/utils/logger";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Suspense } from "react";
import Link from "next/link";
import ProductsToolbar from "@/components/product/ProductsToolbar";

// Enable revalidation every 5 minutes for static content
export const revalidate = 300;

// Enable dynamic rendering for search params
export const dynamic = 'force-dynamic';

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    categories?: string;
    brands?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: "latest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
  }>;
}) => {
  const params = await searchParams;
  const currentPage = Math.max(parseInt(params.page || "1"), 1);

  // Fetch all data in parallel
  const [categories, brands, { products: productsData, total, totalPages }] = await Promise.all([
    getAllCategories(),
    getAllBrands(),
    getFilteredProducts({
      search: params.search,
      category: params.category,
      categories: params.categories,
      brands: params.brands,
      minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
      sortBy: params.sortBy || "latest",
      page: currentPage,
      limit: 12,
    }),
  ]);

  const products = productsData.map((p) => ({
    ...p,
    image: p.images?.find((i: any) => i.is_primary)?.image_url || p.images?.[0]?.image_url,
  }));

  const buildPageLink = (page: number) => {
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
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6">

        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            {total} items available
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-4">
              <ProductFilters
                categories={categories}
                brands={brands}
                maxPrice={1000}
              />
            </div>
          </aside>

          {/* Products */}
          <main className="flex-1">
            {/* Toolbar */}
            <ProductsToolbar
              currentCount={products.length}
              totalCount={total}
              currentSort={params.sortBy || "latest"}
              categories={categories}
              brands={brands}
            />

            {/* Product Grid */}
            <Suspense fallback={<ProductGridSkeleton />}>
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
            </Suspense>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center pb-16">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={currentPage > 1 ? buildPageLink(currentPage - 1) : "#"}
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
                            href={buildPageLink(page)}
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
                            ? buildPageLink(currentPage + 1)
                            : "#"
                        }
                        aria-disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
