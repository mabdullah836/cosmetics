import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryCard";
import ProductCarousel from "@/components/home/ProductCarousel";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import BrandValues from "@/components/home/BrandValues";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/common/Newsletter";
import { 
  getFeaturedCategories, 
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getBestSellers 
} from "@/lib/actions/product";
import type { HeroProduct, CategoryData, ProductCarouselItem } from "@/types/homepage";
import type { Product, Category } from "@/types/supabase";
import { logger } from "@/lib/utils/logger";

// Fetch data on the server
async function getHomePageData() {
  try {
    const [
      categories,
      featuredProducts,
      trendingProducts,
      newArrivals,
      bestSellers
    ] = await Promise.all([
      getFeaturedCategories(),
      getFeaturedProducts(),
      getTrendingProducts(),
      getNewArrivals(),
      getBestSellers()
    ]);
    
    return { 
      categories, 
      featuredProducts, 
      trendingProducts, 
      newArrivals, 
      bestSellers 
    };
  } catch (error) {
    logger.error("Error fetching home page data:", error);
    return { 
      categories: [], 
      featuredProducts: [], 
      trendingProducts: [], 
      newArrivals: [], 
      bestSellers: [] 
    };
  }
}

export default async function HomePage() {
  // Fetch data on the server
  const { 
    categories, 
    trendingProducts, 
    newArrivals, 
    bestSellers 
  } = await getHomePageData();

  const categoryData: CategoryData[] = categories.map((cat: Category): CategoryData => {
    // Extract product count from relation or direct field
    const productCount = cat.product_count || 
      (Array.isArray(cat.products) ? cat.products[0]?.count : cat.products?.count) || 
      0;
    
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
      imageUrl: cat.image_url || cat.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
      productCount: productCount,
      isFeatured: cat.is_featured || false,
    };
  });

  return (
    <>
      {/* Hero Section with Trending Products */}
      <HeroSection />

      {/* Featured Categories */}
      <CategoryGrid
        categories={categoryData}
        title="Shop by Category"
        subtitle="Discover products from our premium categories"
        columns={6}
      />

      {/* Best Sellers */}
      <ProductCarousel
        products={bestSellers.map((p: Product): ProductCarouselItem => {
          const categoryName = p.category_name || 
            (Array.isArray(p.categories) ? p.categories[0]?.name : p.categories?.name);
          
          return {
            id: p.id,
            name: p.name,
            slug: p.slug || p.id,
            price: p.price,
            originalPrice: p.original_price,
            imageUrl: p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
            rating: p.rating_average || p.rating,
            isNew: p.is_new_arrival || false,
            isSale: p.sale_price ? p.sale_price < p.price : false,
            category: categoryName,
          };
        })}
        title="Best Sellers"
        subtitle="Our most popular products this month"
        showViewAll={true}
      />

      {/* New Arrivals - Unique Layout with Tabs */}
      <NewArrivalsSection
        products={newArrivals.map((p: Product): ProductCarouselItem => {
          const categoryName = p.category_name || 
            (Array.isArray(p.categories) ? p.categories[0]?.name : p.categories?.name);
          
          return {
            id: p.id,
            name: p.name,
            slug: p.slug || p.id,
            price: p.price,
            originalPrice: p.original_price,
            imageUrl: p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
            rating: p.rating_average || p.rating,
            isNew: true,
            isSale: p.sale_price ? p.sale_price < p.price : false,
            category: categoryName,
          };
        })}
      />

      {/* Trending Products */}
      <ProductCarousel
        products={trendingProducts.map((p: Product): ProductCarouselItem => {
          const categoryName = p.category_name || 
            (Array.isArray(p.categories) ? p.categories[0]?.name : p.categories?.name);
          
          return {
            id: p.id,
            name: p.name,
            slug: p.slug || p.id,
            price: p.price,
            originalPrice: p.original_price,
            imageUrl: p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
            rating: p.rating_average || p.rating,
            isNew: p.is_new_arrival || false,
            isSale: p.sale_price ? p.sale_price < p.price : false,
            category: categoryName,
          };
        })}
        title="Trending Now"
        subtitle="What everyone is loving right now"
        showViewAll={true}
      />

      {/* Brand Values */}
      <BrandValues />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}

export const revalidate = 3600; // Revalidate every hour for ISR