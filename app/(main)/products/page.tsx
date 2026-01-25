import { supabase } from "@/lib/supabase/client";
import { ProductImage } from "@/types/supabase";
import ProductCard from "@/components/product/ProductCard";
import Pagination from "@/components/ui/Pagination";
import ProductFilters from "@/components/product/ProductFilters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Suspense } from "react";
import ProductGridSkeleton from "@/components/product/ProductGridSkeleton";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Filter } from "lucide-react";
import { CONFIG } from "@/lib/constants";
import { logger } from "@/lib/utils/logger";

const ProductsPage = async ({ searchParams }: { searchParams: Promise<{ page?: string }> }) => {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");

  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const totalPages = Math.ceil((totalProducts || 0) / CONFIG.PRODUCTS_PER_PAGE);

  const from = (currentPage - 1) * CONFIG.PRODUCTS_PER_PAGE;
  const to = from + CONFIG.PRODUCTS_PER_PAGE - 1;

  const { data: productsData, error } = await supabase
    .from('products')
    .select('*, images:product_images(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    logger.error("Error fetching products:", error);
  }

  const getPrimaryImage = (images: ProductImage[] | null | undefined) => {
    if (!images || images.length === 0) return null;
    return images.find((img: ProductImage) => img.is_primary) || images[0];
  };

  const products = productsData?.map(p => {
    const primaryImage = getPrimaryImage(p.images);
    return {
      ...p,
      images: primaryImage ? [primaryImage] : []
    };
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 xl:px-16 pt-8 pb-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900 font-medium">Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-3">Discover Our Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl">Explore premium cosmetics crafted with care. {totalProducts} products waiting for you.</p>
        </div>

        {/* Mobile filter button */}
        <div className="lg:hidden mb-6">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters & Sorting</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky sidebar - desktop */}
          <aside className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-24">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>
                <ProductFilters />
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-white rounded-2xl shadow-sm">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">{products.length}</span> of <span className="font-semibold text-gray-900">{totalProducts}</span> products</p>
                <p className="text-xs text-gray-500">Page {currentPage} of {totalPages}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select>
                    <SelectTrigger className="w-[200px] border-gray-200 focus:ring-2 focus:ring-gray-900/20">
                      <SelectValue placeholder="Recommended" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-200">
                      <SelectItem value="latest">Newest Arrivals</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="best-selling">Best Selling</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">View:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button className="px-3 py-1.5 rounded-md bg-white shadow-sm text-sm font-medium">Grid</button>
                    <button className="px-3 py-1.5 rounded-md text-sm text-gray-600 hover:text-gray-900">List</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product grid */}
            <Suspense fallback={<ProductGridSkeleton />}>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {products.map((product) => {
                    const primaryImage = getPrimaryImage(product.images);
                    return (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        originalPrice={product.original_price || undefined}
                        imageUrl={primaryImage?.image_url || undefined}
                        rating={4.5}
                        reviewCount={0}
                        slug={product.slug || product.id}
                        category={product.category || undefined}
                        stock={product.stock || 0}
                        shippingDays={3}
                        isNew={false}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-8">Try adjusting your filters or search terms</p>
                  <button className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                    Clear all filters
                  </button>
                </div>
              )}
            </Suspense>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16">
                <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/products" />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;