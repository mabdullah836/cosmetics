/**
 * Order and payment status constants
 */
export const ORDER_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
} as const;

export const PAYMENT_METHOD = {
  COD: "COD",
  BANK_TRANSFER: "BANK_TRANSFER",
} as const;

export const STOCK_LEVEL = {
  IN_STOCK: "IN_STOCK",
  LOW_STOCK: "LOW_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  DISCONTINUED: "DISCONTINUED",
} as const;

export const ADDRESS_TYPE = {
  BILLING: "BILLING",
  SHIPPING: "SHIPPING",
  BOTH: "BOTH",
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type PaymentMethod = typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD];
export type StockLevel = typeof STOCK_LEVEL[keyof typeof STOCK_LEVEL];
export type AddressType = typeof ADDRESS_TYPE[keyof typeof ADDRESS_TYPE];
