export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderData {
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  notes?: string;
  currency?: string;
}

export interface OrderResponse {
  status: boolean;
  message: string;
  data?: {
    order: Order;
  };
}

export interface Order {
  _id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentIntentId?: string;
  stripePaymentId?: string;
  notes?: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderListResponse {
  status: boolean;
  message: string;
  data?: {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  };
}
