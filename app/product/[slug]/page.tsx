import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductCarousel from "@/components/home/ProductCarousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Shield, RotateCcw, Star, Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logger } from "@/lib/utils/logger";
import type { ProductImage } from "@/types/supabase";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

/** Matches reviews table: id, product_id, user_id, rating, comment, is_verified_purchase, created_at */
type ProductReview = {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  comment: string | null;
  is_verified_purchase: boolean;
  created_at: string;
  /** From join to profiles (profiles.id = reviews.user_id) */
  profiles?: { full_name?: string | null; avatar_url?: string | null } | null;
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

  // Optimize images - resize to reasonable dimensions
  const optimizedImages = (product.images || []).map((img: ProductImage) => ({
    ...img,
    image_url: `${img.image_url}?width=1200&height=1200&quality=85`
  }));

  // Fetch variants
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id);

  // Fetch reviews (schema: id, product_id, user_id, rating, comment, is_verified_purchase, created_at)
  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, product_id, user_id, rating, comment, is_verified_purchase, created_at, profiles(full_name, avatar_url)')
    .eq('product_id', product.id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Calculate average rating
  const averageRating = reviews && reviews.length > 0 
    ? Number((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1))
    : 0;

  // Product with enriched data
  const productWithData = {
    ...product,
    images: optimizedImages,
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

  // Prepare carousel products with optimized images
  const carouselProducts = (similarProducts || []).map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug || p.id,
    price: p.price,
    originalPrice: p.original_price || undefined,
    imageUrl: p.images?.[0]?.image_url ? 
      `${p.images[0].image_url}?width=600&height=600&quality=85` : 
      '/placeholder-product.jpg',
    rating: 4.5,
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
    imageUrl: p.images?.[0]?.image_url ? 
      `${p.images[0].image_url}?width=600&height=600&quality=85` : 
      '/placeholder-product.jpg',
    rating: 4.5,
    category: p.category || undefined
  }));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link 
                    href="/" 
                    className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
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
                    className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
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
                        className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
                      >
                        {product.category}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-gray-900 font-medium text-sm">
                  {product.name}
                </span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Image Gallery */}
          <div className="lg:sticky lg:top-8">
            <div className="space-y-4">
              {productWithData.images.length > 0 ? (
                <ProductImageGallery
                  images={productWithData.images}
                  productName={product.name}
                />
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <ProductInfo product={productWithData} />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-b border-gray-200 py-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Truck className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Free Shipping</h4>
                <p className="text-gray-500 text-xs">Orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <RotateCcw className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">30-Day Returns</h4>
                <p className="text-gray-500 text-xs">Easy returns</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Secure Payment</h4>
                <p className="text-gray-500 text-xs">100% secure</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Quality Guaranteed</h4>
                <p className="text-gray-500 text-xs">Premium quality</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full border-b bg-transparent p-0 h-auto mb-8">
              <TabsTrigger 
                value="description"
                className="data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-4 py-3 text-sm font-medium text-gray-500"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="details"
                className="data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-4 py-3 text-sm font-medium text-gray-500"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-4 py-3 text-sm font-medium text-gray-500"
              >
                Reviews ({productWithData.reviewCount})
              </TabsTrigger>
              <TabsTrigger 
                value="shipping"
                className="data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-4 py-3 text-sm font-medium text-gray-500"
              >
                Shipping
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose prose-gray max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h3>
                {product.description ? (
                  <div 
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description }} 
                  />
                ) : (
                  <p className="text-gray-500">No description available.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h3>
                  <ul className="space-y-3">
                    {product.specifications?.map((spec: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mt-2"></div>
                        <span className="text-gray-600">{spec}</span>
                      </li>
                    )) || (
                      <>
                        <li className="flex items-start gap-3">
                          <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mt-2"></div>
                          <span className="text-gray-600">High-quality materials</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mt-2"></div>
                          <span className="text-gray-600">Premium craftsmanship</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Care Instructions</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Store in a cool, dry place. Avoid direct sunlight and extreme temperatures.
                    Follow specific care instructions included with product.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Reviews</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
                        <span className="text-gray-500">/5</span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        • {productWithData.reviewCount} {productWithData.reviewCount === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="border-gray-300">
                    Write a Review
                  </Button>
                </div>
                
                {productWithData.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {productWithData.reviews.slice(0, 5).map((review: ProductReview) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {review.profiles?.full_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-medium text-gray-900">
                                  {review.profiles?.full_name || 'Anonymous'}
                                </h4>
                                {review.is_verified_purchase && (
                                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                    Verified purchase
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
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
                            {new Date(review.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-gray-200 rounded-lg">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                      <Star className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">No reviews yet</p>
                    <Button variant="outline" className="border-gray-300">
                      Be the first to review
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h3>
                  <div className="space-y-3 text-gray-600">
                    <p className="flex items-start gap-2">
                      <span className="text-gray-900 font-medium">• Standard Shipping:</span>
                      <span>3-5 business days • Free on orders over $50</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-gray-900 font-medium">• Express Shipping:</span>
                      <span>1-2 business days • $9.99</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-gray-900 font-medium">• Processing Time:</span>
                      <span>1-2 business days</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-gray-900 font-medium">• International:</span>
                      <span>Available to select countries</span>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Return Policy</h3>
                  <div className="space-y-3 text-gray-600">
                    <p className="flex items-start gap-2">
                      <span className="text-gray-900 font-medium">• Return Window:</span>
                      <span>30 days from delivery date</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-gray-900 font-medium">• Condition:</span>
                      <span>Unused, in original packaging with tags</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-gray-900 font-medium">• Refund Time:</span>
                      <span>5-10 business days after return receipt</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-gray-900 font-medium">• Defective Items:</span>
                      <span>Free returns and replacement</span>
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products */}
        {carouselProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Similar Products</h2>
                <p className="text-gray-500 mt-1">You might also like</p>
              </div>
              <Link 
                href="/products" 
                className="text-sm font-medium text-gray-900 hover:text-gray-700 flex items-center gap-1"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <ProductCarousel
              products={carouselProducts}
              title=""
              subtitle=""
              autoPlay={false}
              itemsPerView={4}
              variant="default"
            />
          </div>
        )}

        {/* Frequently Bought Together */}
        {alsoBoughtProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Bought Together</h2>
            <ProductCarousel
              products={alsoBoughtProducts}
              title=""
              subtitle=""
              showViewAll={false}
              autoPlay={false}
              itemsPerView={4}
              variant="minimal"
            />
          </div>
        )}
      </div>
    </div>
  );
}