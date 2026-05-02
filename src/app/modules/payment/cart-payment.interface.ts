import { OrderItem, ShippingAddress } from '../order/order.interface';

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

export interface CartPaymentRequest {
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  currency?: string;
  notes?: string;
}

export interface CartPaymentResponse {
  status: boolean;
  message: string;
  data?: {
    clientSecret?: string;
    paymentIntentId?: string;
    sessionId?: string;
    paymentUrl?: string;
    paymentMethodType?: string;
  };
}

export interface CartPaymentMetadata {
  customerId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  currency?: string;
  notes?: string;
}
