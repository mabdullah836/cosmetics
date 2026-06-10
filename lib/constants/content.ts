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
      `Free shipping on orders over ${formatPrice(CONFIG.FREE_SHIPPING_THRESHOLD)}. Most orders are processed within 24–48 hours and delivered across Pakistan within 3–7 business days.`,
  },
  {
    id: "returns",
    question: "What is your return policy?",
    answer:
      "14-day return window for unused products in original packaging. Changed your mind? You pay return delivery charges. Wrong or damaged item on our end? We cover return delivery and issue a full refund or replacement. Contact support with your order number to start a return.",
  },
  {
    id: "ingredients",
    question: "What ingredients do you use?",
    answer:
      "We use only clean, safe ingredients. No parabens, sulfates, or harmful chemicals.",
  },
  {
    id: "payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery (COD) and bank transfer. Pay on delivery or transfer to our bank account and share your payment confirmation with our support team.",
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
    title: "14-Day Returns",
    description: "Fair & transparent policy",
    color: "text-blue-500",
  },
  {
    icon: "Shield",
    title: "Flexible Payment",
    description: "COD & bank transfer",
    color: "text-amber-500",
  },
  {
    icon: "Package",
    title: "Quality Guarantee",
    description: "Premium quality products",
    color: "text-purple-500",
  },
] as const;
