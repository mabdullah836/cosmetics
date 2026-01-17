import { supabase } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

const ProductPage = async ({ params: { slug } }: ProductPageProps) => {
  const { data: product, error } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(error);
    // Handle error appropriately
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <ProductImageGallery images={product.images} />
        <ProductInfo product={product} />
      </div>
    </div>
  );
};

export default ProductPage;
