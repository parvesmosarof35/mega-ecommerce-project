export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const;

export const DEFAULT_CURRENCY = 'usd';

export const ORDER_LIMITS = {
  MAX_ITEMS_PER_ORDER: 50,
  MAX_AMOUNT: 1000000, // $1,000,000 in cents
} as const;
