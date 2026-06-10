import ProductFilters from "@/components/product/ProductFilters";
import { getAllCategories, getAllBrands } from "@/lib/actions/product";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import ProductsToolbar from "@/components/product/ProductsToolbar";

/** Cached shell; filter results revalidate via page + Data Cache tags. */
export const revalidate = 86400;

export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, brands] = await Promise.all([
    getAllCategories(),
    getAllBrands(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6">
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

        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground">Products</h1>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-4">
              <ProductFilters
                categories={categories}
                brands={brands}
                maxPrice={1000}
              />
            </div>
          </aside>

          <main className="flex-1">
            <ProductsToolbar categories={categories} brands={brands} />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
