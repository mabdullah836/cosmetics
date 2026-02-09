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

const ADDRESS_TYPE_LABELS: Record<AddressType, string> = {
  [ADDRESS_TYPE.SHIPPING]: "Shipping",
  [ADDRESS_TYPE.BILLING]: "Billing",
  [ADDRESS_TYPE.BOTH]: "Shipping & Billing",
};

export function getAddressTypeLabel(type: AddressType): string {
  return ADDRESS_TYPE_LABELS[type] ?? type;
}

const ORDER_STATUS_CLASSES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PENDING_CONFIRMATION: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const PAYMENT_STATUS_CLASSES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

export function getOrderStatusColor(status: string): string {
  return ORDER_STATUS_CLASSES[status] ?? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
}

export function getPaymentStatusColor(paymentStatus: string): string {
  return PAYMENT_STATUS_CLASSES[paymentStatus] ?? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
}
