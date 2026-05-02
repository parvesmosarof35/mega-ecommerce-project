export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  PAID: 'paid',
  REFUNDED: 'refunded'
} as const;

export const PAYMENT_INTENT_TYPES = {
  PAYMENT: 'payment',
  SETUP: 'setup'
} as const;

export const CURRENCY = {
  USD: 'usd',
  EUR: 'eur',
  GBP: 'gbp'
} as const;

export const WEBHOOK_EVENTS = {
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_FAILED: 'payment_intent.payment_failed',
  PAYMENT_INTENT_CANCELED: 'payment_intent.canceled',
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed'
} as const;
