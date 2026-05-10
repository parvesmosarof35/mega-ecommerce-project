import { Types } from "mongoose";

export interface OrderItem {
  productId: Types.ObjectId;
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
  phone: string;
  email?: string;
}

export interface CreateOrderData {
  customerId?: Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  notes?: string;
  currency?: string;
  isGuest?: boolean;
  guestName?: string;
  transactionId?: string;
  whatsappNumber?: string;
  extraInfo?: string;
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

export interface OrderResponse {
  status: boolean;
  message: string;
  data?: {
    order: Order;
  };
}

export interface Order {
  _id: string;
  customerId?: Types.ObjectId;
  isGuest?: boolean;
  guestName?: string;
  transactionId?: string;
  whatsappNumber?: string;
  extraInfo?: string;
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
