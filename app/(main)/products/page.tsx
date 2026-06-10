import ProductResults from "@/components/product/ProductResults";
import ProductResultsSection from "@/components/product/ProductResultsSection";
import { getAllCategories } from "@/lib/actions/product";
import { normalizeCategorySlugParam } from "@/lib/utils/product-filters";

/** Safety-net ISR; primary freshness via unstable_cache + revalidateTag (admin). */
export const revalidate = 86400;

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
  const rawParams = await searchParams;
  const categories = await getAllCategories();
  const params = normalizeCategorySlugParam(rawParams, categories);

  return (
    <ProductResultsSection>
      <ProductResults params={params} />
    </ProductResultsSection>
  );
};

export default ProductsPage;
