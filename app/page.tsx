import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryCard from "@/components/home/CategoryCard";
import ProductCard from "@/components/product/ProductCard";
import BrandValues from "@/components/home/BrandValues";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/common/Newsletter";
import FAQ from "@/components/common/FAQ";
import { getFeaturedCategories, getFeaturedProducts } from "@/lib/actions/product";

// Fetch data on the server
async function getHomePageData() {
  try {
    const [categories, products] = await Promise.all([
      getFeaturedCategories(),
      getFeaturedProducts(),
    ]);
    
    return { categories, products };
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return { categories: [], products: [] };
  }
}

export default async function HomePage() {
  // Fetch data on the server
  const { categories, products } = await getHomePageData();

  return (
    <>
      {/* Hero Carousel */}
      <section aria-label="Hero banner">
        <HeroCarousel />
      </section>

      {/* Featured Categories */}
      <section 
        className="py-16 md:py-20 bg-background" 
        aria-labelledby="featured-categories-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              id="featured-categories-heading"
              className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4"
            >
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated collections for every beauty need
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CategoryCard
                  id={category.id}
                  name={category.name}
                  imageUrl={category?.image_url || category?.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'}
                  productCount={0}
                  slug={category.slug || category.name.toLowerCase()}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section 
        className="py-16 md:py-20 bg-muted/30" 
        aria-labelledby="featured-products-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              id="featured-products-heading"
              className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4"
            >
              Best Sellers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most loved products, adored by thousands
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.original_price}
                    imageUrl={product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'}
                    rating={product.rating || 4.5}
                    reviewCount={0}
                    isNew={false}
                    isSale={false}
                    slug={product.slug || product.id}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Brand Values */}
      <BrandValues />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />

      {/* FAQ */}
      <FAQ />
    </>
  );
}

export const revalidate = 3600; // Revalidate every hour for ISR