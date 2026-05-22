/**
 * Application configuration constants
 */
export const CONFIG = {
  // Shipping
  FREE_SHIPPING_THRESHOLD: 50,
  SHIPPING_COST: 5.99,
  EXPRESS_SHIPPING_COST: 999,
  FREE_GIFT_THRESHOLD: 7500,
  
  // Cart
  MIN_PASSWORD_LENGTH: 6,
  
  // Timeouts & Delays
  BANNER_SHOW_DELAY: 500,
  BANNER_ROTATION_INTERVAL: 8000,
  BANNER_DISMISS_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  FORM_REDIRECT_DELAY: 500,
  CART_MIGRATION_DELAY: 500,
  
  // Toast durations
  TOAST_DURATION: 3000,
  TOAST_SUCCESS_DURATION: 3000,
  
  // Pagination
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 10,
  REVIEWS_PER_PAGE: 10,
  
  // OTP
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,
  
  // Local Storage Keys
  STORAGE_KEYS: {
    CART: "cosmetics_cart",
    WISHLIST: "cosmetics_wishlist",
    BANNER_DISMISSED: "shippingBannerDismissed",
  },
  
  // Paths to hide banner
  HIDE_BANNER_PATHS: ["/checkout", "/admin", "/cart"],
} as const;
