/**
 * Navigation config for the mega-menu and support menu.
 * Structure is designed for easy extension with dynamic data from Supabase later.
 */

import { ROUTES } from "./routes";

export interface NavSubCategory {
  name: string;
  href: string;
  /** Optional description for mega-menu display */
  description?: string;
}

export interface NavCategory {
  id: string;
  name: string;
  href: string;
  subCategories: NavSubCategory[];
}

export interface SupportMenuItem {
  id: string;
  name: string;
  href: string;
}

/** Main product categories with sub-categories (mega-menu). */
export const NAV_CATEGORIES: NavCategory[] = [
  {
    id: "makeup",
    name: "Makeup",
    href: "/products?category=makeup",
    subCategories: [
      { name: "Foundation", href: "/products?category=makeup&sub=foundation" },
      { name: "Lipstick", href: "/products?category=makeup&sub=lipstick" },
      { name: "Eyeshadow", href: "/products?category=makeup&sub=eyeshadow" },
      { name: "Mascara", href: "/products?category=makeup&sub=mascara" },
      { name: "Blush", href: "/products?category=makeup&sub=blush" },
      { name: "Makeup Brushes", href: "/products?category=makeup&sub=brushes" },
    ],
  },
  {
    id: "skin-care",
    name: "Skin Care",
    href: "/products?category=skin-care",
    subCategories: [
      { name: "Cleansers", href: "/products?category=skin-care&sub=cleansers" },
      { name: "Moisturizers", href: "/products?category=skin-care&sub=moisturizers" },
      { name: "Serums", href: "/products?category=skin-care&sub=serums" },
      { name: "Face Masks", href: "/products?category=skin-care&sub=face-masks" },
      { name: "Eye Care", href: "/products?category=skin-care&sub=eye-care" },
      { name: "Sunscreen", href: "/products?category=skin-care&sub=sunscreen" },
    ],
  },
  {
    id: "fragrance",
    name: "Fragrance",
    href: "/products?category=fragrance",
    subCategories: [
      { name: "Perfume", href: "/products?category=fragrance&sub=perfume" },
      { name: "Body Mist", href: "/products?category=fragrance&sub=body-mist" },
      { name: "Eau de Toilette", href: "/products?category=fragrance&sub=eau-de-toilette" },
      { name: "Gift Sets", href: "/products?category=fragrance&sub=gift-sets" },
    ],
  },
  {
    id: "hair-care",
    name: "Hair Care",
    href: "/products?category=hair-care",
    subCategories: [
      { name: "Shampoo & Conditioner", href: "/products?category=hair-care&sub=shampoo-conditioner" },
      { name: "Hair Oils", href: "/products?category=hair-care&sub=oils" },
      { name: "Hair Masks", href: "/products?category=hair-care&sub=masks" },
      { name: "Styling", href: "/products?category=hair-care&sub=styling" },
      { name: "Treatments", href: "/products?category=hair-care&sub=treatments" },
    ],
  },
  {
    id: "personal-care",
    name: "Personal Care",
    href: "/products?category=personal-care",
    subCategories: [
      { name: "Body Lotion", href: "/products?category=personal-care&sub=body-lotion" },
      { name: "Body Wash", href: "/products?category=personal-care&sub=body-wash" },
      { name: "Hand Care", href: "/products?category=personal-care&sub=hand-care" },
      { name: "Deodorant", href: "/products?category=personal-care&sub=deodorant" },
    ],
  },
  {
    id: "baby-care",
    name: "Baby Care",
    href: "/products?category=baby-care",
    subCategories: [
      { name: "Baby Skincare", href: "/products?category=baby-care&sub=skincare" },
      { name: "Baby Bath", href: "/products?category=baby-care&sub=bath" },
      { name: "Baby Lotion", href: "/products?category=baby-care&sub=lotion" },
      { name: "Baby Gift Sets", href: "/products?category=baby-care&sub=gift-sets" },
    ],
  },
];

/** Support menu items grouped under a single "Support" entry. */
export const SUPPORT_MENU_ITEMS: SupportMenuItem[] = [
  { id: "faqs", name: "FAQs", href: ROUTES.FAQ },
  { id: "contact", name: "Contact Us", href: ROUTES.CONTACT },
  { id: "about", name: "About Us", href: ROUTES.ABOUT },
  { id: "shipping-returns", name: "Shipping & Returns", href: ROUTES.SHIPPING_RETURNS },
  { id: "privacy", name: "Privacy Policy", href: ROUTES.PRIVACY_POLICY },
];
