/**
 * Types for homepage components and data transformations
 */

import { Product, Category } from "./supabase";

/**
 * Hero Product - Transformed product for hero section display
 */
export type HeroProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  rating: number;
  isNew?: boolean;
  isSale?: boolean;
  shortDescription?: string;
};

/**
 * Category Data - Transformed category for grid display
 */
export type CategoryData = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  productCount?: number;
  description?: string;
  isFeatured?: boolean;
  icon?: string;
};

/**
 * Product Carousel Item - Transformed product for carousel display
 */
export type ProductCarouselItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating?: number;
  isNew?: boolean;
  isSale?: boolean;
  category?: string;
  shortDescription?: string;
};

/**
 * Helper type for product transformations
 */
export type TransformedProduct = Product & {
  imageUrl: string;
  isNew: boolean;
  isSale: boolean;
  category?: string;
};

/**
 * Helper type for category transformations
 */
export type TransformedCategory = Category & {
  imageUrl: string;
  productCount: number;
  isFeatured: boolean;
};
