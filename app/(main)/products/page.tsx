import { supabase } from "@/lib/supabase/client";
import { ProductImage } from "@/types/supabase";
import ProductCard from "@/components/product/ProductCard";
import Pagination from "@/components/ui/Pagination";
import ProductFilters from "@/components/product/ProductFilters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Suspense } from "react";
import ProductGridSkeleton from "@/components/product/ProductGridSkeleton";

const PRODUCTS_PER_PAGE = 12;

const ProductsPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
  const currentPage = parseInt(searchParams.page || "1");

  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const totalPages = Math.ceil((totalProducts || 0) / PRODUCTS_PER_PAGE);

  const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;

  const { data: productsData, error } = await supabase
    .from('products')
    .select('*, images:product_images(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error(error);
    // Handle error
  }

  const getPrimaryImage = (images: ProductImage[]) => {
    if (!images || images.length === 0) return { url: '/placeholder.svg' };
    return images.find((img: ProductImage) => img.is_primary) || images[0];
  };

  const products = productsData?.map(p => ({ ...p, images: [getPrimaryImage(p.images)] })) || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">All Products</h1>
        <p className="mt-2 text-lg text-muted-foreground">Explore our full range of high-quality cosmetics.</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4">
          <ProductFilters />
        </aside>
        <main className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">Showing {products.length} of {totalProducts} products</p>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Suspense fallback={<ProductGridSkeleton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Suspense>
          <div className="mt-12">
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/products" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
