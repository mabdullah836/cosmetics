import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductCarousel from "@/components/home/ProductCarousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Truck, RotateCcw, Star, Package, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logger } from "@/lib/utils/logger";
import { ROUTES } from "@/lib/constants";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Try to fetch by slug first, then by ID
  let product = null;
  let productError = null;

  const { data: productBySlug, error: slugError } = await supabase
    .from('products')
    .select('*, images:product_images(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (productBySlug) {
    product = productBySlug;
  } else {
    const { data: productById, error: idError } = await supabase
      .from('products')
      .select('*, images:product_images(*)')
      .eq('id', slug)
      .eq('is_active', true)
      .single();

    if (productById) {
      product = productById;
    } else {
      productError = idError || slugError;
    }
  }

  if (productError || !product) {
    logger.error('Product not found:', { slug, error: productError });
    notFound();
  }

  // Fetch variants
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id);

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('product_id', product.id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Calculate average rating
  const averageRating = reviews && reviews.length > 0 
    ? Number((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1))
    : 4.5;

  // Product with enriched data
  const productWithData = {
    ...product,
    variants: variants || [],
    averageRating,
    reviewCount: reviews?.length || 0,
    reviews: reviews || []
  };

  // Fetch similar products
  let query = supabase
    .from('products')
    .select('*, images:product_images(*)')
    .eq('is_active', true)
    .neq('id', product.id);

  if (product.category_id) {
    query = query.eq('category_id', product.category_id);
  }

  const { data: similarProducts } = await query.limit(8);

  // Prepare carousel products
  const carouselProducts = (similarProducts || []).map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug || p.id,
    price: p.price,
    originalPrice: p.original_price || undefined,
    imageUrl: p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
    rating: 4.5,
    isNew: true,
    category: p.category || undefined,
    shortDescription: p.short_description || undefined
  }));

  // Fetch also bought products
  const { data: alsoBought } = await supabase
    .from('products')
    .select('*, images:product_images(*)')
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(4);

  const alsoBoughtProducts = (alsoBought || []).map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug || p.id,
    price: p.price,
    originalPrice: p.original_price || undefined,
    imageUrl: p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
    rating: 4.5,
    category: p.category || undefined
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 xl:px-16 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link 
                    href="/" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link 
                    href="/products" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    Products
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {product.category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link 
                        href={`/categories/${product.category_id}`}
                        className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                      >
                        {product.category}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900 font-semibold text-sm">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Main Product Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 lg:gap-10 items-start">

            {/* Image Gallery */}
            <div className="lg:sticky lg:top-24">
              <ProductImageGallery
                images={productWithData.images || []}
                productName={product.name}
              />
            </div>

            {/* Product Info */}
            <div>
              <ProductInfo product={productWithData} />
            </div>

          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <Truck className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Free Shipping</h4>
            <p className="text-sm text-gray-600">On orders over $50</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <RotateCcw className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">30-Day Returns</h4>
            <p className="text-sm text-gray-600">Hassle-free returns</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <Shield className="h-8 w-8 text-amber-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Secure Payment</h4>
            <p className="text-sm text-gray-600">100% secure checkout</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <Package className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Quality Guarantee</h4>
            <p className="text-sm text-gray-600">Premium quality products</p>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto mb-8">
              <TabsTrigger 
                value="description"
                className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-6 py-3 text-base font-medium"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="details"
                className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-6 py-3 text-base font-medium"
              >
                Details & Care
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-6 py-3 text-base font-medium"
              >
                Reviews ({productWithData.reviewCount})
              </TabsTrigger>
              <TabsTrigger 
                value="shipping"
                className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-6 py-3 text-base font-medium"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-0">
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h3>
                <div className="space-y-6 text-gray-700">
                  {product.description ? (
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  ) : (
                    <p className="text-gray-600">No description available for this product.</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-700">High-quality materials</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-700">Cruelty-free formula</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-700">Suitable for all skin types</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Care Instructions</h3>
                  <p className="text-gray-700">
                    Store in a cool, dry place away from direct sunlight. Use within 12 months of opening.
                    Avoid contact with eyes. If irritation occurs, discontinue use immediately.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-0">
              <div className="space-y-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                        <span className="text-3xl font-bold">{averageRating}</span>
                        <span className="text-gray-500">/5</span>
                      </div>
                      <span className="text-gray-600">Based on {productWithData.reviewCount} reviews</span>
                    </div>
                  </div>
                  <Button>Write a Review</Button>
                </div>
                
                {productWithData.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {productWithData.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {review.profiles?.full_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold">{review.profiles?.full_name || 'Anonymous'}</h4>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this product!</p>
                    <Button>Write First Review</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-0">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Shipping Information</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>• Free standard shipping on orders over $50</p>
                    <p>• Express shipping available at checkout</p>
                    <p>• Typically ships within 1-2 business days</p>
                    <p>• International shipping available to select countries</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Return Policy</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>• 30-day return window from delivery date</p>
                    <p>• Items must be in original condition with all tags attached</p>
                    <p>• Refunds processed within 5-10 business days</p>
                    <p>• Free returns for defective or damaged items</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products */}
        {carouselProducts.length > 0 && (
          <ProductCarousel
            products={carouselProducts}
            title="You Might Also Like"
            subtitle="Similar products you might be interested in"
            autoPlay={false}
            itemsPerView={4}
            variant="default"
          />
        )}

        {/* Frequently Bought Together */}
        {alsoBoughtProducts.length > 0 && (
          <ProductCarousel
            products={alsoBoughtProducts}
            title="Frequently Bought Together"
            subtitle="Often purchased with this item"
            showViewAll={false}
            autoPlay={false}
            itemsPerView={4}
            variant="minimal"
          />
        )}
      </div>
    </div>
  );
}