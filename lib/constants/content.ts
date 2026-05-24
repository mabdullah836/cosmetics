/**
 * Static content and text constants
 */
import { Truck, Gift, Tag, Clock } from "lucide-react";
import { CONFIG } from "./config";
import { formatPrice } from "@/lib/utils/format";

export const SHIPPING_BANNER_MESSAGES = [
  {
    icon: Truck,
    text: `Free shipping on orders over ${formatPrice(CONFIG.FREE_SHIPPING_THRESHOLD)}`,
    highlight: "Free shipping",
    action: "Shop Now",
    code: null,
  },
  {
    icon: Gift,
    text: "Get 15% off your first order",
    highlight: "15% off",
    action: "Use Code",
    code: "BEAUTY15",
  },
  {
    icon: Tag,
    text: "New arrivals just dropped",
    highlight: "New arrivals",
    action: "Shop Now",
    code: null,
  },
  {
    icon: Clock,
    text: `Limited time: Free gift with ${formatPrice(CONFIG.FREE_GIFT_THRESHOLD)}+ orders`,
    highlight: "Free gift",
    action: "Shop Now",
    code: null,
  },
] as const;

export const FAQ_DATA = [
  {
    id: "shipping",
    question: "What are your shipping options?",
    answer:
      `Free shipping on orders over ${formatPrice(CONFIG.FREE_SHIPPING_THRESHOLD)}. Most orders are processed within 24-48 hours and delivered within 3-7 business days. International shipping available.`,
  },
  {
    id: "returns",
    question: "What is your return policy?",
    answer:
      "30-day satisfaction guarantee. Return unused products in original packaging for a full refund. Free returns for US customers.",
  },
  {
    id: "ingredients",
    question: "What ingredients do you use?",
    answer:
      "We use only clean, safe ingredients. No parabens, sulfates, or harmful chemicals.",
  },
  {
    id: "payment",
    question: "Is my payment information secure?",
    answer:
      "Yes. All payments are processed securely with SSL encryption. We accept major credit cards and PayPal.",
  },
] as const;

export const TRUST_BADGES = [
  {
    icon: "Truck",
    title: "Free Shipping",
    description: `On orders over ${formatPrice(CONFIG.FREE_SHIPPING_THRESHOLD)}`,
    color: "text-emerald-500",
  },
  {
    icon: "RotateCcw",
    title: "30-Day Returns",
    description: "Hassle-free returns",
    color: "text-blue-500",
  },
  {
    icon: "Shield",
    title: "Secure Payment",
    description: "100% secure checkout",
    color: "text-amber-500",
  },
  {
    icon: "Package",
    title: "Quality Guarantee",
    description: "Premium quality products",
    color: "text-purple-500",
  },
] as const;
